import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Table, Header, Loader, Grid, Image } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Listings } from '../../api/listings/Listings';
import { Books } from '../../api/books/Books';

import ListingItem from '../components/ListingItem';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class Shelf extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const book = Books.findOne({ _id: this.props.book_id });

    return (
        <Container>
          <Header as="h1" textAlign="center">Shelf</Header>
          <Grid columns={4} container>
            <Grid.Column width={4}>
              <Image size="medium" centered src={book.image}/>
              <Header as="h2">{book.title}</Header>
              <Grid>
                <Grid.Column>
                  Author: {book.authors} <br/>
                  ISBN: {book.isbn} <br/>
                  Edition: {book.edition} <br/>
                  Publisher: {book.publisher} <br/>
                  Publish Date: {book.publish_date}
                </Grid.Column>
              </Grid>
            </Grid.Column>
            <Grid.Column width={4}>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Price</Table.HeaderCell>
                    <Table.HeaderCell>Condition</Table.HeaderCell>
                    <Table.HeaderCell>Binding</Table.HeaderCell>
                    <Table.HeaderCell>Seller</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {Listings.find().fetch().map((listing) => <ListingItem key={listing.isbn} listing={listing} />)}
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid>
        </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
Shelf.propTypes = {
  book_id: PropTypes.string.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get access to Stuff documents.
  const subscription1 = Meteor.subscribe('Listings');
  const subscription2 = Meteor.subscribe('Books');

  return {
    ready: subscription1.ready() && subscription2.ready(),
    book_id: match.params._id,
  };
})(Shelf);
