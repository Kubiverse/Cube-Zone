<template>
  <scramble-display
    :scramble="scrambleComputed"
    :event="eventComputed"
    :checkered="checkered"
    :visualization="visualization"
  ></scramble-display>
</template>

<script>
export default {
  props: {
    scramble: {},
    puzzle: {},
    solved: {},
    visualization: {},
    checkered: {
      type: Boolean,
    },
  },
  data() {
    return {
      puzzleEventMap: {
        '2x2x2': '222',
        '3x3x3': '333',
        '4x4x4': '444',
        '5x5x5': '555',
        '6x6x6': '666',
        '7x7x7': '777',
        pyraminx: 'pyram',
        megaminx: 'minx',
        'square-1': 'sq1',
        clock: 'clock',
        skewb: 'skewb',
      },
    }
  },

  computed: {
    eventComputed() {
      return this.puzzle in this.puzzleEventMap
        ? this.puzzleEventMap[this.puzzle]
        : null
    },
    scrambleComputed() {
      return this.solved ? null : this.scramble
    },
  },

  watch: {
    solved(val) {
      if (val) {
        this.reset()
      }
    },

    scramble(val) {
      if (val) {
        this.reset()
      }
    },
  },

  mounted() {
    this.reset()
  },

  methods: {
    reset() {},
  },
}
</script>

<style scoped>
scramble-display {
  resize: both;
  overflow: hidden;
  text-align: initial;
}
</style>
