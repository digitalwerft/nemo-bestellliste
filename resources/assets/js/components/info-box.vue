<template>
<transition name="info-box">
  <div class="info-box" :style="style">
    <div class="container">
      <div class="card" ref="container">
        <div class="card-body">
          <button type="button" class="close" aria-label="Close" @click="$emit('close-info')">
            <span aria-hidden="true">&times;</span>
          </button>

          <h4>In 3 Schritten zu deiner Sammelbestellung:</h4>
          <ul class="list-unstyled">
            <li>
              1. Teilnehmer hinzufügen und jeweilige Bestellungen (Artikelnummer und Anzahl) eintragen
            </li>
            <li>
              2. Zusammenfassung kontrollieren und drucken
            </li>
            <li>
              3. Abschicken
            </li>
          </ul>
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
