import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Image, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { CourseBooks } from '../../api/coursebooks/CourseBooks';

class Book extends React.Component {
  render() {
    return (
      <Card>
        <Image key="cover" wrapped ui={false} src={this.props.book.imageLinks ? this.props.book.imageLinks.thumbnail :
            '/images/book-not-found-temp.png'}/>
        <Card.Content>
          <Card.Header>{this.props.book.subtitle ?
              `${this.props.book.title}: ${this.props.book.subtitle}` : `${this.props.book.title}`}</Card.Header>
          <Card.Meta>
            {_.map(this.props.book.authors, (author) => `${author}, `)}
            <br/>
            {this.props.book.industryIdentifiers.map((identifier, index) => {
              const string = `${identifier.type.replace('_', '')}: ${identifier.identifier}`;
              return [<span key={-(index + 1)}>{string}</span>, <br key={index}/>];
            })}
          </Card.Meta>
        </Card.Content>
        {this.props.courses.length > 0 ? (
            <Card.Content extra>
              <Label.Group>
                {_.map(_.uniq(this.props.courses,
                    (coursebook) => coursebook.course), (coursebook, index) => <Label color='blue' key={index}>
                  {coursebook.dept} {coursebook.course}</Label>)}
              </Label.Group>
            </Card.Content>
        ) : '' }
        <Card.Content extra>
          <Link to={`/shelf/${_.findWhere(this.props.book.industryIdentifiers, { type: 'ISBN_13' }).identifier}`}>
            View Listings
          </Link>
        </Card.Content>
      </Card>
    );
  }

}

Book.propTypes = {
  book: PropTypes.object.isRequired,
  courses: PropTypes.array,
};

export default withTracker((props) => {
  const subscription = Meteor.subscribe('CourseBooks');
  return {
    ready: subscription.ready(),
    courses: CourseBooks.find({
        isbn: _.findWhere(props.book.industryIdentifiers, { type: 'ISBN_13' }).identifier }).fetch(),
  };
})(Book);
