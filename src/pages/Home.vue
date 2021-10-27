<template>
  <div :class="{ active: step === 4 || step === 0 }" id="app">
    <div v-if="show === false" class="register-wrapper">
      <div class="register-block">
        <h2>Вход</h2>
        <div class="register-block__input">
          <input
            type="text"
            placeholder="Введите имя"
            name="name"
            v-model="username"
          />
          <input
            type="text"
            placeholder="Введите комнату"
            name="room"
            v-model="roomId"
          />
        </div>
        <button @click="join()" class="button">Войти</button>
      </div>
    </div>
    <div v-if="show === true" class="mafia-game">
      <div v-if="username === 'admin'" class="admin-bar">
        <a v-if="step === 0" @click="startGame()">Начать игру</a>
        <a v-if="step === 4" @click="lastGame()">Город засыпает</a>
        <a v-if="step === 1" @click="startGame()">Мафия просыпается</a>
        <a v-if="step === 3" @click="startGame()">Город просыпается</a>
      </div>
      <div class="mafia-game__window">
        <div class="mafia-game__wrapper">
          <div
            v-for="user in users"
            :key="user.id"
            class="mafia-game__wrapper__item"
          >
            <div class="card"></div>
            <div class="title">
              <p>Имя: {{ user.name }}</p>
              <p v-if="role === user.role">
                <span v-if="user.role === 1">Мирный житель</span>
                <span v-if="user.role === 0">Неизвестно</span>
                <span v-if="user.role === 2">Мафия</span>
                <span v-if="user.role === 3">Доктор</span>
              </p>
              <p v-else>
                <span>Мирный житель</span>
              </p>
              <p class="admin-users" v-if="username === 'admin'">
                <span v-if="user.role === 1"
                  >Мирный житель<a @click="startGame(user)" v-if="step === 1"
                    >Убить</a
                  >
                  <a @click="startGame(user)" v-if="step === 2"
                    >Вылечить</a
                  ></span
                >
                <span v-if="user.role === 0"
                  >Неизвестно<a @click="startGame(user)" v-if="step === 1"
                    >Убить</a
                  >
                  <a @click="startGame(user)" v-if="step === 2"
                    >Вылечить</a
                  ></span
                >
                <span v-if="user.role === 2">Мафия</span>
                <span v-if="user.role === 3"
                  >Доктор<a @click="startGame(user)" v-if="step === 1">Убить</a>
                  <a @click="startGame(user)" v-if="step === 2"
                    >Вылечить</a
                  ></span
                >
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="mafia-game__chatroom">
        <div class="chatroom-title">
          <div>
            <p>
              Имя: <span>{{ username }}</span>
            </p>
          </div>
          <div>
            <p>
              Комната: <span>{{ roomId }}</span>
            </p>
            <p class="online-count">
              Online: <span>{{ users.length }}</span>
            </p>
          </div>
        </div>
        <div class="chatroom-users">
          <div class="chatroom-users__list">
            <ul>
              <li v-for="user in users" :key="user.id">
                <p>{{ user.name }}</p>
                <span class="online">online</span>
              </li>
            </ul>
          </div>
        </div>
        <ChatRoom
          ref="test"
          v-bind:messages="messages"
          v-bind:username="username"
          v-on:sendMessage="this.sendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import ChatRoom from "../components/ChatRoom";
