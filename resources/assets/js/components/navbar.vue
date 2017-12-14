<template>
<div class="pt-3">
    <v-waypoint @waypoint-in="inHandler" @waypoint-out="outHandler"></v-waypoint>
    <div class="container sticky-container" v-bind:class="{ 'fixed-top': isFixed }">

        <nav class="navbar navbar-expand-lg navbar-light bg-white" >

            <a class="navbar-brand" href="#">Bestelliste</a>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <form class="form-inline my-2 my-lg-0">
                    <input class="form-control mr-sm-2" type="search" placeholder="Suchen" aria-label="Search">

                </form>
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item text-success pr-4">
                        <i class="mdi mdi-check-circle-outline mdi-24px"></i>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="btn btn-outline-primary my-2 my-sm-0">Übersicht
                                <i class="mdi mdi-chevron-right"></i>
                            </a>
                    </li>
                </ul>
            </div>
        </nav>
        <div class="field-titles bg-white">
            <div class="row">
                <div class="col-7">
                    <h6 class="ml-3">Name</h6>
                </div>
                <div class="col-11">
                    <div class="row no-gutters ml-4 mr-4">
                        <div class="col-3">
                            <h6 class="">Anzahl</h6>
                        </div>
                        <div class="col-6">
                            <h6 class="">Artikelnummer</h6>
                        </div>
                        <div class="col-5">
                            <h6 class="">Produktname</h6>
                        </div>
                        <div class="col-4">
                            <h6 class="">Summe</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    mounted() {
        //
    },
    data() {
        return {
            isFixed: false
        }
    },
    methods: {
        inHandler() {
            //console.log('going in');
            this.isFixed = false;
        },
        outHandler() {
            //console.log('going out');
            $('.order-navigation').height($('.order-navigation').height());
            this.isFixed = true;

        }
    }
}
</script>
