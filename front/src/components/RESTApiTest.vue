<template>
  <div>
    <h1> REST API call</h1>
    <h2>User List</h2>
    <ol>
      <div v-for="user in users" class="user">
      <!--
        <input type="checkbox" v-bind:id='user.id' v-bind:value='user.username' >
    -->
        <li>
              <v-btn v-on:click="userclick(user)"> {{ user.username }} </v-btn>
        </li>
      </div>
    </ol>
    <div>
      <h2>User Detail</h2>
      <table align="center">
        <tr v-for="(value,key) in user">
          <td> {{ key }}  </td>
          <td> <input name="value" v-model="user[key]" :disabled="!disabled"/> </td>
        </tr>
      </table>
    </div>
    <br>
    <v-btn small v-on:click="getapi(user.id)"> GET </v-btn>
    <v-btn small v-on:click="postapi(user)"> POST </v-btn>
    <v-btn small  v-on:click="putapi(user)"> PUT </v-btn>
    <v-btn small  v-on:click="deleteapi(user.id)"> DELETE </v-btn>
    <br>
    <hr>
    <router-link to="/examples" tag="v-btn">Go to Examples</router-link>
    <router-link to="/" tag="v-btn">Go to Main</router-link>
  </div>
</template>

<script>
  export default {

    // 페이지 전환: this.$router.push({name:'users'})
    created: function () {
      var id = 1
      this.$http.get(`/api/users`)
      .then((response) => {
        // console.log(response.data);
        this.users = response.data;
      })
    },
    data: function () {
      return {
        users: [],
        user: {},
        apires: {},
        value: "",
        disabled: true,
        editButton: "Edit",
        testobj:{
          title: "hello",
          body: "test",
          userId: 2
        }
      }
    },
    methods: {

      userclick (user) {
        this.user = user;
      },
      getapi: function (id) {
        this.$http.get(`/api/users/${id}`
      )
        .then((response) => {
        //  console.log("response: "+response);
          this.user = response.data[0];
        })
        // this.$router.push({name:'users'})
        // console.log('get test');
      },
      putapi: function (user) {
        var id = user.id;
        this.$http.put(`/api/users/${id}`, {user: user})
        .then((response) => {
        // this.$router.push({name:'users'})
          // this.apires = response;
          if(response.data.code === 0) {
            console.log(response.data.msg);

          } else if (response.data.code === 1) {
            console.log(response.data.msg);
            // location.reload();

          }
          // location.reload();
//          console.log("response: "+response);
        })
//          console.log('put test');
      },
      postapi: function(user) {
        this.$http.post(`/api/users`, {user: user})
        .then((response) => {
          location.reload();
        })
      },
      /** temp!!!! **/
      // postapi: function(user) {
      //   var id = user.id;
      //   this.$http.post(`/api/users/${id}`, {user: user})
      //   .then((response) => {
      //     location.reload();
      //   })
      // },
      deleteapi: function(id) {
        this.$http.delete(`/api/users/${id}`
      )
        .then((response) => {
        // this.$router.push({name:'users'})
//          console.log('response: ' + response);
          // this.apires = response;
          location.reload();
        })
//          console.log('delete test');
      }
    }
  }
</script>
