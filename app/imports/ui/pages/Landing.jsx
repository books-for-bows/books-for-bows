import React from 'react';
import { Grid } from 'semantic-ui-react';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    const gridStyle = { height: '500px' };
    return (
        <div className="landing-background-img">
          <Grid verticalAlign="middle" container style={ gridStyle }>
            <Grid.Row columns="one">
              <Grid.Column textAlign="center">
                <h1>Welcome to Books for Bows!</h1>
                <p>The place to buy or sell used textbooks from other students!</p>
                <p><a href="">Click here to checkout available listings.</a></p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
    );
  }
}

export default Landing;