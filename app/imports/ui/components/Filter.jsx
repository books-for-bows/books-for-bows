import React, { Component } from 'react';
import { Books } from '../api/Books.js';

// Task component - represents a single todo item
export default class Filter extends Component {
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Books.update(this.props.book._id, {
      $set: { checked: !this.props.book.checked },
    });
  }

  deleteThisBook() {
    Books.remove(this.props.book._id);
  }

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const taskClassName = this.props.book.checked ? 'checked' : '';
    return (
        <li className={taskClassName}>
          <button className="delete" onClick={this.deleteThisBook.bind(this)}>
            &times;
          </button>

          <input
              type="checkbox"
              readOnly
              checked={!!this.props.book.checked}
              onClick={this.toggleChecked.bind(this)}
          />

          <span className="text">{this.props.book.text}</span>
        </li>
    );
  }
}