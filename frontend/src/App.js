import React, { Component } from 'react';
import './App.css';

import Tree from './blocks/Tree';
import TreeHealth from './blocks/TreeHealth';
import { HAIKU } from './const';

console.log(HAIKU);

class App extends Component {
  render() {
    return (
      <div className="app">
        <div id="first-screen" className="app__row">
          <div className="app__left">
            <TreeHealth />
          </div>
          <div className="app__right">
            <div className="app__half-hight">
              {HAIKU.SPRING}
            </div>
            <div className="app__half-hight">
              Node info
              <p><a href="#second-screen">go down</a></p>
            </div>
          </div>
        </div>
        <div id="second-screen" className="app__row">
          <div className="app__left">
            <Tree />
          </div>
          <div className="app__right">
            <div className="app__half-hight">
              <p><a href="#first-screen">go top</a></p>
              Account
            </div>
            <div className="app__half-hight">
              Node info
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
