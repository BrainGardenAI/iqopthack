import React, { Component } from 'react';

class Details extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: 'hello',
            node: {
                day_profit: ''
            }
        };
    }

    render() {
        return (
            <div className="details">
                {this.state.title}
            </div>
        );
    }
}

export default Details;
