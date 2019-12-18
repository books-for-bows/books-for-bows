import React from 'react';
import { Grid, Image, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    return (
        <div className="landing-page">
          <Grid verticalAlign='middle' textAlign='center' style={{ marginTop: '0' }}>
            <Grid.Row columns={2} className="landing-panel-1">
              <Grid.Column width={5}>
                <Image src={''} style={{ width: '500px' }}/>
              </Grid.Column>
              <Grid.Column width={5}>
                <Header as={'landing-header'}>Welcome to Books for Bows!</Header>
                <p className="landing-text">
                  The place to buy or sell used textbooks from other students.
                </p>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row className="landing-panel-2">
              <Grid.Column width={4}>
                <Link to={'/marketplace'}>
                  <Header as={'landing-header'} textAlign='left'>Browse the Marketplace</Header>
                  <p className="landing-text">
                    Books For Bows hosts a convenient marketplace full of relevant books.
                  </p>
                </Link>
              </Grid.Column>
              <Grid.Column width={5}>
                <Image src={''} style={{ width: '500px' }}/>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row className="landing-panel-3">
              <Grid.Column width={5}>
                <Image src={''} style={{ width: '500px' }}/>
              </Grid.Column>
              <Grid.Column width={5}>
                <Header as={'landing-header'}>Compare Listings</Header>
                <p className="landing-text">
                  Find the textbook you need for class and compare all available listings for that book in
                  one convenient spot.
                </p>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row className="landing-panel-4">
              <Grid.Column width={5}>
                <Header as={'landing-header'}>Buy and Sell</Header>
                <p className="landing-text">
                  No middle man - so your money is helping a fellow college student!
                </p>
              </Grid.Column>
              <Grid.Column width={5}>
                <Image src={''} style={{ width: '500px' }}/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
    );
  }
}

export default Landing;
