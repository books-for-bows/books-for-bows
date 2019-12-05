import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Label } from 'semantic-ui-react';

export default class Book extends React.Component {

  render() {
    return (
      <Card>
        <Image src={ this.props.book.image }/>
        <Card.Content>
          <Card.Header>{ this.props.book.title }</Card.Header>
          <Card.Meta>
            { this.props.book.author }
            <br/>
            ISBN: { this.props.book.ISBN }
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Label color='blue'>{ this.props.book.course }</Label>
        </Card.Content>
      </Card>
    );
  }
}

Book.propTypes = {
  book: PropTypes.object.isRequired,
};
