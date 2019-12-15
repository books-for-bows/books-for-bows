import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Define a Mongo collection to hold the data. */
const Listings = new Mongo.Collection('Listings');

/** Define a schema to specify the structure of each document in the collection. */
const ListingsSchema = new SimpleSchema({
  seller: String,
  price: Number,
  ISBN: String,
  description: String,
  binding: {
    type: String,
    allowedValues: ['loose leaf', 'spiral', 'paperback', 'hardcover'],
    defaultValue: 'loose leaf',
  },
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Listings.attachSchema(ListingsSchema);

/** Make the collection and schema available to other code. */
export { Listings, ListingsSchema };
