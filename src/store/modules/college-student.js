import $axios from '@/api'

const state = () => ({
    collegeStudents: [],
    query: {
        page: 1,
        perPage: 10,
        search: '',
        sortBy: 'name',
        sortDesc: false
    },
    meta: {
        total: 0,
        current_page: 0,
        last_page: 0,
        from: 0,
        to: 0
    },
    defaultItem: {
        uuid: '',
        name: '',
        email: '',
        address: '',
        phone: '',
        created_at: '',
        updated_at: ''
    },
    editedItem: {
        uuid: '',
        name: '',
        email: '',
        address: '',
        phone: '',
        created_at: '',
        updated_at: ''
    },
    editedIndex: -1
})

const mutations = {
    SET_COLLEGE_STUDENTS(state, collegeStudents) {
        state.collegeStudents = collegeStudents
    },
    SET_META(state, meta) {
        state.meta = meta
    },
    RESET_COLLEGE_STUDENT(state) {
        state.editedItem = Object.assign({}, state.defaultItem)
        state.editedIndex = -1
    },
    SET_COLLEGE_STUDENT(state, collegeStudent) {
        state.editedIndex = state.collegeStudents.indexOf(collegeStudent)
        state.editedItem = Object.assign({}, collegeStudent)
    }
}

const actions = {
    getCollegeStudents({ commit, state }) {
        return new Promise((resolve, reject) => {
            $axios.get('college-student?page=' + state.query.page + '&per_page=' + state.query.perPage + '&search=' + state.query.search + '&sort_by=' + state.query.sortBy + '&sort_desc=' + state.query.sortDesc).then(response => {
                commit('SET_COLLEGE_STUDENTS', response.data.data)
                commit('SET_META', {
                    total: response.data.total,
                    current_page: response.data.current_page,
                    last_page: response.data.last_page,
                    from: response.data.from,
                    to: response.data.to
                })
                resolve(response)
            }).catch(error => reject(error))
        })
    },
    deleteCollegeStudent(_, uuidCollegeStudent) {
        return new Promise((resolve, reject) => {
            $axios.delete('college-student/' + uuidCollegeStudent).then(response => {
                if (response.data.status === 'OK')
                    resolve(response)
            }).catch(error => reject(error))
        })
    },
    postCollegeStudent({ commit, state }) {
        return new Promise((resolve, reject) => {
            $axios.post('college-student', state.editedItem).then(response => {
                if (response.data.status === 'OK') {
                    commit('CLEAR_ERRORS', null, { root: true })
                    resolve(response)
                }
            }).catch(error => {
                const errors = error.response.data.errors
                commit('SET_ERRORS', errors, { root: true })
                reject(error)
            })
        })
    },
    putCollegeStudent({ commit, state }) {
        return new Promise((resolve, reject) => {
            $axios.put('college-student/' + state.editedItem.uuid, state.editedItem).then(response => {
                if (response.data.status === 'OK') {
                    Object.assign(state.collegeStudents[state.editedIndex], state.editedItem)
                    commit('CLEAR_ERRORS', null, { root: true })
                    resolve(response)
                }
            }).catch(error => {
                const errors = error.response.data.errors
                commit('SET_ERRORS', errors, { root: true })
                reject(error)
            })
        })
    }
}

export default {
    namespaced: true,
    name: 'collegeStudent',
    state,
    mutations,
    actions
}