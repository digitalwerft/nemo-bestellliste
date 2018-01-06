<template>
<transition name="info-box">
  <div class="info-box" :style="style">
    <div class="container">
      <div class="card" ref="container">
        <div class="card-body">
          <h4 class="card-title">Infos zum Bestellablauf</h4>
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
