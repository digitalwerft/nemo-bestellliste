<template>
    <div class="input-group row no-gutters article-item mb-2">
        <div class="input-group col-3 no-gutters">
            <span class="input-group-btn col">
                <input-number :step="1" :min="1" :max="100" :maxlength="3"  :startQuantity="amount" @onInputNumberChange="onChange"></input-number>
            </span>
            <span class="input-group col-hash">
                <i class="mdi mdi-pound"></i>
            </span>
        </div>
        <input v-model="id" type="text" class="form-control col-6" placeholder="Artikelnummer">
        <span class="input-group-addon col-5">
            {{ name }}
        </span>
        <span class="input-group-addon col-2">
            {{ sum }}€
        </span>
        <span class="input-group-btn col-2">
            <a href="#" class="btn btn-outline-secondary btn-block">
                <i class="mdi mdi-delete"></i>
            </a>
        </span>
    </div>
</template>

<script>
export default {
    mounted() {
        //
    },
    data() {
        return {
            amount: 2,
            id: 101,
            price: 15,
            name: 'Hilda'
        };
    },
     computed: {
         sum() {
             return this.amount*this.price;
         }
     },
     methods: {
         onChange (value) {
             this.amount = value;
         }
     }
}
</script>
