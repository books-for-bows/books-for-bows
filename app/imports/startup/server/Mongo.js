import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/Stuff.js';
import { Books } from '../../api/books/Books.js';
import { Listings } from '../../api/listings/Listings';

/* eslint-disable no-console */

/** Initialize the database with a default data document. */
function addData(data) {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Stuffs.insert(data);
}

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

if (Stuffs.find().count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.map(data => addData(data, Stuffs));
  }
}

if (Listings.find().count() === 0) {
  if (Meteor.settings.defaultListing) {
    console.log('Creating default listings.');
    Meteor.settings.defaultListing.map(data => addListing(data));
  }
}
