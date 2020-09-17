import axios from 'axios'
import Cookie from 'js-cookie'

const $axios = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: {
        Authorization: Cookie.get('access_token') !== null ? 'Bearer ' + Cookie.get('access_token') : 'None'
    }
})

export default $axios