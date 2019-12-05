import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class ProfileItem extends React.Component {
  render() {
    return (
        <Table.Row>
          <Table.Cell>{this.props.listings.price}</Table.Cell>
          <Table.Cell>{this.props.listings.ISBN}</Table.Cell>
          <Table.Cell>{this.props.listings.description}</Table.Cell>
          <Table.Cell>{this.props.listings.binding}</Table.Cell>
          <Table.Cell>
            <Link to={`/edit/${this.props.listings._id}`}>Edit</Link>
          </Table.Cell>
        </Table.Row>
    );
  }
}

/** Require a document to be passed to this component. */
ProfileItem.propTypes = {
  listings: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(ProfileItem);
