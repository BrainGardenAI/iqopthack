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
}

export {
    Graph,
}