export default {
  name: "app",
  components: {
    ChatRoom,
  },
  data: function() {
    return {
      reserveUsers: [],
      killedName: "",
      username: "",
      admin: "",
      step: 0,
      role: null,
      roomId: null,
      socket: io("http://192.168.0.102:3000"),
      messages: "",
      users: [],
      room: [],
      show: false,
    };
  },
  methods: {
    lastGame() {
      this.step = 1;
      let obj = {
        step: 1,
        room: this.roomId,
      };
      this.socket.emit("dayAndNight", obj);
      this.listen();
    },
    startGame(value) {
      if (this.step === 0) {
        this.socket.emit("getByRole", this.roomId);
        let adminMsg = {
          msg: "Игра началась, все игроки получили свои роли",
          name: "admin",
          room: this.roomId,
        };
        this.socket.emit("msg", adminMsg);
        this.step = 1;
        let obj = {
          step: 1,
          room: this.roomId,
        };
        this.socket.emit("dayAndNight", obj);
      }
      if (this.step === 1 && !value) {
        let adminMsg = {
          msg: "Мафия просыпается",
          name: "admin",
          room: this.roomId,
        };
        this.socket.emit("msg", adminMsg);
      }
      if (this.step === 1 && value) {
        let adminMsg = {
          msg: "Мафия сделала свой выбор",
          name: "admin",
          room: this.roomId,
        };
        this.socket.emit("msg", adminMsg);
        this.socket.emit("killedUser", value);
        this.step = 2;
        value = "";
      }
      if (this.step === 2 && !value) {
        let adminMsg = {
          msg: "Мафия засыпает, просыпается доктор",
          name: "admin",
          room: this.roomId,
        };
        this.socket.emit("msg", adminMsg);
      }
      if (this.step === 2 && value) {
        this.socket.emit("healthUser", value);
        this.closeStep();
      }
      if (this.step === 3) {
        this.users = this.reserveUsers;
        let adminMsg = {
          msg: `Город просыпается, сегодня был убит: ${this.killedName}. Доктор вылечил: ${this.healthName}`,
          name: "admin",
          room: this.roomId,
        };
        this.socket.emit("msg", adminMsg);
        let obj = {
          roomId: this.roomId,
          killedName: this.killedName,
        };
        this.socket.emit("resetStatus", obj);
        let msg = {
          step: 4,
          room: this.roomId,
        };
        this.socket.emit("dayAndNight", msg);
        console.log("ebaniy rot");
        this.step = 4;
      }
      this.listen();
      this.notif();
    },
    join() {
      if (this.username != "" && this.roomId != 0) {
        this.socket.emit("newuser", this.username, this.roomId);
        this.show = true;
      } else {
        alert("Заполните все поля");
      }
    },
    notif: function() {
      let audio = new Audio(
        "https://cdn-static.namobilu.com/u/ring/f/773/096/zvuk_soobshheniya_telegramm.mp3"
      );
      audio.play();
    },
    joinServer: function() {
      this.socket.on("loggedIn", (data) => {
        this.messages = data.messages;
        this.users = data.users;
      });
      this.listen();
    },
    closeStep: function() {
      this.socket.on("health", (data) => {
        this.reserveUsers = data.users;
        this.killedName = data.killedName;
        this.healthName = data.healthName;
        this.step = 3;
      });
    },
    listen: function() {
      this.socket.on("getDayAndNight", (value) => {
        this.step = value;
        console.log(value);
      });
      this.socket.on("killed", (killed) => {
        this.users = killed;
      });
      this.socket.on("userRole", (user) => {
        function shuffle(array) {
          for (
            var j, x, i = array.length;
            i;
            j = parseInt(Math.random() * i),
              x = array[--i],
              array[i] = array[j],
              array[j] = x
          );
          return true;
        }
        shuffle(user);
        this.users = user;
        this.users.forEach((item) => {
          if (item.id === this.socket.id) {
            this.role = item.role;
          }
        });
      });
      this.socket.on("AllMessagesInByRoom", (msg) => {
        this.messages = msg;
        setTimeout(() => {
          this.$refs.test.$el.firstChild.scrollTop = this.$refs.test.$el.firstChild.scrollHeight;
        }, 50);
      });
      this.socket.on("userOnline", (user) => {
        this.users = user;
        let test = new Audio(
          "https://cdn-static.namobilu.com/u/ring/f/930/083/samsung_galaxy_brilliant_tone.mp3"
        );
        test.play();
      });
      this.socket.on("newMsg", (msg, currentMsg) => {
        if (currentMsg.name === this.username) {
          console.log("test");
        } else {
          this.notif();
        }
        this.messages = msg;
        setTimeout(() => {
          this.$refs.test.$el.firstChild.scrollTop = this.$refs.test.$el.firstChild.scrollHeight;
        }, 50);
      });
      this.socket.on("userLeft", (user) => {
        this.users = user;
      });
    },
    sendMessage: function(message) {
      let obj = {
        msg: message,
        name: this.username,
        room: this.roomId,
      };
      this.socket.emit("msg", obj);
    },
  },
  mounted: function() {
    this.joinServer();
  },
};
</script>

<style></style>
