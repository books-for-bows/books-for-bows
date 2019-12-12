import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Define a Mongo collection to hold the data. */
const CourseBooks = new Mongo.Collection('CourseBooks');

/** Define a schema to specify the structure of each document in the collection. */
const CourseBooksSchema = new SimpleSchema({
  dept: String,
  course: String,
  isbn: String,
}, { tracker: Tracker });

/** Attach this schema to the collection. */
CourseBooks.attachSchema(CourseBooksSchema);

/** Make the collection and schema available to other code. */
export { CourseBooks, CourseBooksSchema };
