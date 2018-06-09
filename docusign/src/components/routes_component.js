import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import SplashPageComponent from './splash_page_component';

class RoutesComponent extends Component {
  render() {
    return (
      <div className="">
        <Route exact path="/" component={SplashPageComponent} />
        <Route path="/qr" component={SplashPageComponent} />
        <Route path="/form" component={SplashPageComponent} />
        <Route path="/summary" component={SplashPageComponent} />
        <Route path="/sign" component={SplashPageComponent} />
      </div>
    );
  }
}

export default RoutesComponent;
