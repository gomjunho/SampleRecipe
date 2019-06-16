<template>
  <div>

    <h1 > Login Test Page </h1>

<div v-if = "registerForm === false">
    <div v-if="displayName">
      hello, {{displayName}} 
      <input type = "submit" value="로그아웃" v-on:click="logout">
    </div>

    <div v-else>
      <p>
          ID: <input type = "text" v-model="user.username" name = "username" placeholder="username">
      </p>
      <p>
          PW: <input type = "password" v-model="user.password" name = "password" placeholder="password">
      </p>
      <p>
          <button v-on:click="registerBtn">가입하기</button>
          <input type = "submit" value="로그인" v-on:click="login">
          <input type = "submit" value="페이스북으로 로그인" v-on:click="facebooklogin">
      </p>
    </div>
</div>
    <div v-if = "registerForm === true">
      <h2>User Information</h2>
      <table align="center">
        <tr v-for="(value,key) in user">
          <td> {{ key }}  </td>
          <td> <input name="value" v-model="user[key]"/> </td>
        </tr>
      </table>
      
      <button v-on:click="register">가입하기</button>
    </div>

    <br>
    <hr>
    <router-link to="/examples" tag="button">Go to Examples</router-link>
    <router-link to="/" tag="button">Go to Main</router-link>
  </div>
</template>

<script>
  export default {

    // 페이지 전환: this.$router.push({name:'users'})
    created: function () {
      this.$http.get(`/api/login/session`)
      .then((response) => {
        // console.log(response.data);
        this.displayName = response.data.displayName;
        console.log('session', response.data.displayName);
        
      })
    },
    data: function () {
      return {
        user:{
          authId: "",
          username: "",
          password: "",
          displayName: "",
          email: ""
        },
        registerForm: false,
        displayName:""
      }
    },
    methods: {

      // userclick (user) {
      //   this.user = user;
      // },
      login () {

        this.$http.post(`/api/login`,{username:this.user.username , password:this.user.password })
        .then((response) => {
          console.log("response: ", response);
          location.reload();
        },(err) => {
          console.log('err', err)
          }
        )
  
        /**
        this.$session.start()
        console.log(this.$session.exists());
        console.log(this.$session.getAll());

        if(this.$session.exists()){
          this.$session.getAll()

        } else {
          this.$http.post(`/api/login`,{username:this.user.username , password:this.user.password })
          .then((response) => {
            console.log("response: ", response);
          })
        }
         */
      },
      registerBtn() {
        this.registerForm = true;

      },
      // register(){
      //   this.$http.post('/api/login/register', {user: this.user})
      //   .then((response) => {
      //     // console.log(response);
      //     alert(response.data.msg);
      //     if (response.data.code === 0) {
      //       location.reload();
            
      //     } else if (response.data.code === 1) {
      //       //already exist
      //     }
      //     // this.registerForm = false;
      //     // location.reload();
      //   });
      // },

      register: function() {
        this.$http.post(`/api/users`, {user: this.user})
        .then((response) => {
          // console.log('111111', response);
          this.$http.post(`/api/login`, {username:response.data.username , password:response.data.password })
          .then((response) => {
            // console.log('222222', response);
            location.reload();
          })
          // alert(response);
          

          // if (response.data.code === 0) {
          //   location.reload();
            
          // } else if (response.data.code === 1) {
          //   //already exist
          // }
          // // this.registerForm = false;
          // // location.reload();
        });
      },

      facebooklogin(){
        this.$http.get(`/api/login/facebook`)
        .then((response) => {
          console.log("response: ", response);
          location.reload();
        })
      },
      logout() {
        this.$http.delete(`/api/login`)
        .then((response) => {
          // console.log(response.data);
          console.log('session', response);
          location.reload();

          // this.$router.push({name:'login'})
          
        })
      }
    }
  }
</script>
