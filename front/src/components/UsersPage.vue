<template>
  <div class="users">
    <h1>User List for Test</h1>
    <div v-for="user in users" class="user">
      <input type="checkbox" v-bind:id='user.id' v-bind:value='user.username' v-model="selectedid">

      <button v-on:click="userclick(user)"> {{ user.username }} </button>

        <!--
        <router-link :to="{ name: 'userdetail', params: { id: user.id }}">
          <strong> {{ user.username }} </strong>
        </router-link>
        -->

    </div>

    <br>

    <div>
      <label for="checkbox">checked user id:  {{ selectedid }}</label>
      <button v-on:click="userdelete">selected user delete</button>
    </div>
    <div>
      <router-link to="/Examples" tag="button">Go to Examples</router-link>
    </div>

    <h1> 상세 내용 call</h1>
      <tr v-for="(value,key) in user">
        <td> {{ key }} </td>
        <td> <input name="value" v-model="user[key]" /> </td>
      </tr>
  </div>

    
    <!--
userclick


      {{user.username}}
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
    -->
  </div>

  </div>
  
</template>


<script>
export default {
  created () {
    this.$http.get('/api/users')
    .then((response) => {
      this.users = response.data
    })
  },
  data () {
    return {
      users: [],
      response: {},
      selectedid: [],
      user: {
        authId: '',
        displayName: '',
        email: '',
        id: '',
        password: '',
        salt: '',
        username: ''
      }
    }
  },
  methods: {
    userclick (user) {
      this.user = user;
      // console.log('user', user);
      // console.log('thisuser', this.user);

    //   this.$http.get(`/api/users/${user.id}`)
    // .then((response) => {
    //   console.log(response.data);
    // })
    },
// [LJH] fake delete function call for test
    userdelete () {
//      var id = this.$route.params.id
//      this.$http.delete(`/api/users/${id}`)
      this.$http.delete(`/api/users/`)
      .then((response) => {
        this.response = response
      })
    }
  }

}
</script>
