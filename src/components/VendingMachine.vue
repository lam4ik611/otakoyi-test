<template>
    <div class="machine">
        <h1 class="machine__title">
            The Vending Machine
        </h1>
        <div class="machine__content">
            <div class="machine__products">
                <div
                    class="machine__product"
                    v-for="product in products.slice(0, 6)"
                    :key="product.id"
                >
                    <Product
                        :product="product"
                        :disabled="false"
                    />
                </div>
            </div>
            <div class="machine__cash">
                <Cash />
            </div>
        </div>
        <div class="machine__received" v-show="Object.keys(receivedProducts).length">
            <h2 class="machine__received-title">
                Received products:
            </h2>
            <div class="machine__products">
                <div
                    class="machine__product"
                    v-for="product in receivedProducts"
                    :key="product.id"
                >
                    <Product
                        :product="product"
                        :disabled="true"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import Product from '@/components/Product';
    import Cash from '@/components/Cash';

    export default {
        name: 'VendingMachine',
        mounted() {
            this.initData();
        },
        computed: {
            ...mapState(['products', 'receivedProducts']),
        },
        methods: {
            ...mapActions(['initData']),
        },
        components: {
            Product: Product,
            Cash: Cash,
        }
    };
</script>

<style lang="scss">
    .machine {
        position: relative;
        display: flex;
        flex-direction: column;
        margin: 20px auto;
        padding: 20px;
        width: 100%;
        max-width: 900px;
        height: auto;
        min-height: 500px;
        border-radius: 30px;
        background-color: var(--black);

        &::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            border-radius: 30px;
            opacity: .1;
            background-image: url('../assets/background.jpg');
            background-size: cover;
            filter: grayscale(20%);
        }

        &__title {
            margin-bottom: 30px;
            text-align: center;
        }

        &__content {
            display: flex;
            flex-direction: row;
            width: 100%;
            height: 100%;
            min-height: 500px;

            .machine__products {
                margin: -10px;
                width: 60%;
            }

            .machine__product {
                flex-basis: 33%;
                width: 33%;
            }
        }

        &__products {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
        }

        &__product {
            padding: 10px;
        }

        &__cash {
            margin-left: 20px;
            width: calc(40% + 30px);
        }

        &__received {
            display: flex;
            flex-direction: column;

            .machine__products {
                margin: 0 -10px;
                width: 100%;
            }

            .machine__product {
                flex-basis: 19%;
                width: 19%;
            }
        }

        &__received-title {
            margin-top: 10px;
        }
    }
</style>
