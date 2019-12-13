import React from 'react';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Card, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Book = (props) => (
      <Card>
        { props.book.imageLinks ?
            <Image key="cover" wrapped ui={false} src={props.book.imageLinks.thumbnail}/> : '' }
        <Card.Content>
          <Card.Header>{ props.book.subtitle ?
              `${props.book.title}: ${props.book.subtitle}` : `${props.book.title}`}</Card.Header>
          <Card.Meta>
            { _.map(props.book.authors, (author) => `${author}, `) }
            <br/>
            ISBN: { props.book.industryIdentifiers[0].identifier }
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Link to={`/shelf/${props.book.industryIdentifiers[0].identifier}`}>View Listing</Link>
        </Card.Content>
      </Card>
);

Book.propTypes = {
  book: PropTypes.object.isRequired,
};

export default Book;
