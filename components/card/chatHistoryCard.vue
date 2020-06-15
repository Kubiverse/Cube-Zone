<template>
  <v-card
    ref="chathistory"
    class="pa-2 resizeable-card"
    outlined
    tile
    height="200"
    style="overflow: auto;"
  >
    <div v-for="(item, i) in chatMessages" :key="i">
      <span v-if="item.system">
        <i>
          <b>{{ item.user.name }} </b>
          {{ item.message }}
        </i>
      </span>
      <span v-else>
        <b>{{ item.user.name }}: </b>
        {{ item.message }}
      </span>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    chatMessages: {},
  },
  data() {
    return {
      status: false,
    }
  },

  watch: {
    'chatMessages.length': function (_val) {
      setTimeout(() => {
        this.scrollToBottom()
      }, 150)
    },
  },

  mounted() {},

  methods: {
    scrollToBottom() {
      const ele = this.$refs.chathistory.$el
      // TODO: fix this commented out code
      //const isScrolledToBottom = ele.scrollHeight - ele.clientHeight <= ele.scrollTop + 1

      // scroll to bottom if isScrolledToBottom is true
      // if (true) {
      ele.scrollTop = ele.scrollHeight - ele.clientHeight
      // }
    },
  },
}
</script>

<style scoped>
.resizeable-card {
  resize: vertical;
  overflow: auto;
  max-height: 200px;
}
</style>
