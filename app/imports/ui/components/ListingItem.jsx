import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Icon, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';

import { Listings } from '../../api/listings/Listings';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class ListingItem extends React.Component {
  state = {
    deleted: false,
    redirect: false,
  };

  handleDelete() {
    this.setState({ deleted: true });
    Listings.remove(this.props.listing._id);
  }

  render() {
    return (
        <Table.Row>
          <Table.Cell singleLine>${this.props.listing.price}</Table.Cell>
          <Table.Cell singleLine>{this.props.listing.binding}</Table.Cell>
          <Table.Cell singleLine>
            <a href={`mailto:${this.props.listing.seller}`}>
              {this.props.listing.seller}
            </a>
          </Table.Cell>
          <Table.Cell>{this.props.listing.description}</Table.Cell>
          {Roles.userIsInRole(Meteor.userId(), 'admin') ? ([
                <Table.Cell key={`edit:${this.props.listing._id}`}>
                  <Link to={`/edit/${this.props.listing._id}`}>
                    <Button color="blue" icon><Icon name="edit"/></Button>
                  </Link>
                </Table.Cell>,
                <Table.Cell key={`delete:${this.props.listing._id}`}>
                  <Link to={`/shelf/${this.props.listing.ISBN}`}>
                  <Button
                      color="red"
                      icon
                      onClick={this.handleDelete.bind(this)}
                  >
                    <Icon name="trash"/>
                  </Button>
                  </Link>
                </Table.Cell>,
              ])
              : null}
        </Table.Row>
    );
  }
}

/** Require a document to be passed to this component. */
ListingItem.propTypes = {
  listing: PropTypes.object.isRequired,
  length: PropTypes.number.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(ListingItem);
