import { Meteor } from 'meteor/meteor';
import { Listings } from '../../api/listings/Listings';
import { CourseBooks } from '../../api/coursebooks/CourseBooks';

/* eslint-disable no-console */
const coursebooksJson = JSON.parse(Assets.getText('coursebooks.json'));
/** Initialize the database with a default data document. */

function addListing(data) {
  console.log(`  Adding: ${data.title}`);
  Listings.insert(data);
}

function addCourseBook(data) {
  console.log(`  Adding: ${data.isbn}`);
  CourseBooks.insert(data);
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
