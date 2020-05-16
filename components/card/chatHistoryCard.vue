<template>
  <v-card class="pa-2" outlined tile height="200" style="overflow: auto;" ref="chathistory">
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
import sharedService from '~/services/shared.js';

export default {
  data() {
    return {
      status: false,
    };
  },
  props: {
    chatMessages: {},
  },

  mounted() {
  },

  methods: {
    scrollToBottom() {
      const ele = this.$refs.chathistory.$el;
      //const isScrolledToBottom = ele.scrollHeight - ele.clientHeight <= ele.scrollTop + 1

      // scroll to bottom if isScrolledToBottom is true
      if(true) {
        ele.scrollTop = ele.scrollHeight - ele.clientHeight
      }
    }
  },

  watch: {
    "chatMessages.length": function(val) {
      setTimeout(() => {
        this.scrollToBottom();
      }, 150);
    }
  }
}
</script>

