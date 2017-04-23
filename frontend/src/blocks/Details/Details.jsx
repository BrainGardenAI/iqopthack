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
            <div className="container">
                <div className="col-lg-3">
                    <div className="row" style={{padding: '10px', margin: '5px'}}>
Депозит: {this.state.title.node}
<br></br>
Объем дерева: 
	                </div>
                    <div className="row" style={{padding: '10px', margin: '5px'}}>
Общая доля:
<br></br>
Доля в род.п.:
<br></br>
Day pr
<br></br>
week pr
<br></br>
month pr
<br></br>
<br></br>
Объем инвестиций:
<br></br>
<br></br>
Инструменты:

	                </div>
                    <div class="row">
рекомендации и добавление ноды
                    </div>
                </div>
            </div>
        );
    }
}

export default Details;
