<template>
    <div>
    <h1> 글작성 </h1>
        <div class="title">
            제목: <input v-model="message.title" placeholder="제목을 입력하세요." >
        </div>

        <div class="desc">
            내용: <textarea v-model="message.desc" placeholder="입력하세요." ></textarea>
        </div>
    <button v-on:click="createPost()"> 글쓰기 </button>
    <router-link to="/examples/post" tag="button">글목록</router-link>
    </div>
</template>

<script>
export default {
    created: function() {
    this.$http.get(`/api/login/session`)
        .then((response) => {
            this.user = response.data;
            if(!this.user) {
                alert('login필요합니다.');
                this.$router.push({ name: 'login'})
            }
        })
    },
    data: function() {
        return {
            user: {},
            message:{}
        }
    },
    methods: {
        createPost: function(){
            this.$http.post(`/api/post`, {user: this.user.id, title : this.message.title, description : this.message.desc})
            .then((response) => {
                this.$router.push({ name: 'post'})
            })
        }
    }
}
</script>

<style>
.title{
    
}
.desc{

}
</style>