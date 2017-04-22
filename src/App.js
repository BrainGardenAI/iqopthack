import React, { Component } from 'react';
import './App.css';

import Tree from './blocks/Tree';

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="app__left">
          <Tree />
        </div>
        <div className="app__right">
          <div className="app__half-hight">
            Account
          </div>
          <div className="app__half-hight">
            Node info
          </div>
        </div>
      </div>
    );
  }
}

export default App;
