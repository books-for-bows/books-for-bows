import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Loader, Card } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Books } from '../../api/books/Books.js';
import { Listings } from '../../api/listings/Listings.js';
import Book from '../components/Book.jsx';

/** Renders the Profile Collection as a set of Cards. */
class Marketplace extends React.Component {
  /** Render the page once subscriptions have been received. */
  render() {
    return (
        <Container>
          <Card.Group>
            {_.map(this.props.books, (book) => <Book key={book.isbn} book={book}/>)}
          </Card.Group>
        </Container>
    );
  }
}

Marketplace.propTypes = {
  ready: PropTypes.bool.isRequired,
  books: PropTypes.object.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe('Books');
  const sub2 = Meteor.subscribe('Listings');
  return {
    ready: sub1.ready() && sub2.ready(),
    books: Books.find({}).fetch(),
  };
})(Marketplace);
