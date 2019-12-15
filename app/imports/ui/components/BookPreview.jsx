import React from 'react';
import { HTTP } from 'meteor/http';
import { Item } from 'semantic-ui-react';
import PropTypes from 'prop-types';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class BookPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      book: undefined,
      book_found: false,
    };
  }

  componentDidMount() {
    this.getBook(this.props.isbn);
  }

  componentWillReceiveProps(nextProps) {
    this.getBook(nextProps.isbn);
  }

  getBook(isbn) {
    if (isbn && (isbn.length === 10 || isbn.length === 13)) {
      const url = 'https://www.googleapis.com/books/v1/volumes';
      HTTP.get(
          url,
          {
            params: {
              q: `isbn:${isbn}`,
              // key: Meteor.settings.public.api_key,
            },
          },
          (error, result) => {
            if (!error) {
              if (result.data.totalItems > 0) {
                const book = result.data.items[0].volumeInfo;
                if (book !== undefined) {
                  this.setState({ book: book, book_found: true });
                } else {
                  this.setState({ book: undefined, book_found: false });
                }
              } else {
                this.setState({ book: undefined, book_found: false });
              }
            } else {
              this.setState({ book: undefined, book_found: false });
            }
          },
      );
    } else {
      this.setState({ book: undefined, book_found: false });
    }
  }

  render() {
    return (
      <Item.Group>
        {(this.state.book_found ? this.renderPage() : (
          <Item>
            <Item.Image key="thumbnail" size="small" src='/images/book-not-found-temp.png'/>
            <Item.Content verticalAlign="middle">
              <Item.Header as="h3">Book Not Found</Item.Header>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    );
  }

  renderPage() {
    return (
      <Item>
        <Item.Image key="thumbnail" size="small"
                    src={this.state.book.imageLinks ? this.state.book.imageLinks.thumbnail :
                        '/images/book-not-found-temp.png'}/>
        <Item.Content verticalAlign="middle">
          <Item.Header as="h3">{ this.state.book.subtitle ?
              `${this.state.book.title}: ${this.state.book.subtitle}` : `${this.state.book.title}`}
          </Item.Header>
          <Item.Description>
            Author: {this.state.book.authors ? this.state.book.authors.map(author => `${author}, `) : 'None'}<br/>
            { this.state.book.industryIdentifiers.map((identifier, index) => {
              const string = `${identifier.type.replace('_', '')}: ${identifier.identifier}`;
              return [<span key={-(index + 1)}>{ string }</span>, <br key={index}/>];
            })}
            Publisher: {this.state.book.publisher} <br/>
            Publish Date: {this.state.book.publishedDate}
          </Item.Description>
        </Item.Content>
      </Item>
    );
  }
}

/** Require a document to be passed to this component. */
BookPreview.propTypes = {
  isbn: PropTypes.string,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default BookPreview;
