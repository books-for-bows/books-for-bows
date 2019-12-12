import { Meteor } from 'meteor/meteor';
import { Books } from '../../api/books/Books.js';
import { Listings } from '../../api/listings/Listings';
import { CourseBooks } from '../../api/coursebooks/CourseBooks';

/* eslint-disable no-console */
const coursebooksJson = JSON.parse(Assets.getText('coursebooks.json'));
/** Initialize the database with a default data document. */

function addBook(data) {
  console.log(`  Adding: ${data.title}`);
  Books.insert(data);
}

function addListing(data) {
  console.log(`  Adding: ${data.title}`);
  Listings.insert(data);
}

function addCourseBook(data) {
  console.log(`  Adding: ${data.isbn}`);
  CourseBooks.insert(data);
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

if (CourseBooks.find().count() === 0) {
  if (coursebooksJson) {
    console.log('Creating coursebooks.');
    coursebooksJson.map(data => addCourseBook(data));
  }
}
