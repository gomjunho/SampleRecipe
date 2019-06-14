<template>
  <div>
    <h1> Image API call </h1>
    <button v-on:click="getapi()"> GET </button>
    <button v-on:click="postapi()"> POST </button>
    <button v-on:click="putapi()"> PUT </button>
    <button v-on:click="deleteapi()"> DELETE </button>
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
      var id = 1
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
        editButton: "Edit",
        testobj:{
          title: "hello",
          body: "test",
          userId: 2
        }
      }
    },
    methods: {
      getapi: function () {
        this.$http.get(`/api/images/${id}`
      )
        .then((response) => {
//          console.log("response: "+response);
          this.user = response.data[0];
        })
//          console.log('get test');
      },
      putapi: function () {
        var id = user.id;
        this.$http.put(`/api/images/${id}`, {user: user})
        .then((response) => {
          this.apires = response;
//          console.log("response: "+response);
        })
//          console.log('put test');
      },
      postapi: function(user) {
        var id = 1;
        this.$http.post(`/api/images/${id}`, {user: user})
        .then((response) => {
          this.apires = response;
//          console.log("response: "+response);
        })
//          console.log('post test');
      },
      deleteapi: function(id) {
        this.$http.delete(`/api/images/${id}`
      )
        .then((response) => {
//          console.log('response: ' + response);
          this.apires = response;
        })
//          console.log('delete test');
      }
    }
  }
</script>
