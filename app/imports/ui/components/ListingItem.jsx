import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Icon, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class ListingItem extends React.Component {
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
          { Meteor.user() && Meteor.user().roles && Meteor.user().roles.indexOf('admin') > -1 ? ([
                  <Table.Cell key={0}>
                    <Link to={`/edit/${this.props.listing._id}`}>
                      <Button color="blue" icon><Icon name="edit"/></Button>
                    </Link>
                  </Table.Cell>,
                  <Table.Cell key={1}>
                    <Link to={`/delete/${this.props.listing._id}`}>
                      <Button color="red" icon><Icon name="trash"/></Button>
                    </Link>
                  </Table.Cell>,
                ])
          : null }
        </Table.Row>
    );
  }
}

/** Require a document to be passed to this component. */
ListingItem.propTypes = {
  listing: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(ListingItem);
