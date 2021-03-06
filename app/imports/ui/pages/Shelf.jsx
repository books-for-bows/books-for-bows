import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Table, Header, Loader, Grid } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { Listings } from '../../api/listings/Listings';

import ListingItem from '../components/ListingItem';
import BookPreview from '../components/BookPreview';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class Shelf extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader inverted active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const listings = Listings.find({ ISBN: this.props.book_isbn }).fetch();
    return (
        <div>
          <Header as="h1" textAlign="center" inverted>Shelf</Header>
          <Grid celled container>
            <Grid.Row stretched centered>
              <Grid.Column width={6}>
                <BookPreview isbn={ this.props.book_isbn }/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched>
              <Grid.Column>
              <Table celled padded striped>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Price</Table.HeaderCell>
                    <Table.HeaderCell>Binding</Table.HeaderCell>
                    <Table.HeaderCell>Seller</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    { Roles.userIsInRole(Meteor.userId(), 'admin') ? ([
                      <Table.HeaderCell key={0}>Edit</Table.HeaderCell>,
                      <Table.HeaderCell key={1}>Delete</Table.HeaderCell>,
                    ]) : null }
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {listings.length === 0 && <Redirect to={'/marketplace'}/>}
                { listings
                    .map((listing, index) => <ListingItem
                        key={index}
                        listing={listing}
                        length={listings.length}
                    />)}
                </Table.Body>
                </Table>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
    );
  }
}

/** Require an array of Stuff documents in the props. */
Shelf.propTypes = {
  book_isbn: PropTypes.string.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Listings');

  return {
    ready: subscription.ready(),
    book_isbn: match.params.isbn,
  };
})(Shelf);
