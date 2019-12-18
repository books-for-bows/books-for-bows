import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Card, Loader, Header, Grid, Input } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { HTTP } from 'meteor/http';
import { _ } from 'meteor/underscore';
import { Listings } from '../../api/listings/Listings.js';
import Book from '../components/Book.jsx';

/** Renders the Profile Collection as a set of Cards. */
class Marketplace extends React.Component {
  state = {
    books: [],
    books_ready: false,
    searchInput: '',
    searchValue: '',
  };

  updateSearchValue(event) {
    this.setState({ searchInput: event.target.value });
  }

  handleSearchClick(c) {
    if (c.key === 'Enter') {
      this.setState({ searchValue: this.state.searchInput });
    }
  }

  handleSearchButton() {
    this.setState({ searchValue: this.state.searchInput });
  }

  searchReset() {
    this.setState({ searchInput: '' });
    this.setState({ searchValue: '' });
  }

  getBooks() {
    if (!this.state.books_ready) {
      const url = 'https://www.googleapis.com/books/v1/volumes';
      const listings = Listings.find({}).fetch();
      const listingsUnique = _.uniq(_.pluck(listings, 'ISBN'));
      _.each(listingsUnique, (book) => {
        const params = Meteor.settings.public.api_key ? {
          q: `isbn:${book}`,
          key: Meteor.settings.public.api_key,
        } : {
          q: `isbn:${book}`,
        };
        HTTP.get(
            url,
            {
              params,
            },
            (error, result) => {
              if (!error) {
                if (result.data.totalItems > 0) {
                  this.state.books.push(result.data.items[0].volumeInfo);
                  if (this.state.books.length === listingsUnique.length) {
                    this.setState({ books_ready: true });
                  }
                }
              }
            },
        );
      });
    }
  }

  /** Render the page once subscriptions have been received. */
  render() {
    this.getBooks();
    if (this.props.empty) {
      return this.renderEmpty();
    }
    return (this.state.books_ready && this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    const searchStyle = { paddingLeft: '100px', paddingRight: '100px' };
    const searchedBooks = this.state.books.filter(
        (books) => books.title.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1 ||
            books.industryIdentifiers[0].identifier.toLowerCase()
                .indexOf(this.state.searchValue.toLowerCase().replace(/-/g, '')) !== -1 ||
            books.industryIdentifiers[1].identifier.toLowerCase()
                .indexOf(this.state.searchValue.toLowerCase().replace(/-/g, '')) !== -1,
    );

    return (
        <Container>
          <Grid>
            <Grid.Row centered>
              <Grid.Column style={searchStyle}>
                <div id='store-search'>
                  <Input
                      type='text'
                      value={this.state.searchInput}
                      fluid
                      size='large'
                      onChange={this.updateSearchValue.bind(this)}
                      onKeyPress={this.handleSearchClick.bind(this)}
                      placeholder='Search Title or ISBN...'
                      action={{ icon: 'search', onClick: () => this.handleSearchButton() }}
                  />
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Card.Group centered>
            { this.state.books_ready ?
                _.map(searchedBooks, (book, index) => <Book key={index} book={book}/>) : ''}
          </Card.Group>
        </Container>
    );
  }

  renderEmpty() {
    return (
        <Container>
          <Header as='h1' textAlign='center'>No books currently on the Marketplace</Header>
        </Container>
    );
  }
}

Marketplace.propTypes = {
  ready: PropTypes.bool.isRequired,
  empty: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub = Meteor.subscribe('Listings');
  return {
    ready: sub.ready(),
    empty: Listings.find().fetch().length === 0,
  };
})(Marketplace);
