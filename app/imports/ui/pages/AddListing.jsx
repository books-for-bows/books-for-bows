import React from 'react';
import { Listings } from '/imports/api/listings/Listings';
import { Grid, Segment, Header, Item } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import NumField from 'uniforms-semantic/NumField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
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
    book_found: undefined,
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
    if (isbn && (isbn.toString().length === 10 || isbn.toString().length === 13)) {
      const url = 'https://www.googleapis.com/books/v1/volumes';
      HTTP.get(
        url,
        {
          params: {
            q: `isbn:${isbn.toString()}`,
            // key: Meteor.settings.public.api_key,
          },
        },
        (error, result) => {
          if (!error) {
            const book = result.data.items[0].volumeInfo;
            if (book !== undefined) {
              this.setState({ isbn: isbn, book: book, book_found: true });
            } else {
              this.setState({ isbn: isbn, book_found: false });
            }
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
              { this.state.book !== undefined && this.state.book_found &&
              <Item.Group divided>
                <Item>
                  { this.state.book.imageLinks && this.state.book.imageLinks.thumbnail ? ([
                    <Item.Image key="thumbnail" size="small" src={this.state.book.imageLinks.thumbnail}/>,
                  ]) : 'No Cover Found'}
                  <Item.Content verticalAlign="middle">
                    <Item.Header as="h3">{ this.state.book.subtitle ?
                        `${this.state.book.title}: ${this.state.book.subtitle}` : `${this.state.book.title}`}
                    </Item.Header>
                    <Item.Description>
                      Author: {this.state.book.authors ?
                        this.state.book.authors.map(author => `${author}, `) : 'None'}<br/>
                      ISBN: {this.state.book.industryIdentifiers[0].identifier} <br/>
                      Publisher: {this.state.book.publisher} <br/>
                      Publish Date: {this.state.book.publishedDate}
                    </Item.Description>
                  </Item.Content>
                </Item>
              </Item.Group>
              }
              { this.state.book_found === false &&
              <Header as="h4">Book Not Found.</Header>
              }
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)}>
                <Segment>
                  <TextField name='price'/>
                  <NumField name='ISBN' decimal={false} onChange={this.handleChange.bind(this)}
                            value={this.state.isbn}/>
                  <TextField name='description'/>
                  <SelectField name='binding'/>
                  <SubmitField value='Submit'/>
                  <ErrorsField/>
                </Segment>
              </AutoForm>
            </Grid.Column>
          </Grid.Row>


          {/*<Grid.Column>*/}
          {/*  { this.state.book !== undefined && this.state.book_found &&*/}
          {/*    <Grid.Row centered>*/}
          {/*      <Grid.Column>*/}
          {/*        <Item.Group>*/}
          {/*          <Item>*/}
          {/*            { this.state.book.imageLinks && this.state.book.imageLinks.thumbnail ? ([*/}
          {/*              <Item.Image key="thumbnail" size="small" src={this.state.book.imageLinks.thumbnail}/>,*/}
          {/*            ]) : 'No Cover Found'}*/}
          {/*            <Item.Content verticalAlign="middle">*/}
          {/*              <Item.Header as="h3">{ this.state.book.subtitle ?*/}
          {/*                  `${this.state.book.title}: ${this.state.book.subtitle}` : `${this.state.book.title}`}*/}
          {/*              </Item.Header>*/}
          {/*              <Item.Description>*/}
          {/*                Author: {this.state.book.authors ?*/}
          {/*                  this.state.book.authors.map(author => `${author}, `) : 'None'}<br/>*/}
          {/*                ISBN: {this.state.book.industryIdentifiers[0].identifier} <br/>*/}
          {/*                Publisher: {this.state.book.publisher} <br/>*/}
          {/*                Publish Date: {this.state.book.publishedDate}*/}
          {/*              </Item.Description>*/}
          {/*            </Item.Content>*/}
          {/*          </Item>*/}
          {/*        </Item.Group>*/}
          {/*      </Grid.Column>*/}
          {/*    </Grid.Row>*/}
          {/*  }*/}
          {/*  { this.state.book_found === false &&*/}
          {/*      <Header as="h4">Book Not Found.</Header>*/}
          {/*  }*/}
          {/*  <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)}>*/}
          {/*    <Segment>*/}
          {/*      <TextField name='price'/>*/}
          {/*      <NumField name='ISBN' decimal={false} onChange={this.handleChange.bind(this)} value={this.state.isbn}/>*/}
          {/*      <TextField name='description'/>*/}
          {/*      <SelectField name='binding'/>*/}
          {/*      <SubmitField value='Submit'/>*/}
          {/*      <ErrorsField/>*/}
          {/*    </Segment>*/}
          {/*  </AutoForm>*/}
          {/*</Grid.Column>*/}
        </Grid>
      </div>
    );
  }
}

export default AddListing;
