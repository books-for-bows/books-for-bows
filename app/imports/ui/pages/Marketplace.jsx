import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Card, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { HTTP } from 'meteor/http';
import { _ } from 'meteor/underscore';
import { Listings } from '../../api/listings/Listings.js';
import Book from '../components/Book.jsx';

/** Renders the Profile Collection as a set of Cards. */
class Marketplace extends React.Component {

  getBooks() {
    const url = 'https://www.googleapis.com/books/v1/volumes';
    const listings = Listings.find({}).fetch();
    console.log(listings);
    _.each(_.uniq(_.pluck(listings, 'ISBN')), (book) => {
      HTTP.get(
          url,
          {
            params: {
              q: `isbn:${book}`,
              // key: Meteor.settings.public.api_key,
            },
          },
          (error, result) => {
            if (!error) {
              this.props.books.push(result.data.items[0].volumeInfo);
            }
          },
      );
    });
    console.log(this.props.books);
  }

  /** Render the page once subscriptions have been received. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    this.getBooks();
    return (
        <Container>
          <Card.Group>
            {_.map(this.props.books, (book) => <Book index={book.industryIdentifiers[0]} book={book}/>)}
          </Card.Group>
        </Container>
    );
  }
}

Marketplace.propTypes = {
  ready: PropTypes.bool.isRequired,
  books: PropTypes.array,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub = Meteor.subscribe('Listings');
  return {
    ready: sub.ready(),
    books: [],
  };
})(Marketplace);
