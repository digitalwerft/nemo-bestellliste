<template>
  <div class="text-success save-indicator">

    <transition name="fade">
      <i class="mdi mdi-check-circle-outline mdi-24px" v-if="(!isEditing && !isSaving)"></i>
    </transition>

    <transition name="fade">
      <spinner
        :status="true"
        :color="'#627794'"
        :size="20"
        :depth="3"
        :rotation="true"
        :speed="0.8"
        v-if="isSaving">
      </spinner>

    </transition>

    <transition name="fade">
      <i class="mdi mdi-adjust text-danger mdi-24px" v-if="(isEditing && !isSaving)"></i>
    </transition>
  </div>
</template>
<script>
  import Spinner from './spinner.vue'
  export default {
    props: ['isSaving', 'isEditing'],
    components: {
      Spinner
    },
    data() {
      return {}
    },
    methods: {
      emitSave() {
        if(this.isSaving) {
          this.$emit('saving', false)
        } else {
          this.$emit('saving', true)
        }
      }
    }
  }
</script>
