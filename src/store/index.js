import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import collegeStudent from './modules/college-student'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    errors: []
  },
  mutations: {
    CLEAR_ERRORS(state) {
      state.errors = []
    },
    SET_ERRORS(state, errors) {
      state.errors = errors
    }
  },
  actions: {
  },
  modules: {
    auth,
    collegeStudent
  }
})

export default store