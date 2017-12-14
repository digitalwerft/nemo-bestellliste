<template>
    <div class="row buyer small-gutters mb-1 row-eq-height">
        <div class="col-7">
            <div class="card">
                <div class="card-body buyer-name">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Name" v-model="buyerData.name">
                        <span class="input-group-btn">
                            <a href="" class="btn btn-link text-danger" @click="onDelete">
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
                    <div v-for="(article, index) in buyer.articles">
                        <article-item :article-data="article" :articleIndex="index" @onArticleDelete="deleteArticle($event)"></article-item>
                    </div>
                </div>
                <div class="card-footer text-muted">
                    <button class="btn btn-light btn-block btn-sm" :disabled="!buyer.name" @click="addArticle"><i class="mdi mdi-plus"></i> Artikel hinzufügen</button>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['buyerData', 'buyerIndex'],
    mounted() {
        //console.log(this.buyerData);
    },
    data() {
        return {
            buyer: this.buyerData
        }
    },
    methods: {
        deleteArticle(event) {
            this.buyerData.articles.splice(event.index, 1);
        },
        onDelete(e) {
            e.preventDefault();
            this.$emit('on-buyer-delete', this.buyerIndex);
        },
        addArticle(e) {
            if(!this.buyer.articles) {
                this.buyer.articles = [];
            }
            this.buyer.articles.push({
                amount: 1,
                name: '',
                id: '',
                price: 0
            });

            console.log(this.buyer.articles)
        }
    }
}
</script>
