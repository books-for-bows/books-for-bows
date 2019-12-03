import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Define a Mongo collection to hold the data. */
const Books = new Mongo.Collection('Books');

/** Define a schema to specify the structure of each document in the collection. */
const BooksSchema = new SimpleSchema({
  title: String,
  title_long: String,
  isbn: String,
  isbn13: String,
  dewey_decimal: String,
  format: String,
  publisher: String,
  language: String,
  date_published: Date,
  edition: String,
  pages: Number,
  dimensions: String,
  overview: String,
  image: String,
  msrp: Number,
  excerpt: String,
  synopsys: String,
  authors: [
      String,
  ],
  subjects: [
      String,
  ],
  reviews: [
      String,
  ],
  prices: [
    {
      condition: String,
      merchant: String,
      merchant_logo: String,
      merchant_logo_offset: {
        x: String,
        y: String,
      },
      shipping: String,
      price: String,
      total: String,
      link: String,
    },
  ],
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Books.attachSchema(BooksSchema);

/** Make the collection and schema available to other code. */
export { Books, BooksSchema };
