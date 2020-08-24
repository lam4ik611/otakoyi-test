import Vue from 'vue';
import Vuex from 'vuex';
import Api from '@/services/Api'; // fake Api

Vue.use(Vuex);

const messages = {
    default: 'Please select a product',
    selected: 'Please insert the appropriate amount of money',
    lowAmount: 'Inserted the low amount of money',
    muchAmount: 'Inserted much amount of money. Please wait while we return remainder',
};

const poundToDollar = .5;
const convertPoundToDollar = (currencyName, value) => {
    return currencyName === '$' ? value / poundToDollar : value * poundToDollar;
};

export default new Vuex.Store({
    state: {
        products: [],
        receivedProducts: [],
        currency: [],
        state: {
            message:  messages.default,
            isWarning: false,
        },
        isSelectedProduct: false,
        balance: 0,
    },
    mutations: {
        updateProducts(state, data) {
            state.products = data;
        },
        updateCurrency(state, data) {
            state.currency = data;
        },
        updateIsSelectedProduct(state, data) {
            state.isSelectedProduct = data;
        },
        updateReceivedProducts(state, data) {
            state.receivedProducts.push(data);
        },
        updateState(state, {isWarning, message}) {
            state.state = {
                isWarning: isWarning ? isWarning : false,
                message: message,
            };
        },
        updateBalance(state, data) {
            state.balance = data;
        },
    },
    actions: {
        initData({dispatch}) {
            dispatch('getProducts');
            dispatch('getCurrency');
        },
        getProducts({commit}) {
            Api.getProducts()
              .then(data => commit('updateProducts', data));
        },
        selectProduct({state, commit}, {productId}) {
            commit('updateState', {
                message: messages.default,
            });
            commit('updateIsSelectedProduct', false);

            const updatedProducts = state.products.map(product => {
                return {
                    ...product,
                    isSelected: productId === product.id && !product.isSelected,
                };
            });

            updatedProducts.some(value => value.isSelected)
            && commit('updateIsSelectedProduct', !state.isSelectedProduct);

            commit('updateProducts', updatedProducts);
            state.isSelectedProduct && commit('updateState', {
                message: messages.selected,
            });
        },
        getCurrency({commit}) {
            Api.getCurrency()
                .then(data => commit('updateCurrency', data));
        },
        selectCurrency({state, commit}, {currencyName}) {
            const updatedCurrency = state.currency.map(value => {
                return {
                    ...value,
                    isSelected: currencyName === value.name && !value.isSelected,
                };
            });

            const updatedProducts = state.products.map(value => {
                return {
                    ...value,
                    price: convertPoundToDollar(currencyName, value.price),
                    currency: currencyName,
                };
            });

            commit('updateCurrency', updatedCurrency);
            commit('updateProducts', updatedProducts);
            commit('updateBalance', convertPoundToDollar(currencyName, state.balance));
        },
        insertMoney({state, commit}, {amount}) {
            commit('updateBalance', state.balance + amount);
        },
        buyItem({state, commit, dispatch}) {
            const selectedProduct = state.products.find(value => value.isSelected);

            if (state.balance < selectedProduct.price) {
                commit('updateState', {
                    message: messages.lowAmount,
                    isWarning: true,
                });

                return;
            }

            const updatedProducts = state.products.filter(value => value.id !== selectedProduct.id);

            commit('updateProducts', updatedProducts);
            commit('updateBalance', state.balance - selectedProduct.price);
            commit('updateState', {
                message: messages.default,
            });

            dispatch('setReceivedProducts', selectedProduct);
        },
        setReceivedProducts({commit}, product) {
            commit('updateReceivedProducts', product);
        },
        /*resetAll({commit}) {
            commit('updateBalance', 0);
            commit('updateState', {
                message: messages.default,
            });
        },*/
    },
});
