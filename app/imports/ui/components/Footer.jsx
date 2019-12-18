import React from 'react';
import { Button } from 'semantic-ui-react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
class Footer extends React.Component {
  render() {
    const divStyle = { paddingTop: '15px', color: 'white', marginTop: '1rem' };
    return (
        <footer style={{ height: '150px', backgroundColor: '#000000', color: 'white' }}>
          <div style={divStyle} className="ui fluid center aligned container">
            <hr />
            <div>
              <Button circular icon={'github'} className={'footerICON'}/>
              <Button circular icon={'instagram'} className={'footerICON'}/>
              <Button circular icon={'facebook f'} className={'footerICON'}/>
              <Button circular icon={'discord'} className={'footerICON'}/>
              <Button circular icon={'linkedin'} className={'footerICON'}/>
            </div>
            University of Hawaiʻi at Mānoa • 2500 Campus Road • Honolulu, HI 96822
          </div>
        </footer>
    );
  }
}

export default Footer;
