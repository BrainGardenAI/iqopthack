import React, { Component } from 'react';
import { forEach, forOwn, get, isArray, isEqual } from 'lodash';
import * as d3 from 'd3';

import './Tree.css';

class Tree extends Component {
    duration = 600;

    width;
    height;

    svg;
    treeMap;
    root;
    selectedNode;
    ref;
    i = 0;

    constructor(props) {
        super(props);

        this.state = {
            treeData: {},
        };
    }
    
    componentDidMount() {
        this.height = this.ref.offsetHeight;
        this.width = this.ref.offsetWidth;

        this.zoomListener = d3.zoom().scaleExtent([0.1, 3]).on("zoom", () => {
            this.zoom();
        });

        this.svg = d3
            .select(this.ref)
            .append('svg')
            .attr('height', '100%')
            .attr('width', '100%')
            .call(this.zoomListener)
            .append('g')
            .attr('transform', `translate(${0}, ${-230})`);

        this.treeMap = d3.tree().size([this.width, this.height]);
    }

    zoom() {
        this.svg.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ")scale(" + d3.event.transform.k + ")");
    }

    init() {
        // Assigns parent, children, height, depth
        this.root = d3.hierarchy(this.state.treeData, (d) => d.children);
        this.root.x0 = 0;
        this.root.y0 = 0;

        if (this.root && this.root.children) {
            this.root.children.forEach((item) => this.collapse(item));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props, nextProps)) {
            this.setState({
                treeData: get(nextProps, 'treeData', {}),
            }, () => {
                this.init();
                this.update(this.root);

                if (!this.selectedNode) {
                    this.selectNode(this.root);
                }
            });
        }
    }
    
    collapse(d) {
        if(d.children) {
            d._children = d.children;
            d._children.forEach((item) => this.collapse(item));
            d.children = null;
        }
    }

    getCircleClass(d) {
        return (d._selected
            ? ['tree__circle', 'tree__circle_selected']
            : ['tree__circle'])
                .join(' ');
    }

    update(source) {
        const treeData = this.treeMap(this.root);

        let nodes = treeData.descendants(),
            links = treeData.descendants().slice(1);

        nodes.forEach((d) => { d.y = this.width - d.depth * 120 });

        /******* Nodes section *******/
        let node = this.svg.selectAll('g.tree__node')
            .data(nodes, (d) => d.id || (d.id = ++this.i));

        let nodeEnter = node
            .enter()
                .append('g')
                .attr('transform', (d) => `translate(${source.x0},${source.y0})`)
                .attr('class', 'tree__node')
                .on('dblclick', (d) => {
                    this.toggleNode(d);
                    d3.event.stopPropagation();
                })
                .on('click', (d) => {
                    this.selectNode(d);
                    d3.event.stopPropagation();
                });

        // add circles
        nodeEnter
            .append('circle')
            .attr('class', (d) => this.getCircleClass(d))
            .attr('r', 1e-6)
            .style('fill', (d) => d._children ? 'lightsteelblue' : '#fff');

        // add labels
        nodeEnter
            .append('text')
            .attr('class', 'tree__text')
            .attr('dy', '.35em')
            .attr('x', (d) => d.children || d._children ? -13 : 13)
            .attr('text-anchor', (d) => d.children || d._children ? 'end' : 'start')
            .text((d) => d.data.name);

        // UPDATE
        let nodeUpdate = nodeEnter.merge(node);

        nodeUpdate.transition()
            .duration(this.duration)
            .attr('transform', (d) => `translate(${d.x},${d.y})`);

        nodeUpdate
            .select('.tree__circle')
            .attr('class', null)
            .attr('class', (d) => this.getCircleClass(d))
            .attr('r', 10)
            .style('fill', (d) => get(d, 'data.leaf') ? '#fff' : 'lightsteelblue')
            .attr('cursor', 'pointer');

        let nodeExit = node
            .exit()
            .transition()
            .duration(this.duration)
            .attr('transform', (d) => `translate(${source.x},${source.y})`)
            .remove();

        nodeExit.select('circle')
            .attr('r', 1e-6);
        nodeExit.select('text')
            .style('fill-opacity', 1e-6);

        /******* Links section *******/
        let link = this.svg
            .selectAll('path.tree__link')
            .data(links, (d) => d.id);

        let linkEnter = link
            .enter()
                .insert('path', 'g')
                .attr('class', 'tree__link')
                .attr('d', (d) => {
                    const o = { x: source.x0, y: source.y0 };
                    return this.diagonal(o, o);
                });

        // UPDATE
        let linkUpdate = linkEnter.merge(link);

        linkUpdate
            .transition()
            .duration(this.duration)
            .attr('d', (d) => this.diagonal(d, d.parent));

        let linkExit = link.exit().transition()
            .duration(this.duration)
            .attr('d', (d) => {
                const o = { x: source.x, y: source.y };
                return this.diagonal(o, o);
            })
            .remove();


        // Store the old position for transition
        nodes.forEach((d) => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    diagonal(s, d) {
        return `M ${s.x} ${s.y}
            C ${(s.x + d.x) / 2} ${s.y},
              ${(s.x + d.x) / 2} ${d.y},
              ${d.x} ${d.y}`;
    }

    toggleNode(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        }
        else {
            d.children = d._children;
            d._children = null;

            if ((!d.children || d.children.length === 0) && d.data.leaf === false) {
                if (this.props.onLoadAtNode && typeof this.props.onLoadAtNode === 'function') {
                    this.props.onLoadAtNode(d);
                }
            }
        }

        this.update(d);
    }

    deselectOtherNodes(current, selected) {
        let children = current.children || current._children;

        current._selected = get(current, 'data.id') === get(selected, 'data.id');

        if (isArray(children)) {
            forEach(children, (item) => {
                this.deselectOtherNodes(item, selected);
            })
        }
    }

    selectNode(d) {
        if (!d._selected) {
            d._selected = true;

            if (this.props.onNodeClick && typeof this.props.onNodeClick === 'function') {
                this.props.onNodeClick(d);
            }

            this.selectedNode = d;
        }

        this.deselectOtherNodes(this.treeMap(this.root), d);

        this.update(d);
    }
    
    render() {
        return (
            <div className="tree" ref={ref => this.ref = ref}></div>
        );
    }
}

export default Tree;
