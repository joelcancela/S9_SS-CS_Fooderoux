<template>
    <v-layout row align-center justify-content>
        <v-radio class="radio" :label="name" :value="getValue(name)" color="#00cc00"/>
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
        },
        methods: {
            getValue(name) {
                switch (name) {
                    case "Par nom":
                        return "name";
                    case "Par prix":
                        return "price";
                    case "Par nutriscore":
                        return "nutriscore";
                    default:
                        return "";
                }
            }
        }
    };
</script>

<style scoped>
    .radio {
        margin: 5px 10px 5px 10px!important;
        width: 100%;
    }
</style>
