<template>
    <div class="row owner small-gutters mb-1 row-eq-height">
        <div class="col-7">
            <div class="card">
                <div class="card-body owner-name">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Name" value="Adrian Goldner">
                        <span class="input-group-btn">
                            <a href="#" class="btn btn-link text-danger">
                                <i class="mdi mdi-delete"></i>
                            </a>
                        </span>
                    </div>
                </div>
            </div>

        </div>
        <div class="col-11 article-list">
            <div class="card">
                <div class="card-body">
                        <article-item></article-item>
                        <article-item></article-item>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    mounted() {
        //console.log('Component Owner mounted.')
    }
}
</script>
