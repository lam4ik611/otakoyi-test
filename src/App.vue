<template>
    <v-app>
        <router-view />
    </v-app>
</template>

<script>
    export default {
        name: 'App',
    };
</script>

<style lang="scss">
    :root {
        --white: #fff;
        --black: #000;
        --success: #5AB55E;
        --warning: #FD4C4C;
    }
</style>
