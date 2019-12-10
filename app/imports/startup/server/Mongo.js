import { Meteor } from 'meteor/meteor';
import { Books } from '../../api/books/Books.js';
import { Listings } from '../../api/listings/Listings';

/* eslint-disable no-console */

/** Initialize the database with a default data document. */

function addBook(data) {
  console.log(`  Adding: ${data.title}`);
  Books.insert(data);
}

function addListing(data) {
  console.log(`  Adding: ${data.title}`);
  Listings.insert(data);
}

/** Initialize the collection if empty. */
if (Books.find().count() === 0) {
  if (Meteor.settings.defaultBook) {
    console.log('Creating default books.');
    Meteor.settings.defaultBook.map(data => addBook(data));
  }
}

if (Listings.find().count() === 0) {
  if (Meteor.settings.defaultListing) {
    console.log('Creating default listings.');
    Meteor.settings.defaultListing.map(data => addListing(data));

  }
}
