import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Stuffs } from '../../api/stuff/Stuff';
import { Books } from '../../api/books/Books';
import { Listings } from '../../api/listings/Listings';
import { CourseBooks } from '../../api/coursebooks/CourseBooks';

Meteor.publish('Stuff', function publish() {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Stuffs.find({ owner: username });
  }
  return this.ready();
});

/** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
Meteor.publish('StuffAdmin', function publish() {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Stuffs.find();
  }
  return this.ready();
});

Meteor.publish('CourseBooks', () => CourseBooks.find());

Meteor.publish('Books', () => Books.find());

Meteor.publish('Listings', () => Listings.find());
