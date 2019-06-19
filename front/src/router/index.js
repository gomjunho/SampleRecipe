import Vue from 'vue'
import Router from 'vue-router'
import Main from '../components/MainPage'
import Users from '../components/UsersPage'
import UserDetail from '../components/UserDetailPage'
import Home from '../components/HelloWorld'
import Examples from '../components/Examples'
import Test from '../components/TestPage'
import RESTApiTest from '../components/RESTApiTest'
import LoginTest from '../components/LoginTest'
import ImageUploadTest from '../components/ImageUploadTest'

import Post from '../components/Post'
import PostDetail from '../components/PostDetail'

// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/test',
      name: 'test',
      component: Test
    },
    {
      path: '/examples',
      name: 'examples',
      component: Examples
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/users/:id',
      name: 'userdetail',
      component: UserDetail
    },{
      path: '/examples/rest',
      name: 'rest',
      component: RESTApiTest
    },{
      path: '/examples/login',
      name: 'login',
      component: LoginTest
    },{
      path: '/examples/images',
      name: 'images',
      component: ImageUploadTest
    },{
      path: '/examples/post',
      name: 'post',
      component: Post
    },{
      path: '/examples/post/:id',
      name: 'postdetail',
      component: PostDetail
    }
  ]
})
