<template>
    <div class="cash">
        <div
            class="cash__message"
            :class="state.isWarning && 'cash__message--warning'"
        >
            {{ state.message }}
        </div>
        <v-card class="cash__banknotes" v-if="Object.keys(currency).length">
            <v-subheader>
                Accepted banknotes:
            </v-subheader>
            <div class="cash__currency">
                <v-select
                    v-model="selectCurrency"
                    :items="currencyNames"
                    color="success"
                    dark
                    dense
                    solo
                />
            </div>
            <ul class="cash__banknotes-list">
                <li
                    class="cash__banknotes-item"
                    v-for="banknote in selectedCurrency.banknotes"
                    :key="banknote"
                >
                    <div class="cash__banknotes-value">
                        {{ banknote }}
                    </div>
                    <div class="cash__banknotes-label">
                        {{ selectedCurrency.name }}
                    </div>
                </li>
            </ul>
        </v-card>
        <v-card class="cash__balance">
            <v-card-title class="cash__balance-label">
                Current balance:
            </v-card-title>
            <v-card-actions class="cash__balance-value">
                {{ balance }}
            </v-card-actions>
        </v-card>
        <v-card class="cash__insert">
            <div
                class="cash__insert-state"
                :class="insertingState.isWarning && 'cash__insert-state--warning'"
            >
                {{ insertingState.message }}
            </div>
            <div class="cash__insert-form">
                <v-text-field
                    label="Amount of money"
                    v-model="balanceField"
                    @keypress="numbersValidate"
                />
                <v-btn
                    class="cash__submit"
                    color="success"
                    :disabled="!isInserted"
                    @click="insertMoney"
                >
                    Insert
                </v-btn>
            </div>
        </v-card>
        <v-btn
            class="cash__submit"
            color="success"
            :disabled="!isSelectedProduct"
            @click="buyItem"
        >
            Buy an item
        </v-btn>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import _ from 'lodash';

    const insertingMessages = {
        default: '',
        process: 'Processing...',
        wrongBanknote: 'Wrong banknote!',
    };

    export default {
        data() {
            return {
                isInserted: false,
                balanceField: 0,
                selectCurrency: '$',
                insertingState: {
                    message: insertingMessages.default,
                    isWarning: false,
                },
                isWrongBanknote: false,
            };
        },
        created() {
            this.debouncedAmount = _.debounce(() => {
                let selectedCurrency = this.currency.find(value => value.isSelected);
                let isCorrectBanknote = Object.values(selectedCurrency.banknotes).some(value => value === parseInt(this.balanceField));

                if (!isCorrectBanknote) {
                    this.insertingState = this.balanceField !== 0
                        ? {
                            message: insertingMessages.wrongBanknote,
                            isWarning: true,
                        } : {
                            message: insertingMessages.default,
                            isWarning: false,
                        };

                    return;
                }

                this.insertingState = insertingMessages.default;
                this.isInserted = true;
            }, 500);
        },
        watch: {
            selectCurrency(value) {
                this._selectCurrency({
                    currencyName: value,
                });
            },
            balanceField() {
                this.isInserted = false;
                this.insertingState = {
                    message: insertingMessages.process,
                    isWarning: false,
                };
                this.debouncedAmount();
            },
        },
        computed: {
            ...mapState([
                'products',
                'isSelectedProduct',
                'balance',
                'state',
                'currency',
            ]),
            currencyNames() {
                return this.currency.map(value => value.name);
            },
            selectedCurrency() {
                return this.currency.find(value => value.isSelected);
            },
        },
        methods: {
            ...mapActions({
                _insertMoney: 'insertMoney',
                _selectCurrency: 'selectCurrency',
                buyItem: 'buyItem',
            }),
            numbersValidate($event) {
                let keyCode = $event.keyCode ? $event.keyCode : $event.which;

                if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
                    $event.preventDefault();
                }
            },
            insertMoney() {
                this._insertMoney({
                    amount: parseInt(this.balanceField),
                });

                this.balanceField = 0;
                this.isInserted = false;
            },
        },
    }
</script>

<style lang="scss">
    .cash {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;

        &__message,
        &__insert-state {
            color: var(--success);

            &--warning {
                color: var(--warning);
            }
        }

        &__message {
            margin-bottom: 20px;
        }

        &__currency {
            position: absolute;
            top: 0;
            right: 0;
            width: 70px;
        }

        &__banknotes {
            margin-bottom: 10px;
        }

        &__banknotes-list {
            display: flex;
            flex-direction: row;
            list-style-type: none;
            padding: 5px 10px 10px !important;
        }

        &__banknotes-item {
            display: flex;
            flex-direction: row;
            padding: 5px;
        }

        &__balance {
            display: flex;
            flex-direction: row;
            margin-bottom: 55px;
        }

        &__balance-value {
            font-size: 22px;
            font-weight: bold;
        }

        &__insert {
            padding: 15px;
        }

        &__insert-form {
            display: flex;
            flex-direction: row;
            align-items: center;

            .cash__submit {
                margin-top: 0;
                margin-left: 10px;
            }
        }

        &__insert-state {
            padding: 5px 0;
            font-size: 14px;
        }

        &__submit {
            margin-top: auto;
        }
    }
</style>
