<template>
  <div class="container">
    <div class="card mb-4">
      <div class="card-body">
        <div class="row">
          <div class="col">
            <button type="button" class="btn btn-success btn-sm float-left" @click="open">
              <i class="fa fa-plus" />
              Add new data
            </button>
          </div>
          <!-- Table top control -->
          <div class="col-lg-12 my-2">
            <!-- Per page -->
            <div class="d-flex float-left">
              <label for="show" class="my-auto mr-1">Show</label>
              <b-form-select size="md" id="show" v-model="query.perPage" :options="options" class="float-left" style="width: 60px"></b-form-select>
              <span class="ml-1 my-auto">entries</span>
            </div>
            <!-- Search -->
            <div class="float-right">
              <input type="text" class="form-control" v-model="query.search" placeholder="Search">
            </div>
          </div>
          <!-- Table -->
          <div class="col-lg-12">
            <!-- Table overlay -->
            <b-overlay :show="loading">
              <!-- Table content -->
              <b-table :items.sync="collegeStudents" :fields="fields" :sort-by.sync="query.sortBy" :sort-desc.sync="query.sortDesc" responsive="sm" show-empty>
                <template #cell(actions)="data">
                  <div class="d-flex">
                    <button class="btn btn-danger btn-sm mr-1" @click="removeCollegeStudent(data.item.uuid)"><i class="fa fa-trash" /></button>
                    <button class="btn btn-warning btn-sm ml-1" @click="editCollegeStudent(data.item)"><i class="fa fa-pencil" /></button>
                  </div>
                </template>
              </b-table>
              <!-- Modal item -->
              <b-modal hide-footer :title="formTitle" hide-header-close v-model="dialog" @hide="close">
                <form @submit.prevent="save">
                  <div class="form-group">
                    <label for="name">Name</label>
                    <input id="name" class="form-control" :class="{ 'is-invalid': errors.name }" placeholder="Lutfa Ilham" type="text" v-model="editedItem.name">
                    <div class="invalid-feedback" v-if="errors.name">
                      {{ errors.name[0] }}
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="email">Email</label>
                    <input id="email" class="form-control" :class="{ 'is-invalid': errors.email }" placeholder="lutfailham@email.com" type="email" v-model="editedItem.email" :readonly="editedIndex > -1">
                    <div class="invalid-feedback" v-if="errors.email">
                      {{ errors.email[0] }}
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="phone">Phone</label>
                    <input id="phone" class="form-control" :class="{ 'is-invalid': errors.phone }" placeholder="082xxxxxxxxx" type="text" v-model="editedItem.phone">
                    <div class="invalid-feedback" v-if="errors.phone">
                      {{ errors.phone[0] }}
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="address">Address</label>
                    <input id="address" class="form-control" :class="{ 'is-invalid': errors.address }" placeholder="Blora, Jawa Tengah" type="text" v-model="editedItem.address">
                    <div class="invalid-feedback" v-if="errors.address">
                      {{ errors.address[0] }}
                    </div>
                  </div>
                  <div class="float-right my-2">
                    <button type="button" class="btn btn-secondary mr-1" @click="close">
                      <i class="fa fa-undo" />
                      Cancel
                    </button>
                    <button type="submit" class="btn btn-primary ml-1">
                      <i class="fa fa-save" />
                      Save
                    </button>
                  </div>
                </form>
              </b-modal>
            </b-overlay>
          </div>
          <!-- Table bottom control -->
          <div class="col">
            <!-- Table info -->
            <div class="float-left my-2">
              <span class="text-black-50">
                Showing {{ meta.from }} to {{ meta.to }} of {{ meta.total }} entries
              </span>
            </div>
            <!-- Pagination -->
            <b-pagination class="float-right my-2" pills size="md" :per-page.sync="query.perPage" v-model="query.page" :total-rows.sync="meta.total"></b-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
const _ = require('lodash')

export default {
  name: "CollegeStudent",
  data() {
    return {
      fields: [
        { key: 'name', sortable: true},
        { key: 'email', sortable: true },
        { key: 'phone', sortable: true },
        { key: 'address', sortable: true },
        { key: 'actions', sortable: false }
      ],
      options: [
        { value: 5, text: '5'},
        { value: 10, text: '10'},
        { value: 25, text: '25'},
        { value: 50, text: '50'},
      ],
      loading: false,
      dialog: false
    }
  },
  computed: {
    ...mapState('collegeStudent', ['collegeStudents', 'query', 'meta', 'editedIndex', 'editedItem']),
    ...mapState(['errors']),
    formTitle() {
      return this.editedIndex > -1 ? 'Edit College Student' : 'Add College Student'
    }
  },
  methods: {
    ...mapActions('collegeStudent', ['getCollegeStudents', 'deleteCollegeStudent', 'postCollegeStudent', 'putCollegeStudent']),
    ...mapMutations('collegeStudent', ['SET_COLLEGE_STUDENT', 'RESET_COLLEGE_STUDENT', 'SET_COLLEGE_STUDENTS']),
    ...mapMutations(['CLEAR_ERRORS']),
    fetchCollegeStudents() {
      return new Promise(resolve => {
        this.loading = true
        this.getCollegeStudents().then(response => {
          this.loading = false
          resolve(response)
        }).catch(() => this.loading = false)
      })
    },
    editCollegeStudent(collegeStudent) {
      this.SET_COLLEGE_STUDENT(collegeStudent)
      this.open()
    },
    removeCollegeStudent(uuidCollegeStudent) {
      this.$swal({
        icon: 'warning',
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: 'Yes',
        reverseButtons: true
      }).then(result => {
        if (result.isConfirmed) {
          this.deleteCollegeStudent(uuidCollegeStudent).then(() => {
            this.fetchCollegeStudents()
            this.$swal({
              icon: 'success',
              title: 'Success',
              text: 'Data removed',
              timer: 1500
            })
          })
        }
      })
    },
    open() {
      this.dialog = true
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.RESET_COLLEGE_STUDENT()
        this.CLEAR_ERRORS()
      })
    },
    save() {
      if (this.editedIndex > -1) {
        // update
        this.putCollegeStudent().then(() => {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data updated successfully',
            timer: 1500
          })
          this.close()
        })
      } else {
        // add
        this.postCollegeStudent().then(() => {
          this.fetchCollegeStudents()
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data stored successfully',
            timer: 1500
          })
          this.close()
        })
      }
    }
  },
  watch: {
    'query.page'() {
      this.fetchCollegeStudents()
    },
    'query.perPage'() {
      this.fetchCollegeStudents()
    },
    'query.search': _.debounce(function () {
      this.fetchCollegeStudents()
    }, 300),
    'query.sortBy'() {
      this.fetchCollegeStudents()
    },
    'query.sortDesc'() {
      this.SET_COLLEGE_STUDENTS([])
      this.fetchCollegeStudents()
    }
  },
  created() {
    this.fetchCollegeStudents()
  }
}
</script>

<style scoped>

</style>