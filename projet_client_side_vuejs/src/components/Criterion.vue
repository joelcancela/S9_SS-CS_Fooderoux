<template>
    <v-layout class="layoutRow" row align-center justify-center>
        <v-radio :label="name" :value="name"/>
        <v-flex xs2 class="icons">
            <v-img width="30px" :src="imgPath"></v-img>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "Criterion",
        props: {
            imgPath: String,
            name: String
        }
    };
</script>

<style scoped>
    .criterion {
        border-radius: 5px;
        height: 60px;
        margin-bottom: 10px;
        padding-left: 10px;
    }

    .icons {
        padding-bottom: 5px;
        margin-right: 5px;
    }

    .layoutRow {

    }
</style>
