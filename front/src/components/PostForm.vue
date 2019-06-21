<template>
    <div>
    <h1 v-if="updateTF == false"> 글작성 </h1>
    <h1 v-if="updateTF == true"> 글수정 </h1>
        <div class="title">
            제목: <input v-model="message.title" placeholder="제목을 입력하세요." >
        </div>

        <div class="desc">
            내용: <textarea v-model="message.description" placeholder="입력하세요." ></textarea>
        </div>
    <button v-on:click="createPost()" v-if="updateTF == false"> 글쓰기 </button>
    <button v-on:click="updatePost()" v-if="updateTF == true"> 글수정 </button>
    
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

        var pid = this.$route.params.id;
        if(pid){
            this.updateTF = true;
            this.$http.get(`/api/post/${pid}`)
            .then((response) => {
                this.message = response.data[0];
                console.log(this.message);
            });
        }
    },
    data: function() {
        return {
            user: {},
            message: {},
            updateTF: false
        }
    },
    methods: {
        createPost: function(){
            this.$http.post(`/api/post`, {user: this.user.id, title : this.message.title, description : this.message.description})
            .then((response) => {
                this.$router.push({ name: 'post'})
            })
        },
        updatePost: function() {
            var pid = this.$route.params.id;
            this.$http.put(`/api/post/${pid}`, {title : this.message.title, description : this.message.description})
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