import React from 'react';
import { Listings } from '/imports/api/listings/Listings';
import { Grid, Segment, Header } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import NumField from 'uniforms-semantic/NumField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
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

    this.state = {
      isbn: '',
      isbn_13: '',
    };
  }

  /** On submit, insert the data. */
  submit(data, formRef) {
    this.setState({ isbn: '' });
    const { price, description, binding } = data;
    const seller = Meteor.user().username;
    Listings.insert({ seller, price, ISBN: this.state.isbn_13, description, binding },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item added successfully', 'success');
          formRef.reset();
        }
      });
  }

  handleChange(field, value) {
    if (field === 'ISBN') {
      this.setState({ isbn: value });
      if (value.length === 10) {
        this.setState({ isbn: value, isbn_13: this.toISBN13(value) });
      } else if (value.length === 13) {
        this.setState({ isbn_13: value });
      }
    }
  }

  toISBN13(isbn) {
    let isbn10 = isbn.toString().trim();
    isbn10 = `978${isbn10}`;
    isbn10 = isbn10.substring(0, 12);
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += isbn10.charAt(i) * ((i % 2 === 0) ? 1 : 3);
    }
    sum %= 10;
    return isbn10 + ((sum > 0) ? 10 - sum : 0);
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
              <BookPreview isbn={ this.state.isbn }/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)}
                onChange={this.handleChange.bind(this)}>
                <Segment>
                  <TextField name='ISBN' value={this.state.isbn}/>
                  <NumField name='price'/>
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
