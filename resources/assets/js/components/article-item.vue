<template>
    <div class="input-group row no-gutters article-item mb-2">
        <div class="input-group col-3 no-gutters">
            <span class="input-group-btn col">
                <input-number :step="step" :min="min" :max="max" :maxlength="maxLength"  :startQuantity="article.amount" @onInputNumberChange="onInputNumberChange"></input-number>
            </span>
            <span class="input-group col-hash">
                <i class="mdi mdi-pound"></i>
            </span>
        </div>
        <v-select :value.sync="article.id" :options="autocomplete" :on-change="onArticleChange" label="id"></v-select>
        <span class="input-group-addon col-5">
            {{ article.name }}
        </span>
        <span class="input-group-addon col-2">
            {{ sum }}€
        </span>
        <span class="input-group-btn col-2">
            <a href="" class="btn btn-outline-secondary btn-block" @click="onArticleDelete">
                <i class="mdi mdi-delete"></i>
            </a>
        </span>
    </div>
</template>

<script>
export default {
    props: ['articleId', 'articleIndex'],
    mounted() {
        //
    },
    data() {
        return {
            step: 1,
            min: 1,
            max: 100,
            maxLength: 3,
            //article: this.articleData
        };
    },
     computed: {
         article() {
            return this.$store.state.articles[this.articleIndex];
         },
         sum() {
             return this.article.amount*this.article.price;
         },
         autocomplete() {
             return this.$store.state.articles;
         }
     },
     methods: {
         onInputNumberChange (value) {
             this.article.amount = value;
         },
         onArticleDelete (e) {
             e.preventDefault();
             this.$emit('onArticleDelete', this.articleIndex);
             console.log(this.articleIndex);
         },
         onArticleChange(newArticle) {
             this.articleData.name = newArticle.name;
         }
     }
}
</script>
