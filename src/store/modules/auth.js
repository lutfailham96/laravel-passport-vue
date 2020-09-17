import $axios from '@/api'
import Cookie from 'js-cookie'

const state = () => ({
    accessToken: Cookie.get('access_token'),
    tokenDate: Cookie.get('access_date')
})

const mutations = {
    SET_ACCESS_TOKEN(state, accessToken) {
        state.accessToken = accessToken
    },
    SET_TOKEN_DATE(state, tokenDate) {
        state.tokenDate = tokenDate
    }
}

const actions = {
    login({ commit }, credentials) {
        return new Promise((resolve, reject) => {
            $axios.post('user/login', credentials).then(response => {
                if (response.data.status === 'OK') {
                    const accessToken = response.data.access_token
                    const tokenDate = Date.now()
                    Cookie.set('access_token',accessToken)
                    Cookie.set('access_date', tokenDate)
                    commit('SET_ACCESS_TOKEN', accessToken)
                    commit('SET_TOKEN_DATE', tokenDate)
                    commit('CLEAR_ERRORS', null, { root: true })
                } else {
                    commit('CLEAR_ERRORS', null, { root: true })
                    commit('SET_ERRORS', {
                        credentials: false
                    }, { root: true })
                }
                resolve(response)
            }).catch(error => {
                const errors = error.response.data.errors
                commit('SET_ERRORS', errors, { root: true })
                reject(error)
            })
        })
    },
    logout({ commit }) {
        Cookie.remove('access_token')
        Cookie.remove('access_date')
        commit('SET_ACCESS_TOKEN', null)
        commit('SET_TOKEN_DATE', null)
    }
}

const getters = {
    loggedIn: state => {
        const now = Date.now()
        const days = 604800
        return state.accessToken != null && now - parseInt(state.tokenDate) <= days
    }
}


export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}