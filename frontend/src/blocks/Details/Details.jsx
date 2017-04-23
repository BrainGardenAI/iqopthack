import React, { Component } from 'react';

import { get } from 'lodash';

const defaults = {
    current_value: null,
    day_profit: null,
    global_perc: null,
    local_perc: null,
    month_profit: null,
    week_profit: null,
}

class Details extends Component {
    constructor(props) {
        super(props);

        this.state = {
            deposit: 10000,
            rootNodeProps: { ...defaults },
            selectedNodeProps: { ...defaults },
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            rootNodeProps: get(nextProps, 'rootNodeProps', { ...defaults }),
            selectedNodeProps: get(nextProps, 'selectedNodeProps', { ...defaults }),
        });
    }

    render() {
        return (
            <div>
                <div style={{ padding: '10px 0' }}>
                    Депозит: {this.state.deposit}
                    <br></br>
                    Объем дерева: {get(this.state, 'rootNodeProps.current_value')}
                </div>
                <div style={{ padding: '10px 0' }}>
                    Общая доля:
                    <br></br>
                    Доля в род.п.:
                    <br></br>
                    Day pr {get(this.state, 'selectedNodeProps.day_profit')}
                    <br></br>
                    week pr {get(this.state, 'selectedNodeProps.week_profit')}
                    <br></br>
                    month pr {get(this.state, 'selectedNodeProps.month_profit')}
                    <br></br>
                    <br></br>
                    Объем инвестиций:
                    <br></br>
                    <br></br>
                    Инструменты:
                </div>
                <div style={{ padding: '10px 0' }}>
                    рекомендации и добавление ноды
                </div>
                <pre>
                    {JSON.stringify({ rootNodeProps: this.state.rootNodeProps }, null, 4)}
                </pre>
                <pre>
                    {JSON.stringify({ selectedNodeProps: this.state.selectedNodeProps }, null, 4)}
                </pre>
            </div>
        );
    }
}

export default Details;
