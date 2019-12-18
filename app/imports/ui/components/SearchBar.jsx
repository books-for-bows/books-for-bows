import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Grid, Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Redirect } from 'react-router';
import { CourseBooks } from '../../api/coursebooks/CourseBooks';
import { Books } from '../../api/books/Books';
import { Listings } from '../../api/listings/Listings';

const resultRenderer = ({ title, description, picture }) => <Card>
  <Card.Content>
    <Image
        floated='right'
        size='mini'
        src={picture}
    />
    <Card.Header>{title}</Card.Header>
    <Card.Description>{description}</Card.Description>
  </Card.Content>
</Card>;

resultRenderer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  picture: PropTypes.string,
};

class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      results: [],
      renderResults: false,
      title: '',
    };
  }

  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '', title: '' });

  handleResultSelect = () => {
    this.setState({ renderResults: true });
  };

  handleSearchChange = (e, { value }) => {
    {
      this.setState({ isLoading: true, value });
    }

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
      const isMatch = result => re.test(result.title);

      this.setState({
        isLoading: false,
        results: _.filter(this.props.books, isMatch),
      });
      console.log(this.state.results);
    }, 300);

  };

  render() {
    const { isLoading, value, results } = this.state;

    if (this.state.renderResults) {
      return <Redirect to={{
        pathname: '/books',
        state: { referrer: results },
      }}/>;
    }

    return (
        <Grid>
          <Grid.Column>
            <Search fluid
                    placeholder='ISBN'
                    loading={isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 500, {
                      leading: true,
                    })}
                    results={results}
                    value={value}
                    resultRenderer={resultRenderer}
                    {...this.props}
            />
          </Grid.Column>
        </Grid>
    );
  }
}

/** Require an array of Food documents in the props. */
SearchBar.propTypes = {
  books: PropTypes.object.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Get access to books documents.
  const subscription = Meteor.subscribe('CourseBooks');
  const subscription2 = Meteor.subscribe('Books');
  const subscription3 = Meteor.subscribe('Listings');

  return {
    books: CourseBooks.find().fetch(),
    books2: Books.find().fetch(),
    listing: Listings.find().fetch(),

    ready: subscription.ready(),
    ready2: subscription2.ready(),
    ready3: subscription3.ready(),

  };
})(SearchBar);
