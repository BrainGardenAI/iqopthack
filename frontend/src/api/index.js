const API_URL = 'http://192.168.43.93:8080/';

class Graph {
    static getRoot() {
        return fetch(`${API_URL}graph/root`);
    }

    static getItems(ids) {
        return fetch(`${API_URL}graph/get-items`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ids),
        });
    }

    static getForDepth(id, depth) {
        return fetch(`${API_URL}graph/getfordepth/${id}?depth=${depth}`);
    }
}

class Portfolio {
    static create() {
        return fetch(`${API_URL}portfolio/create?money=${100000}&risk=${1}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
    }

    static computed() {
        return fetch(`${API_URL}portfolio/computed`);
    }
}

export {
    Graph,
    Portfolio,
}
