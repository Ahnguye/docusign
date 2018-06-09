import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import RoutesComponent from './components/routes_component';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <RoutesComponent />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
