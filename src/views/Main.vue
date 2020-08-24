<template>
    <div class="main">
        <VendingMachine />
    </div>
</template>

<script>
    // @ is an alias to /src
    import VendingMachine from '../components/VendingMachine';

    export default {
        name: 'Main',
        components: {
            VendingMachine,
        },
    };
</script>
