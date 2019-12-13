import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Table, Header, Loader, Grid, Item } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { HTTP } from 'meteor/http';
import PropTypes from 'prop-types';
import { Listings } from '../../api/listings/Listings';

import ListingItem from '../components/ListingItem';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class Shelf extends React.Component {

  state = {
    book_ready: false,
    book: {},
  };

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    this.getBook();
    return (this.props.ready && this.state.book_ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  getBook() {
    if (!this.state.book_ready) {
      const url = 'https://www.googleapis.com/books/v1/volumes';
      HTTP.get(
          url,
          {
            params: {
              q: `isbn:${this.props.book_isbn.toString()}`,
              // key: Meteor.settings.public.api_key,
            },
          },
          (error, result) => {
            if (!error) {
              if (result.data.items.length === 1) {
                this.setState({ book: result.data.items[0].volumeInfo, book_ready: true });
              } else {
                this.setState({ book_ready: false });
              }
            }
          },
      );
    }
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <div>
          <Header as="h1" textAlign="center">Shelf</Header>
          <Grid celled container>
            <Grid.Row stretched>
              <Grid.Column verticalAlign="middle" width={6}>
                <Item.Group>
                  <Item>
                    { this.state.book.imageLinks.thumbnail ? ([
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
              </Grid.Column>
              <Grid.Column width={10}>
              <Table celled padded striped>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Price</Table.HeaderCell>
                    <Table.HeaderCell>Binding</Table.HeaderCell>
                    <Table.HeaderCell>Seller</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    { Meteor.user().roles && Meteor.user().roles.indexOf('admin') > -1 ? ([
                      <Table.HeaderCell key={0}>Edit</Table.HeaderCell>,
                      <Table.HeaderCell key={1}>Delete</Table.HeaderCell>,
                    ]): null }
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                {Listings.find().fetch().map((listing, index) => <ListingItem key={index} listing={listing} />)}
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
  const subscription1 = Meteor.subscribe('Listings');
  const subscription2 = Meteor.subscribe('Books');

  return {
    ready: subscription1.ready() && subscription2.ready(),
    book_isbn: match.params.isbn,
  };
})(Shelf);
