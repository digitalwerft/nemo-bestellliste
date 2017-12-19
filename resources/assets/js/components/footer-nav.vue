<template>
<div class="container sticky-container">
    <nav class="navbar navbar-expand-lg navbar-light bg-white fixed-bottom">

        <a class="navbar-brand" href="#">Neue Masche</a>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav">
                <li class="nav-item">
                    Besteller: {{ totalBuyers }}&nbsp;|&nbsp;
                </li>
                <li class="nav-item">
                    Bestellungen: {{ totalOrders }}&nbsp;|&nbsp;
                </li>
                <li class="nav item">
                    Gewinn: {{ winnings }}
                </li>
            </ul>
            <ul class="navbar-nav ml-auto">
                <li class="nav-item mr-3">
                    <a href="#" class="btn btn-outline-secondary my-2 my-sm-0">
                        <i class="mdi mdi-plus"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="btn btn-outline-danger my-2 my-sm-0">Bestellung aufgeben
                        <i class="mdi mdi-chevron-right"></i>
                    </a>
                </li>
            </ul>
        </div>
    </nav>
</div>
</template>

<script>
export default {
    props: ['totalBuyers', 'totalOrders', 'winnings'],
    mounted() {
        //
    },
    data() {
        return {}
    },
    methods: {}
}
</script>
