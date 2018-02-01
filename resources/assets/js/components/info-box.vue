<template>
<transition name="info-box">
  <div class="info-box" :style="style">
    <div class="container">
      <div class="card" ref="container">
        <div class="card-body">
          <h4 class="card-title">Infos zum Bestellablauf</h4>

          <div class="alert alert-info">
            <i class="mdi mdi-information-outline mdi-18px">&nbsp;</i>Wenn Ihr Rückfragen zu diesem Formular habt, ruft uns gerne jederzeit von Mo-Fr 9-18 Uhr unter <a href="tel:076170788833">0761 / 707 888 33</a> an oder schreibt uns eine E-Mail an <a href="mailto:bestellung@neuemasche.com">bestellung@neuemasche.com</a>.
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
