import React, { Component } from 'react';

import { get, round } from 'lodash';

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
            deposit: '0',
            rootNode: { ...defaults },
            selectedNode: { ...defaults },
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            rootNode: get(nextProps, 'rootNode', { ...defaults }),
            selectedNode: get(nextProps, 'selectedNode', { ...defaults }),
        });
    }

    getRound(number) {
        return round(number, 2);
    }

    render() {
        return (
            <div style={{ padding: '0 10px' }}>
                <div style={{ padding: '10px 0' }}>
                    Депозит: {this.state.deposit}
                    <br></br>
                    Объем дерева: {get(this.state, 'rootNode.properties.current_value')} $
                </div>
                <div style={{ padding: '10px 0' }}>
                    <h3>{get(this.state, 'selectedNode.name')}</h3>
                    Общая доля: {this.getRound(get(this.state, 'selectedNode.properties.global_perc'))}
                    <br></br>
                    Локальная доля: {this.getRound(get(this.state, 'selectedNode.properties.local_perc'))}
                    <br></br>
                    Дневной доход {this.getRound(get(this.state, 'selectedNode.properties.day_profit'))}
                    <br></br>
                    Недельный доход {this.getRound(get(this.state, 'selectedNode.properties.week_profit'))}
                    <br></br>
                    Месячный доход {this.getRound(get(this.state, 'selectedNode.properties.month_profit'))}
                    <br></br>
                    <br></br>
                    Объем инвестиций: {this.getRound(get(this.state, 'selectedNode.properties.current_value'))}
                    <br></br>
                    <br></br>
                    Инструменты:
                </div>
                <div style={{ padding: '10px 0' }}>
                    рекомендации и добавление ноды
                </div>
            </div>
        );
    }
}

export default Details;
