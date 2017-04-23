import * as API from '../../api';
import BaseService from '../BaseService';

class PortfolioService extends BaseService {
    static create() {
        return new Promise((resolve, reject) => {
            API.Portfolio.create()
                .then((this.checkStatus))
                // .then(this.parseJSON)
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static computed() {
        return new Promise((resolve, reject) => {
            API.Portfolio.computed()
                .then((this.checkStatus))
                .then(this.parseJSON)
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

export default PortfolioService;