import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Table, Header, Loader, Grid, Image } from 'semantic-ui-react';
import { Listings } from '/imports/api/listing/Listings';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import ListingItem from '../components/ListingItem';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class Shelf extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <Container>
          <Header as="h1" textAlign="center">Shelf</Header>
          <Grid columns={4} container>
            <Grid.Column width={4}>
              <Image size="medium" centered src={this.props.book.image}/>
              <Header as="h2">{this.props.book.title}</Header>
              <Grid>
                <Grid.Column>
                  Author: {this.props.book.author} <br/>
                  ISBN: {this.props.book.isbn} <br/>
                  Edition: {this.props.book.edition} <br/>
                  Publisher: {this.props.book.publisher} <br/>
                  Publish Date: {this.props.book.date_published}
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
                  {this.props.listings.map((listing) => <ListingItem key={listing.isbn} listing={listing} />)}
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
  book: PropTypes.object.isRequired,
  listings: PropTypes.array.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Listings');
  return {
    listings: Listings.find({}).fetch(),
    ready: subscription.ready(),
  };
})(Shelf);
