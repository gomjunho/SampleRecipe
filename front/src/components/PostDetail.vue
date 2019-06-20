<template>
    <div class="examples">
        <div>
            <h1>
                {{post.title}}
            </h1>
        </div>

        <div class="option">
            <div class="user">
                {{post.user}}
            </div>
            
            <div class="created">
                Created Time: {{post.created}}
            </div>

            <div class ="hit">
                hit: {{post.hit}}
            </div>
            <div class ="recommend">
                recommend: {{post.recommend}}
            </div>
        </div>
        <hr>

        <div class="desc">
            {{post.description}}
        </div>
        
        <div class="bottom">
        <hr>
            <router-link to="/examples/post" tag="button">글목록</router-link>
            <button v-on:click="updatePost()"> 수정 </button>
            <button v-on:click="deletePost()"> 삭제 </button>
        </div>

    </div>
</template>


<script>
    export default {
        created: function() {
            var id = this.$route.params.id;
            this.$http.get(`/api/post/${id}`)
            .then((response) => {
                this.post = response.data[0];
                // this.post.created 
            });
        },
        data: function() {
            return {
                post:{},
                id:0
            }
        },
        methods: {
            updatePost: function() {
                var id = this.$route.params.id;
            },
            deletePost: function() {
                var id = this.$route.params.id;
                this.$http.delete(`/api/post/${id}`)
                .then((response) => {
                    console.log(response.data[0]);
                    this.$router.push({ name: 'post'})
                });
            }
        }
    }

</script>

<style>
    .option div{
        display:inline-block;
    }
    .user {
        font-weight:bold;
        margin-right:20px;
    }
    .created{
        float:right;
        margin-right:20px;
    }
    .hit {
        float:right;
        margin-right:20px;
    }
    .recommend {
        float:right;
        margin-right:20px;
    }
    .examples {
        text-align:left;
    }
    .desc {
        height:500px;
    }
    .bottom{
        float:bottom;
    }
</style>
