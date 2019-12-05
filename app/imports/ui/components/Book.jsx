import React from 'react';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Card, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Book = (props) => (
      <Card>
        <Image src={ props.book.image }/>
        <Card.Content>
          <Card.Header>{ props.book.title }</Card.Header>
          <Card.Meta>
            { _.map(props.book.authors, (author) => author) }
            <br/>
            ISBN: { props.book.isbn }
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Link to={`/shelf/${props.book._id}`}>View Listing</Link>
        </Card.Content>
      </Card>
);

Book.propTypes = {
  book: PropTypes.object.isRequired,
};

export default Book;
