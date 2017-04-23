import React, { Component } from 'react';
import './App.css';
import './css/bootstrap.css';
import { forEach, forOwn, get, isArray, map, set } from 'lodash';

import { GraphService } from './services';

import Tree from './blocks/Tree';
import TreeHealth from './blocks/TreeHealth';
import Details from './blocks/Details';
import { HAIKU } from './const';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      graphRoot: {},
      selectedNodePath: '',
    };

    this.onNodeClick = this.onNodeClick.bind(this);

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
              const { current_value, day_profit, week_profit, month_profit, global_perc, local_perc } = result2[index];
              set(nodesFlatHash, id, {
                current_value,
                day_profit,
                week_profit,
                month_profit,
                global_perc,
                local_perc,
              });
            });

            this.setState({ graphRoot: this.prepareNode(result, nodesFlatHash) });
          });
      });
  }

  prepareNode(node, nodesFlatHash) {
    const { children, id } = { ...node };

    return {
      id,
      name: id,
      children: isArray(children)
        ? map(children, (item, index) => {
          return this.prepareNode(item, nodesFlatHash);
        })
        : [],
      properties: get(nodesFlatHash, id, {}),
    };
  }

  onNodeClick(node) {
    console.log('onNodeClick', { node, graphRoot: this.state.graphRoot });
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
              <div style={{ padding: '5px' }}>
                <div className="btn-group">
                  <span className="btn btn-default active">light</span>
                  <a href="#second-screen" className="btn btn-default">pro</a>
                </div>
              </div>
              {HAIKU.SPRING}
            </div>
            <div className="app__half-hight">
              <Details />
            </div>
          </div>
        </div>
        <div id="second-screen" className="app__row">
          <div className="app__left">
            <Tree
              treeData={this.state.graphRoot}
              onNodeClick={this.onNodeClick}
            />
          </div>
          <div className="app__right">
            <div className="app__half-hight">
              <div style={{ padding: '5px' }}>
                <div className="btn-group">
                  <a href="#first-screen" className="btn btn-default">light</a>
                  <span className="btn btn-default active">pro</span>
                </div>
              </div>
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
