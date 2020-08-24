<template>
    <div
        class="product"
        :class="{'product--selected': product.isSelected && !disabled, 'product--disabled': disabled}"
        @click="!disabled && selectProduct($event, product.id)"
    >
        <v-card class="product__card" height="250">
            <v-img class="product__image" :src="product.image" />
            <v-card-title class="product__title">
                {{ product.name }}
            </v-card-title>
            <v-card-text class="product__description">
                <div class="product__price">
                    <div class="product__price-value">
                        {{ product.price }}
                    </div>
                    <div class="product__price-label">
                        {{ product.currency }}
                    </div>
                </div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';

    export default {
        props: {
            product: {
                type: Object,
                required: true,
            },
            disabled: {
                type: Boolean,
            },
        },
        methods: {
            ...mapActions({
                _selectProduct: 'selectProduct',
            }),
            selectProduct(event, productId) {
                this._selectProduct({
                    productId: productId,
                });
            },
        },
    }
</script>

<style lang="scss">
    .product {
        filter: brightness(.9);
        transform: scale(1);
        transition: .2s;
        cursor: pointer;

        &--disabled {
            cursor: not-allowed;
        }

        &:not(&--disabled):hover,
        &--selected {
            transform: scale(1.05);

            .product__card {
                background-color: #797979 !important;
            }
        }

        &__card {
            display: flex !important;
            flex-direction: column;
            transition: background-color .2s !important;
        }

        &__title {
            font-size: 16px !important;
            line-height: 1.25 !important;
        }

        &__image {
            max-height: 30vh;
        }

        &__description {
            margin-top: auto;
        }

        &__price {
            display: flex;
            flex-direction: row;
        }
    }
</style>
