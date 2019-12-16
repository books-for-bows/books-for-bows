import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Redirect } from 'react-router';
import { Projects } from '../../api/projects/Projects';

class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      results: [],
      renderResults: false,
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
        results: _.filter(this.props.locations, isMatch),
      });
    }, 300);
  };

  render() {
    const { isLoading, value, results } = this.state;

    if (this.state.renderResults) {
      return <Redirect to={{
        pathname: '/results',
        state: { referrer: results },
      }}/>;
    }

    return (
        <Grid>
          <Grid.Column>
            <Search fluid
                    placeholder='Search for a location'
                    loading={isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 500, {
                      leading: true,
                    })}
                    results={results}
                    value={value}
                    {...this.props}
            />
          </Grid.Column>
        </Grid>
    );
  }
}

/** Require an array of Food documents in the props. */
SearchBar.propTypes = {
  locations: PropTypes.object.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Get access to Food documents.
  const subscription = Meteor.subscribe('Projects');
  return {
    locations: Projects.find({}).fetch(),
    ready: subscription.ready(),
  };
})(SearchBar);
