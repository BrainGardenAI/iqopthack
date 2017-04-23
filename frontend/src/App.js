import React, { Component } from 'react';
import './App.css';
import './css/bootstrap.css';
import { cloneDeep, forEach, forOwn, get, isArray, isNil, map, set } from 'lodash';
import * as _ from 'lodash';

import { GraphService } from './services';

import * as SVG from './svg';

import Tree from './blocks/Tree';
import TreeHealth from './blocks/TreeHealth';
import Details from './blocks/Details';
import { HAIKU } from './const';

class App extends Component {
  loadDepth = 1;
  isLoading = false;

  constructor(props) {
    super(props);

    this.state = {
      graphRoot: {},
      selectedNode: null,
    };

    this.onNodeClick = this.onNodeClick.bind(this);
    this.onLoadAtNode = this.onLoadAtNode.bind(this);

    this.loadRoot();
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

  loadRoot() {
    if (this.isLoading === false) {
      this.isLoading = true;

      GraphService.getRoot()
        .then((result) => {
          this.loadItems(result)
            .then((result2) => {
              this.setState({ graphRoot: result2 });

              this.isLoading = false;
            });
        });
    }
  }

  loadItems(graph) {
      return new Promise((resolve, reject) => {
        let nodeIds = this.collectIds(graph);

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

            resolve(this.prepareNode(graph, nodesFlatHash));
          })
          .catch((err) => {
            reject(err);
          });
      });
  }

  prepareNode(node, nodesFlatHash) {
    const { children, id, leaf } = { ...node };

    return {
      id,
      leaf,
      name: id,
      children: isArray(children)
        ? map(children, (item, index) => {
          return this.prepareNode(item, nodesFlatHash);
        })
        : [],
      properties: get(nodesFlatHash, id, {}),
    };
  }

  getPath(obj, keyValue, value, path) {

    if(typeof obj !== 'object') {
        return;
    }

    for(let key in obj) {
        if(obj.hasOwnProperty(key)) {
          let t = path;
          let v = obj[key];
          if (!path) {
            path = key;
          }
          else {
            path = path + '.' + key;
          }
          if (v === value) {
            return path;
          }
          else if (typeof v !== 'object'){
            path = t;
          }
          var res = this.getPath(v, keyValue, value, path);
          if (res) {
            return res;
          }
        }
    }
  }

  onNodeClick(node) {
    this.setState({ selectedNode: get(node, 'data', null) });
  }

  onLoadAtNode(node) {
    let nodePath = this.getPath(this.state.graphRoot, 'id', node.data.id).split('.'),
      fixedPath = [];

    nodePath.pop();

    forEach(nodePath, (key, index) => {
      if (/[0-9]+/.test(key)) {
        if (!/[0-9]+/.test(nodePath[index + 1])) {
          fixedPath.push(key);
        }
      } else {
        fixedPath.push(key);
      }
    });

    if (this.isLoading === false) {
      this.isLoading = true;

      GraphService.getForDepth(node.data.id, this.loadDepth)
        .then((result) => {
          this.loadItems(result)
            .then((result2) => {
              this.setState((state) => {
                let nextState = cloneDeep(state);

                set(nextState.graphRoot, `${fixedPath.join('.')}`, result2);

                // console.log(`${nodePath.join('.')}`);
                // console.log(`${fixedPath.join('.')}`);
                // console.info(state, nextState);

                return nextState;
              });

              this.isLoading = false;
            });
        });
    }
  }

  getSeasonSvg(rootDayProfit) {
    if (rootDayProfit <= (- 5 / 256)) {
      return SVG.Winter;
    } else if ((- 5 / 256) <= rootDayProfit < (1 / 256)) {
      return SVG.Fall;
    } else if ((1 / 256) <= rootDayProfit < (15 / 256)) {
      return SVG.Spring;
    } else if ((15 / 256) <= rootDayProfit) {
      return SVG.Summer;
    } else {
      return null;
    }
  }

  get rootNode() {
    return get(this.state, 'graphRoot');
  }

  get selectedNode() {
    return get(this.state, 'selectedNode', this.rootNode);
  }

  render() {
    return (
      <div className="app">
        <div id="first-screen" className="app__row" style={{ position: 'relative' }}>
          <div className="app__left">
            <img
              src={this.getSeasonSvg(get(this.rootNode, 'properties.day_profit'))}
              style={{ position: 'absolute', zIndex: '1' }}
            />
          </div>
          <div className="app__right" style={{ zIndex: '2' }}>
            <div className="app__half-hight">
              <div style={{ padding: '5px 0' }}>
                <div className="btn-group">
                  <span className="btn btn-default active">light</span>
                  <a href="#second-screen" className="btn btn-default">pro</a>
                </div>
              </div>
              123
            </div>
            <div className="app__half-hight">
              321
            </div>
          </div>
        </div>
        <div id="second-screen" className="app__row">
          <div className="app__left">
            <Tree
              treeData={this.state.graphRoot}
              onNodeClick={this.onNodeClick}
              onLoadAtNode={this.onLoadAtNode}
            />
          </div>
          <div className="app__right">
            <div className="app__half-hight">
              <div style={{ padding: '5px 0' }}>
                <div className="btn-group">
                  <a href="#first-screen" className="btn btn-default">light</a>
                  <span className="btn btn-default active">pro</span>
                </div>
                <Details
                  rootNode={this.rootNode}
                  selectedNode={this.selectedNode}
                />
              </div>
            </div>
            <div className="app__half-hight">
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
