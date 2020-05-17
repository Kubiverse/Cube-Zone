<template>
  <span :style="styleComputed">{{ scrambleString }}</span>
</template>

<script>
export default {
  props: {
    scramble: {},
    event: {},
    size: {},
  },
  computed: {
    scrambleString() {
      let scramble = this.scramble.scramble
      if (this.isMegaminx) {
        return this.megaminxScramble(scramble)
      }
      return scramble
    },
    isMegaminx() {
      return (this.event?.puzzle || this.scramble.event?.puzzle) == 'megaminx'
    },

    styleComputed() {
      return this.size ? 'font-size:' + this.size + 'px;' : null
    },
  },
  methods: {
    megaminxScramble(scramble) {
      return scramble
        .replace(/R(\+|-)..D(\+|-)../g, '$1$2 ')
        .replace(/U(\n|$)/g, 'U $1')
    },
  },
}
</script>

<style scoped>
span {
  white-space: pre-wrap;
  font-family: monospace;
  display: inline-block;
  vertical-align: top;
}
</style>
