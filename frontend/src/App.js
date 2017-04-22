import React, { Component } from 'react';
import './App.css';

import Tree from './blocks/Tree';
import TreeHealth from './blocks/TreeHealth';

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="app__row">
          <div className="app__left">
            <TreeHealth />
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
        <div className="app__row">
          <div className="app__left">
            <Tree />
          </div>
          <div className="app__right">
            123
          </div>
        </div>
      </div>
    );
  }
}

export default App;
