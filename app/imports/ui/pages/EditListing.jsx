import React from 'react';
import { Grid, Loader, Header, Segment, Image } from 'semantic-ui-react';
import swal from 'sweetalert';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import NumField from 'uniforms-semantic/NumField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import HiddenField from 'uniforms-semantic/HiddenField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import 'uniforms-bridge-simple-schema-2';
import { HTTP } from 'meteor/http';
import { Listings, ListingsSchema } from '/imports/api/listings/Listings';
import { Redirect } from 'react-router'; // required for Uniforms

/** Renders the Page for editing a single document. */
class EditListing extends React.Component {

  state = {
    redirect: false,
    isbn: 0,
    book: undefined,
    book_found: undefined,
  };

  /** On successful submit, insert the data. */
  submit(data) {
    const { price, ISBN, description, binding, _id } = data;
    Listings.update(_id, { $set: { price, ISBN, description, binding } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Listing updated successfully', 'success')));
    this.setState({ redirect: true });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  handleChange(isbn) {
    if (isbn.toString().length === 10 || isbn.toString().length === 13) {
      const url = 'https://www.googleapis.com/books/v1/volumes';
      HTTP.get(
          url,
          {
            params: {
              q: `isbn:${isbn.toString()}`,
              key: Meteor.settings.public.api_key,
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
  renderPage() {
    this.handleChange(this.props.doc.ISBN);
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Edit Listing</Header>
            { this.state.book !== undefined && this.state.book_found &&
            <Grid.Row columns={2}>
              <Grid.Column>
                { this.state.book.imageLinks.thumbnail ? ([
                  <Image size="small" key="cover" src={this.state.book.imageLinks.thumbnail}/>,
                ]) : 'No Cover Found'
                }
                <Header as="h4">{this.state.book.subtitle ?
                    `${this.state.book.title}: ${this.state.book.subtitle}` : `${this.state.book.title}`}</Header>
              </Grid.Column>
              <Grid.Column>
                Author: {this.state.book.authors ?
                  this.state.book.authors.map(author => `${author}, `) : 'None'} <br/>
                ISBN: {this.state.isbn} <br/>
                Publisher: {this.state.book.publisher}<br/>
                Publish Date: {this.state.book.publishedDate ? this.state.book.publishedDate : 'None'}
              </Grid.Column>
            </Grid.Row>
            }
            <AutoForm schema={ListingsSchema} onSubmit={data => this.submit(data)} model={this.props.doc}>
              <Segment>
                <TextField name='price'/>
                <NumField name='ISBN' decimal={false} onChange={this.handleChange.bind(this)}/>
                <TextField name='description'/>
                <SelectField name='binding'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
                <HiddenField name='seller' />
              </Segment>
            </AutoForm>
            {this.state.redirect && <Redirect to="/profile" />}

          </Grid.Column>
        </Grid>
    );
  }
}

/** Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use. */
EditListing.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Listings');
  return {
    doc: Listings.findOne(documentId),
    ready: subscription.ready(),
  };
})(EditListing);
