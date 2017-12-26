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
                    <div class="buyer-details">
                        Artikel: {{ articleCount }} | Summe: {{ totalPrice }}€
                    </div>
                </div>
                <div class="card-footer">
                    <div class="row no-gutters">
                        <div class="col">
                            <a href="" class="btn btn-light text-success btn-sm btn-block" @click="handleLeftButtonClick" :class="{active: editing}">
                                <i class="mdi" :class="{'mdi-pencil': !editing, 'mdi-check': editing}"></i>
                                <span v-if="editing">speichern</span>
                            </a>
                        </div>
                        <div class="col">
                            <a href="" class="btn btn-light text-danger btn-sm btn-block" @click="handeRightButtonClick">
                                <i class="mdi" :class="{'mdi-delete': !editing, 'mdi-close': editing}"></i>
                                <span v-if="editing">abbrechen</span>
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
        <modal v-if="showModal" @close="showModal = false">
            <h5 slot="header">Bestellung wirklich löschen?</h5>
            <span slot="body">
                Diese Aktion kann nicht rückgängig gemacht werden.
            </span>
            <div slot="footer" class="modal-footer">
                <button class="btn btn-secondary col" @click="showModal = false">abbrechen</button>
                <button class="btn btn-danger col" @click="archive">Löschen</button>
            </div>
        </modal>
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
            oldName: '',
            showModal: false
        }
    },
    computed: {
        articleCount() {
            var counter = 0;
            _.each(this.buyer.articles, function(article) {
                counter = counter + article.amount;
            });
            return counter;
        },
        totalPrice() {
            var prize = 0;
            _.each(this.buyer.articles, function(article) {
                prize += article.amount*article.price;
            });
            return prize;
        }
    },
    methods: {
        deleteArticle(event) {
            this.buyer.articles.splice(event, 1);

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
                    this.buyer.name = this.oldName;
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

            if(!this.editing) {
                //this.archive();
                this.showModal = true;
            } else if(this.oldName == '' && this.buyer.articles.length < 1) {
                this.showModal = true;
            }
            else {
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
        archive() {
            //this.$emit('on-buyer-archived', this.buyerIndex);
            this.buyer.state = 'archived';
            var _this = this;
            this.$note.info({
                message: 'Bestellung gelöscht.',
                buttons: [
                    ['<button>rückgängig</button>', (instance, toast) => {
                        _this.undo();
                        instance.hide(toast);
                    }]
                ],
                onClosing: (instance, toast, closedBy) => {
                    _this.delete();
                }
            })
        },
        delete() {
            this.$emit('on-buyer-delete', this.buyerIndex);
        },
        undo() {
            this.buyer.state = 'active';
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
