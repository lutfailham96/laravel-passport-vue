<template>
  <div id="app">
    <div id="nav">
      <router-link to="/" v-if="loggedIn">Home</router-link>
      <router-link :to="{ name: 'CollegeStudent' }" v-if="loggedIn">College Student Data</router-link>
      <router-link to="/about" v-if="loggedIn">About</router-link>
      <a href="#" @click="doLogout" v-if="loggedIn">Logout</a>
      <router-link :to="{ name: 'Login' }" v-if="!loggedIn">Login</router-link>
    </div>
    <transition name="fade" mode="out-in">
      <keep-alive>
        <router-view />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters('auth', ['loggedIn'])
  },
  methods: {
    ...mapActions('auth', ['logout']),
    doLogout() {
      this.logout()
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  margin-left: 4px;
  margin-right: 4px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.fade-enter-active, .fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>
