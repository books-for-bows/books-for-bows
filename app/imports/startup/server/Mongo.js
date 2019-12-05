import { Meteor } from 'meteor/meteor';
import { Books } from '../../api/books/Books';
import { Listings } from '../../api/listings/Listings';

/* eslint-disable no-console */

/** Initialize the database with a default data document. */
function addData(collection, data) {
  collection.insert(data);
}

/** Initialize the collection if empty. */
if (Books.find().count() === 0) {
  if (Meteor.settings.defaultBook) {
    console.log('Creating default book data.');
    Meteor.settings.defaultData.map(data => addData(Books, data));
  }
}

if (Listings.find().count() === 0) {
  if (Meteor.settings.defaultListing) {
    console.log('Creating default listing data.');
    Meteor.settings.defaultData.map(data => addData(Listings, data));
  }
}
