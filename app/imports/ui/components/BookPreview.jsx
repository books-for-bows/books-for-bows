import React from 'react';
import { Item } from 'semantic-ui-react';
import PropTypes from 'prop-types';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class BookPreview extends React.Component {
  render() {
    return (
      <Item.Group>
        { this.props.book === undefined ? (
            <Item>
              <Item.Image key="thumbnail" size="small" src='/images/book-not-found-temp.png'/>
              <Item.Content verticalAlign="middle">
                <Item.Header as="h3">Book Not Found</Item.Header>
              </Item.Content>
            </Item>
          ) : (
            <Item>
              <Item.Image key="thumbnail" size="small"
                          src={this.props.book.imageLinks ? this.props.book.imageLinks.thumbnail :
                              '/images/book-not-found-temp.png'}/>
              <Item.Content verticalAlign="middle">
                <Item.Header as="h3">{ this.props.book.subtitle ?
                    `${this.props.book.title}: ${this.props.book.subtitle}` : `${this.props.book.title}`}
                </Item.Header>
                <Item.Description>
                  Author: {this.props.book.authors ? this.props.book.authors.map(author => `${author}, `) : 'None'}<br/>
                  { this.props.book.industryIdentifiers.map((identifier, index) => {
                        const string = `${identifier.type.replace('_', '')}: ${identifier.identifier}`;
                        return [<span key={-(index + 1)}>{ string }</span>, <br key={index}/>];
                  })}
                  Publisher: {this.props.book.publisher} <br/>
                  Publish Date: {this.props.book.publishedDate}
                </Item.Description>
              </Item.Content>
            </Item>
          )
        }
      </Item.Group>
    );
  }
}

/** Require a document to be passed to this component. */
BookPreview.propTypes = {
  book: PropTypes.object,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default BookPreview;
