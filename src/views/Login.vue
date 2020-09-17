<template>
  <div class="container">
    <div class="w-50 mx-auto">
      <div class="card">
        <div class="card-body">
          <form class="text-left" @submit.prevent="doLogin">
            <div class="form-group">
              <label for="email">Email</label>
              <input id="email" class="form-control" :class="{ 'is-invalid': errors.email }" placeholder="Email" type="email" v-model="user.email">
              <div class="invalid-feedback" v-if="errors.email">
                {{ errors.email[0] }}
              </div>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input id="password" class="form-control" :class="{ 'is-invalid': errors.password }" placeholder="********" type="password" v-model="user.password">
              <div class="invalid-feedback" v-if="errors.password">
                {{ errors.password[0] }}
              </div>
            </div>
            <button class="btn btn-primary form-control my-2">Login</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: "Login",
  data() {
    return {
      user: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapActions('auth', ['login']),
    doLogin() {
      this.login(this.user).then(response => {
        if (response.data.status === 'OK') {
          this.$router.push({ name: 'Home' })
          this.resetUser()
        } else {
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: 'Invalid credentials',
            timer: 1500
          })
        }
      })
    },
    resetUser() {
      this.user.email = ''
      this.user.password = ''
    }
  },
  computed: {
    ...mapState(['errors'])
  }
}
</script>

<style scoped>

</style>