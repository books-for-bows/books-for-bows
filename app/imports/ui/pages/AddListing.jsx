import React from 'react';
import { Listings } from '/imports/api/listings/Listings';
import { Grid, Segment, Header } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import BookPreview from '../components/BookPreview';

/** Create a schema to specify the structure of the data to appear in the form. */
const formSchema = new SimpleSchema({
  price: String,
  ISBN: String,
  description: String,
  binding: {
    type: String,
    allowedValues: ['loose leaf', 'spiral', 'paperback', 'hardcover'],
    defaultValue: 'loose leaf',
  },
});

/** Renders the Page for adding a document. */
class AddListing extends React.Component {

  constructor(props) {
    super(props);
    Meteor.subscribe('Books');
  }

  state = {
    isbn: '',
    book: undefined,
    book_found: false,
  };

  /** On submit, insert the data. */
  submit(data, formRef) {
    const { price, ISBN, description, binding } = data;
    const seller = Meteor.user().username;
    Listings.insert({ seller, price, ISBN, description, binding },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item added successfully', 'success');
          formRef.reset();
        }
      });
  }

  handleChange(isbn) {
    this.setState({ isbn: isbn });
    console.log(this.state);
    if (isbn && (isbn.length === 10 || isbn.length === 13)) {
      const url = 'https://www.googleapis.com/books/v1/volumes';
      HTTP.get(
        url,
        {
          params: {
            q: `isbn:${isbn}`,
            // key: Meteor.settings.public.api_key,
          },
        },
        (error, result) => {
          if (!error) {
            if (result.data.totalItems > 0) {
              const book = result.data.items[0].volumeInfo;
              if (book !== undefined) {
                this.setState({ book: book, book_found: true });
              } else {
                this.setState({ book: undefined, book_found: false });
              }
            } else {
              this.setState({ book: undefined, book_found: false });
            }
          } else {
            this.setState({ book: undefined, book_found: false });
          }
        },
      );
    }
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let fRef = null;
    return (
      <div>
        <Header as="h2" textAlign="center">Add Listing</Header>
        <Grid container centered>
          <Grid.Row centered columns={12}>
            <Grid.Column width={6}>
              <BookPreview book={ this.state.book } book_found={ this.state.book_found }/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)}>
                <Segment>
                  <TextField name='ISBN' onChange={this.handleChange.bind(this)} value={this.state.isbn}/>
                  <TextField name='price'/>
                  <TextField name='description'/>
                  <SelectField name='binding'/>
                  <SubmitField value='Submit'/>
                  <ErrorsField/>
                </Segment>
              </AutoForm>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default AddListing;
