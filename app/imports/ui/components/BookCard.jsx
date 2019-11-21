import React from 'react';
import { Card, Image, Label, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';

const MakeCard = (props) => (
    <Card>
      <Image floated='right' size='mini' src={props.book.picture} />
      <Card.Content>
        <Card.Header>{props.book.firstName} {props.book.lastName}</Card.Header>
        <Card.Meta>
          <span className='date'>{props.book.title}</span>
        </Card.Meta>
        <Card.Description>
          {props.book.bio}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        {_.map(props.book.interests,
            (interest, index) => <Label key={index} size='tiny' color='teal'>{interest}</Label>)}
      </Card.Content>
      <Card.Content extra>
        <Header as='h5'>Projects</Header>
        {_.map(props.book.projects, (project, index) => <Image key={index} size='mini' src={project}/>)}
      </Card.Content>
    </Card>
);

MakeCard.propTypes = {
  book: PropTypes.object.isRequired,
};

export default MakeCard;
