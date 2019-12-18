import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

const booksName = 'Books';

/** Define a Mongo collection to hold the data. */
const Books = new Mongo.Collection(booksName);

/** Define a schema to specify the structure of each document in the collection. */
const BooksSchema = new SimpleSchema({
  title: String,
  title_long: String,
  isbn: String,
  isbn13: String,
  publisher: String,
  date_published: Date,
  edition: String,
  image: String,
  publish_date: String,
  authors: [
      String,
  ],
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Books.attachSchema(BooksSchema);

/** Make the collection and schema available to other code. */
export { Books, BooksSchema, booksName };
