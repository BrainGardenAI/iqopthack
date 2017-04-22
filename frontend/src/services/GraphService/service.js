import * as API from '../../api';
import BaseService from '../BaseService';

class GraphService extends BaseService {
    static getRoot() {
        return new Promise((resolve, reject) => {
            API.Graph.getRoot()
                .then(this.chekcStatus)
                .then(this.parseJSON)
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    static getItems(ids) {
        return new Promise((resolve, reject) => {
            API.Graph.getItems(ids)
                .then(this.checkStatus)
                .then(this.parseJSON)
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}

export default GraphService;
