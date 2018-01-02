<template>
<div class="v-input-number">
  <div class="v-input-number-arrows">
    <a @click.prevent="increaseNumber" @mousedown="onMousedown($event, 'up')" @mouseup="onMouseup" class="v-input-number-up"><i class="v-input-number-icon"></i></a>
    <a @click.prevent="decreaseNumber" @mousedown="onMousedown($event, 'down')" @mouseup="onMouseup" class="v-input-number-down"><i class="v-input-number-icon"></i></a>
  </div>

  <input ref="number" type="text" v-bind:value="numericValue" @keypress="validateInput" class="v-input-number-input" :min="min" :max="max" debounce="500" @keyup="onKeyup($event)" @keydown="onKeydown($event)" @blur="onBlur" />
</div>
</template>

<script>
export default {
  data: function() {
    return {
      numericValue: this.value,
      isKeydown: false,
      clicked: false,
      interval: 0,
      timeout: 0,
    };
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    min: {
      default: 0,
      type: Number
    },
    max: {
      default: 10,
      type: Number
    },
    step: {
      default: 1,
      type: Number
    },
    inputClass: {
      default: 'vnis__input',
      type: String
    },
    buttonClass: {
      default: 'vnis__button',
      type: String
    },
    integerOnly: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    onKeyup(e) {
      this.isKeydown = false

      if ([48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(e.keyCode) >= 0) {
        this.numericValue = parseInt(this.$refs.number.value)
        this.emitChange()
        return
      }


    },
    onKeydown(e) {
      this.isKeydown = true
      // Up key: Increase the value
      if (e.keyCode === 38) {
        this.increaseNumber()
        e.preventDefault()
        return
      }
      // Down key: Decrease the value
      if (e.keyCode === 40) {
        this.decreaseNumber()
        e.preventDefault()
        return
      }

    },
    onMouseup(e) {
      this.clicked = false
      clearTimeout(this.timeout)
      clearInterval(this.interval)
    },
    onMousedown(e, dir) {
      this.clicked = false
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        clearInterval(this.interval)
        this.interval = setInterval(() => {
          if (this.clicked) {
            this.clicked = false
            clearInterval(this.interval)
            clearTimeout(this.timeout)
            return
          }
          if (dir === 'up') this.increaseNumber()
          if (dir === 'down') this.decreaseNumber()
        }, 30)
      }, 400)
    },
    onBlur() {
      //console.log('blur')
    },
    changeInput(value) {
      this.numericValue = value;
    },
    increaseNumber() {
      this.numericValue += this.step;
    },
    decreaseNumber() {
      this.numericValue -= this.step;
    },
    emitChange() {
      this.$emit('onInputNumberChange', this.numericValue)
    },
    isInteger(evt) {
      evt = (evt) ? evt : window.event;
      let key = evt.keyCode || evt.which;
      key = String.fromCharCode(key);
      const regex = /[0-9]/;
      if (!regex.test(key)) {
        evt.returnValue = false;
        if (evt.preventDefault) evt.preventDefault();
      }
    },
    isNumber(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    validateInput(evt) {
      if (this.integerOnly === true) {
        this.isInteger(evt);
      } else {
        this.isNumber(evt);
      }
    }
  },
  watch: {
    numericValue: function(val, oldVal) {
      this.emitChange();
      if (val <= this.min) {
        this.numericValue = parseInt(this.min);
      }
      if (val >= this.max) {
        this.numericValue = parseInt(this.max);
      }
      if (val <= this.max && val >= this.min) {
        this.$emit('input', val, oldVal);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
*,
*::after,
*::before {
    box-sizing: border-box;
}
.vnis {
    &__input {
        -webkit-appearance: none;
        border: 1px solid #ebebeb;
        float: left;
        font-size: 16px;
        //height: 40px;
        margin: 0;
        outline: none;
        text-align: center;
        width: calc(100% - 80px);
        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button {
            -webkit-appearance: none;
        }
    }
    &__button {
        -webkit-appearance: none;
        transition: background 0.5s ease;
        background: #387e90;
        border: 0;
        color: #fff;
        cursor: pointer;
        float: left;
        font-size: 20px;
        //height: 40px;
        margin: 0;
        outline: none;
        //width: 40px;
        &:hover {
            background: lighten(#387e90, 10%);
        }
    }
}
</style>
