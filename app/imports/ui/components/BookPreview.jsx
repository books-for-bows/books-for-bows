import React from 'react';
import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor';
import { Item } from 'semantic-ui-react';
import PropTypes from 'prop-types';

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
      const params = Meteor.settings.public.api_key ? {
        q: `isbn:${isbn}`,
        key: Meteor.settings.public.api_key,
      } : {
        q: `isbn:${isbn}`,
      };
      HTTP.get(
          url,
          {
            params,
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
    const style = { color: 'white' };
    return (
      <Item.Group>
        {(this.state.book_found ? this.renderPage() : (
          <Item>
            <Item.Image key="thumbnail" size="small" src='/images/no_cover_available.png'/>
            <Item.Content verticalAlign="middle">
              <Item.Header as="h3" style={style}>Book Not Found</Item.Header>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    );
  }

  renderPage() {
    const style = { color: 'white' };
    return (
      <Item>
        <Item.Image key="thumbnail" size="small"
                    src={this.state.book.imageLinks ? this.state.book.imageLinks.thumbnail :
                        '/images/no_cover_available.png'}/>
        <Item.Content verticalAlign="middle">
          <Item.Header as="h3" style={style}>{ this.state.book.subtitle ?
              `${this.state.book.title}: ${this.state.book.subtitle}` : `${this.state.book.title}`}
          </Item.Header>
          <Item.Description style={style}>
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
