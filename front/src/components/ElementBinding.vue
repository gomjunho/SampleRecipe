<template>
  <div id="app">
    <span v-bind:title="message">
      Hover your mouse over me for a dynamically bound title!
    </span>
    <div>
      <router-link :to="{ name: 'home'}" tag='button'>Go to Home..</router-link>
    </div>
  </div>
</template>


<script>
  export default {
    data() {
      return{
        message: '이 페이지는 ' + new Date() + ' 에 로드 되었습니다'
      }
    }
  }
</script>
