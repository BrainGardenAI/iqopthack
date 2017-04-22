import React, { Component } from 'react';
import { get } from 'lodash';
import * as d3 from 'd3';

import './Tree.css';

class Tree extends Component {
    duration = 600;

    width;
    height;

    svg;
    treeMap;
    root;
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

        this.svg = d3
            .select(this.ref)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .append('g')
            .attr('transform', `translate(${0}, ${-230})`);

        this.treeMap = d3.tree().size([this.width, this.height]);

        this.init()
    }

    init() {
        // Assigns parent, children, height, depth
        this.root = d3.hierarchy(this.state.treeData, (d) => d.children);
        this.root.x0 = 0;
        this.root.y0 = 0;

        if (this.root && this.root.children) {
            this.root.children.forEach((item) => this.collapse(item));
        }

        this.update(this.root);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ treeData: get(nextProps, 'treeData', {}) }, () => {
            this.init();
        });
    }
    
    collapse(d) {
        if(d.children) {
            d._children = d.children;
            d._children.forEach((item) => this.collapse(item));
            d.children = null;
        }
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
                .on('click', (d) => {
                    this.click(d);
                });

        // add circles
        nodeEnter
            .append('circle')
            .attr('class', 'tree__circle')
            .attr('r', 1e-6)
            .style('fill', (d) => d._children ? 'lightsteelblue' : '#fff');

        // add labels
        nodeEnter
            .append('text')
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
            .attr('r', 10)
            .style('fill', (d) => d._children ? 'lightsteelblue' : '#fff')
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

    click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        }
        else {
            d.children = d._children;
            d._children = null;
        }

        if (this.props.onNodeClick && typeof this.props.onNodeClick === 'function') {
            this.props.onNodeClick(d);
        }

        this.update(d);
    }
    
    render() {
        return (
            <div className="tree" ref={ref => this.ref = ref}></div>
        );
    }
}

export default Tree;
