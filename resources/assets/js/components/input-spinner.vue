<template>
<div class="number-input-spinner">
  <!-- <div class="v-input-number-arrows d-none">
    <a @click.prevent="increaseNumber" @mousedown="onMousedown($event, 'up')" @mouseup="onMouseup" class="v-input-number-up"><i class="v-input-number-icon"></i></a>
    <a @click.prevent="decreaseNumber" @mousedown="onMousedown($event, 'down')" @mouseup="onMouseup" class="v-input-number-down"><i class="v-input-number-icon"></i></a>
  </div> -->

  <div class="number-input-spinner-decrease">
    <a class="btn btn-light number-input-spinner-decrease-button" :class="{disabled: disabled}" href="#" @click.prevent="decreaseNumber" @mousedown="onMousedown($event, 'down')" @mouseup="onMouseup">
      <i class="mdi mdi-minus"></i>
    </a>
  </div>

  <div class="number-input-spinner-input">
    <input ref="number" type="text" v-bind:value="numericValue" @keypress="validateInput" :min="min" :max="max" debounce="500" @keyup="onKeyup($event)" @keydown="onKeydown($event)" @blur="onBlur"/>
  </div>

  <div class="number-input-spinner-increase">
    <a class="btn btn-light number-input-spinner-increase-button" :class="{disabled: disabled}" href="#" @click.prevent="increaseNumber" @mousedown="onMousedown($event, 'up')" @mouseup="onMouseup">
      <i class="mdi mdi-plus"></i>
    </a>
  </div>
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
    disabled: {
      type: Boolean,
      default: false
    },
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
        this.setValue(parseInt(this.$refs.number.value))
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
    setValue(value, emitChange = true) {
      this.numericValue = value
      if(emitChange && this.$store.state.action != 'SEARCHING') {
        this.emitChange()
      }
    },
    changeInput(value, emitChange = true) {
      if (value > this.max) {
        this.setValue(this.max, emitChange)
        return
      } else if (value < this.min) {
        this.setValue(this.min, emitChange)
        return
      } else {
        this.setValue(value, emitChange)
        return
      }
    },
    increaseNumber() {
      this.setValue(this.numericValue + this.step)
    },
    decreaseNumber() {
      this.setValue(this.numericValue -this.step)
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
    value(val) {
      this.changeInput(val, false);
    },
    numericValue: function(val, oldVal) {
      if (val <= this.min) {
        this.setValue(parseInt(this.min))
      } else if (val >= this.max) {
        this.setValue(parseInt(this.max))
      }
      if (val <= this.max && val >= this.min) {
        if(this.$store.state.action != 'DELETING_ITEM' && this.$store.state.action != 'SEARCHING') {
          this.$emit('input', val, oldVal)
         }
      }
    }
  }
};
</script>
