import React from 'react';
import { Books } from '/imports/api/books/Books';
import { Listings } from '/imports/api/listings/Listings';
import { Grid, Segment, Header, Image } from 'semantic-ui-react';
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

/** Create a schema to specify the structure of the data to appear in the form. */
const formSchema = new SimpleSchema({
  price: String,
  ISBN: Number,
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
    isbn: 0,
    book: undefined,
    show_book: false,
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
    if (isbn.toString().length === 10 || isbn.toString().length === 13) {
      const book = Books.findOne({ isbn: isbn.toString() });
      this.setState({ isbn: isbn, book: book });
    }
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let fRef = null;
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Add Listing</Header>
            { this.state.book !== undefined &&
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Image size="small" src={this.state.book.image}/>
                  <Header as="h4">{this.state.book.title}</Header>
                </Grid.Column>
                <Grid.Column>
                  Author: {this.state.book.authors} <br/>
                  ISBN: {this.state.book.isbn} <br/>
                  Edition: {this.state.book.edition} <br/>
                  Publisher: {this.state.book.publisher} <br/>
                  Publish Date: {this.state.book.publish_date}
                </Grid.Column>
              </Grid.Row>
            }
            <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)}>
              <Segment>
                <TextField name='price'/>
                <NumField name='ISBN' decimal={false} onChange={this.handleChange.bind(this)} value={this.state.isbn}/>
                <TextField name='description'/>
                <SelectField name='binding'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

export default AddListing;
