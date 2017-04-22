import React, { Component } from 'react';
import './App.css';
import { forEach, forOwn, get, isArray, map, set } from 'lodash';

import { GraphService } from './services';

import Tree from './blocks/Tree';
import TreeHealth from './blocks/TreeHealth';
import { HAIKU } from './const';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      graphRoot: {},
    };

    this.load();
  }

  collectIds(node) {
    let ids = [node.id];

    if (isArray(node.children)) {
      forEach(node.children, (item) => {
        ids = ids.concat(this.collectIds(item));
      });
    }

    return ids;
  }

  load() {
    GraphService.getRoot()
      .then((result) => {
        let nodeIds = this.collectIds(result);
        nodeIds.shift(); // skip first root id

        GraphService.getItems(nodeIds)
          .then((result2) => {
            let nodesFlatHash = {};

            forEach(nodeIds, (id, index) => {
              set(nodesFlatHash, id, result2[index]);
            });

            this.setState({ graphRoot: this.prepareNode(result, nodesFlatHash) });
          });
      });
  }

  prepareNode(node, nodesFlatHash) {
    const { children, id } = { ...node };

    return {
      name: id,
      children: isArray(children)
        ? map(children, (item) => this.prepareNode(item))
        : [],
      properties: get(nodesFlatHash, id, {}),
    };
  }

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
            <Tree treeData={this.state.graphRoot} />
          </div>
          <div className="app__right">
            <div className="app__half-hight">
              <p><a href="#first-screen">go top</a></p>
              Account
            </div>
            <div className="app__half-hight">
              Node info
              <pre>{JSON.stringify(this.state.graphRoot, null, 4)}</pre>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
