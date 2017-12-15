<template>
    <div class="row buyer small-gutters mb-1 row-eq-height">
        <div class="col-7">
            <div class="card buyer-name-card" @click="cancelEdit" :class="{editing: editing}">
                <div class="card-body buyer-name">
                    <div class="input-group">
                        <input type="text" class="form-control" :class="{ hidden: !editing}" placeholder="Name" v-model="buyerData.name">
                        <div class="input-group buyer-name-title" :class="{ hidden: editing}">
                            <h6 v-html="highlight(buyerData.name)"  @click="makeEditable"></h6>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="row no-gutters">
                        <div class="col">
                            <a href="" class="btn btn-light text-success btn-sm btn-block" @click="handleLeftButtonClick" :class="{active: editing}">
                                <i class="mdi" :class="{'mdi-pencil': !editing, 'mdi-check': editing}"></i>
                            </a>
                        </div>
                        <div class="col">
                            <a href="" class="btn btn-light text-danger btn-sm btn-block" @click="handeRightButtonClick">
                                <i class="mdi" :class="{'mdi-delete': !editing, 'mdi-close': editing}"></i>
                            </a>
                        </div>
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
                <div class="card-footer">
                    <button class="btn btn-light btn-block btn-sm" :disabled="!buyer.name" @click="addArticle"><i class="mdi mdi-plus"></i> Artikel hinzufügen</button>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['buyerData', 'buyerIndex', 'filterkey'],
    mounted() {
        if(this.buyer.name === '') {
            this.editing = true;
        }
    },
    data() {
        return {
            buyer: this.buyerData,
            editing: false,
            oldName: ''
        }
    },
    methods: {
        deleteArticle(event) {
            this.buyer.articles.splice(event.index, 1);
            //if(this.buyer.articles.length < 1) {
                //console.log(this.buyer.articles);
                //this.$emit('allArticlesRemoved');
            //}
        },
        makeEditable(e) {
            e.preventDefault();
            this.editing = !this.editing;
            this.oldName = this.buyerData.name;
        },
        cancelEdit(e) {
            if(this.editing) {
                if(!$(e.target).is('input, .btn, h6, .mdi')) {
                    this.editing = false;
                }
            }
        },
        highlight(words) {
            if(this.filterkey != '') {
                var iQuery = new RegExp(this.filterkey, "ig");
                //console.log(iQuery);
                return words.toString().replace(iQuery, function(matchedTxt,a,b){
                    return ('<span class=\'highlight\'>' + matchedTxt + '</span>');
                });
            } else {
                return words;
            }
        },
        handeRightButtonClick(e) {
            e.preventDefault();

            if(!this.editing || (this.oldName == '' && this.buyer.articles.length < 1)) {
                this.delete();
            } else {
                this.editing = false;
                this.buyer.name = this.oldName;
            }
        },
        handleLeftButtonClick(e) {
            e.preventDefault();
            if(!this.editing) {
                this.makeEditable(e);
            } else {
                this.oldName = '';
                this.editing = false;
            }
        },
        delete() {
            this.$emit('on-buyer-delete', this.buyerIndex);
        },
        addArticle() {
            if(!this.buyer.articles) {
                this.buyer.articles = [];
            }
            this.buyer.articles.push({
                amount: 1,
                name: '',
                id: '',
                price: 0
            });
        }
    }
}
</script>
