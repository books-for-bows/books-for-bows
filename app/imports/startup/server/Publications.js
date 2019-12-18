import { Meteor } from 'meteor/meteor';
import { Listings } from '../../api/listings/Listings';
import { CourseBooks } from '../../api/coursebooks/CourseBooks';

Meteor.publish('CourseBooks', () => CourseBooks.find());

Meteor.publish('Listings', () => Listings.find());
