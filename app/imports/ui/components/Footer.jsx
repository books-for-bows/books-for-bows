import React from 'react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
class Footer extends React.Component {
  render() {
    const divStyle = { paddingTop: '15px', color: 'white', marginTop: '1rem' };
    return (
        <footer>
          <div style={divStyle} className="ui center aligned container">
            <hr />
            Books for Bows <br />
            University of Hawaii<br />
            Honolulu, HI 96822 <br />
            <a href="https://books-for-bows.github.io/">https://books-for-bows.github.io/</a>
          </div>
        </footer>
    );
  }
}

export default Footer;
