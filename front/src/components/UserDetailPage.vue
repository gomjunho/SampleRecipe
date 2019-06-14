<template>
  <div>
    <h1>{{user.username}} 상세 내용 call</h1>
    <div>
      <table align="center">
        <tr v-for="(value,key) in user">
          <td> {{ key }} </td>
          <td> <input name="value" v-model="user[key]" :disabled="disabled"/> </td>
        </tr>
      </table>
    </div>
    <br>
    <button v-on:click="editclick"> {{ editButton }} </button>
    <button v-if="disabled === false" v-on:click="submitclick">submit</button>
    <br>
      user : {{ user }}
    <br>
      api res : {{ apires }}
    <br>
    <router-link to="/users" tag="button">Go to Users</router-link>
    <router-link to="/examples" tag="button">Go to Examples</router-link>
    <router-link to="/" tag="button">Go to Main</router-link>
  </div>
</template>

<script>
  export default {

/*
    data: function () {
      return {
        user : this.$route.params.user
      }
    }
*/
    created: function () {
      var id = this.$route.params.id
      this.$http.get(`/api/users/${id}`)
      .then((response) => {
        this.user = response.data[0]
      })
    },
    data: function () {
      return {
        user: {},
        apires: {},
        value: "",
        disabled: true,
        editButton: "Edit"
      }
    },
    methods: {
      editclick(){
        if (this.editButton == "Edit") {
          this.editButton = "Cancel"
        } else {
          this.editButton = "Edit"
        }
        this.disabled=!this.disabled
      },
      submitclick () {
        var id = this.$route.params.id
        this.$http.put(`/api/users/${id}`, {
          params: {foo:'bar'}
        })
        .then((response) => {
          this.apires = response
        })
      }
    }
  }
</script>
