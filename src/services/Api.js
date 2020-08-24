import axios from 'axios';

class Api {
    constructor() {
        this.httpClient = {
            headers: {
                'Accept': 'application/ld+json',
                'Content-Type': 'application/ld+json',
            },
        };
    }

    getProducts() {
        // imitation of REST Api
        return axios.get('../data/products.json', {
            headers: this.httpClient.headers,
        })
            .then(response => this.transformProductData(response.data))
            .catch(error => console.log(error))
    }

    getCurrency() {
        // imitation of REST Api
        return axios.get('../data/currency.json', {
            headers: this.httpClient.headers,
        })
            .then(response => this.transformCurrencyData(response.data))
            .catch(error => console.log(error))
    }

    transformProductData(data) {
        return data.map(value => {
            return {
                ...value,
                image: `https://source.unsplash.com/300x300/?${value.name}`, // TODO
                currency: '$',
                isSelected: false,
            };
        });
    }

    transformCurrencyData(data) {
        return data.map(value => {
            return {
                ...value,
                isSelected: value.name === '$' ? true : false, // TODO
            };
        });
    }
}

export default new Api();
