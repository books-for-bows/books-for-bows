import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Grid, Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Redirect } from 'react-router';
import { Books } from '../../api/books/Books';

const resultRenderer = ({ name, description, picture }) => <Card>
  <Card.Content>
    <Image
        floated='right'
        size='mini'
        src={picture}
    />
    <Card.Header>{name}</Card.Header>
    <Card.Description>{description}</Card.Description>
  </Card.Content>
</Card>;

resultRenderer.propTypes = {
  name: PropTypes.string,
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
      name: '',
    };
  }

  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' });

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
      const isMatch = result => re.test(result.name);

      this.setState({
        isLoading: false,
        results: _.filter(this.props.books, isMatch),
      });
    }, 300);
  };

  render() {
    const { isLoading, value, results } = this.state;

    if (this.state.renderResults) {
      return <Redirect to={{
        pathname: '/Books',
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
  const subscription = Meteor.subscribe('Books');
  return {
    books: Books.find().fetch(),
    ready: subscription.ready(),
  };
})(SearchBar);
