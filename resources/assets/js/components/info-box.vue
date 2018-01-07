<template>
<transition name="info-box">
  <div class="info-box" :style="style">
    <div class="container">
      <div class="card" ref="container">
        <div class="card-body">
          <h4 class="card-title">Infos zum Bestellablauf</h4>

          <div class="alert alert-info">
            <i class="mdi mdi-information-outline mdi-18px">&nbsp;</i>Du brauchst Hilfe beim Bestellen? Du kannsz uns jederzeit unter <a href="tel:076170788833">0761 / 707 888 33</a> erreichen!
          </div>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>
<script>
export default {
  props: ['visible'],
  data() {
    return {
      style: {
        height: 0
      }
    }
  },
  watch: {
    visible(newVal, oldVal) {
      if (newVal) {
        this.style.height = `${this.$refs.container.clientHeight + 16}px`
      } else {
        this.style.height = 0;
      }
    }
  }
}
</script>
