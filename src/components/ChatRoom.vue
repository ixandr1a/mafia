<template>
  <div class="chat-window">
    <div class="chat-window__wrapper">
      <div ref="test" class="messages">
        <div
          class="message"
          :class="{
            this: username === message.name,
            admin: message.name === 'admin',
          }"
          v-for="message in messages"
          :key="message.id"
        >
          <div class="username" @click="func()">{{ message.name }}</div>
          <div class="message-text">{{ message.msg }}</div>
        </div>
      </div>
    </div>
    <form class="input-container" v-on:submit="sendMessage">
      <input type="text" v-model="msg" />
      <button v-on:click="sendMessage" v-bind:disabled="!msg">Send</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "chatroom",
  props: ["messages", "username"],
  data: function() {
    return {
      msg: "",
    };
  },
  methods: {
    sendMessage: function() {
      if (!this.msg) {
        alert("Please enter a message");
        return;
      }
      this.$emit("sendMessage", this.msg);
      this.msg = "";
    },
  },
};
</script>
