<template>
    <div class="examples">
        <div>
            <h1>
                {{post.title}}
            </h1>
        </div>

        <div class="option">
            <div class="user">
                {{post.displayName}}
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

        <div class="desc">
        <hr>
        <h5>댓글</h5>
            <textarea v-model="newComment" placeholder="댓글을 입력하세요." ></textarea>
            <button v-on:click="createComment()"> 댓글 작성 </button>
            <hr>
            
            <div v-for="comment in comments" class="comments" v-bind:id="comment.id+'test'">

                <div>
                    <div v-if="updateCommentTF === false">
                        {{comment.comment}}

                        <div class="created">
                            작성일자: {{comment.created}}
                        </div>
                        <div class="displayName">
                            작성자: {{comment.displayName}}
                        </div>
                    </div>

                    <div v-else>
                        <input v-model="comment.comment"></input>
                    </div>

                    <div v-if="updateCommentTF === false">
                        <button v-on:click="updateTF(comment.id)"> 수정 </button>
                        <button v-on:click="deleteComment(comment.id)"> 삭제 </button>
                    </div>
                    <div v-else>
                        <button v-on:click="updateComment(comment.id)"> 수정 완료 </button>
                        <button v-on:click="updateTF(comment.id)"> 수정 취소 </button>
                    </div>
                    <hr>
                </div>
            </div>
            
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
            });

            this.$http.get(`/api/post/${id}/comment`)
            .then((response) => {
                this.comments = response.data;
            });

            this.$http.get(`/api/login/session`)
            .then((response) => {
                if(!response.data) {
                    // alert('login필요합니다.');
                    // this.$router.push({ name: 'login'})
                } else {
                    this.user = response.data;
                }
            })
        },
        data: function() {
            return {
                user:{},
                post:{},
                newComment:'',
                comments:[],
                id:0,
                updateCommentTF:false
            }
        },
        methods: {
            updatePost: function() {
                var id = this.$route.params.id;
                this.$router.push({ name: 'postformupdate', params: { id: id }})
            },
            deletePost: function() {
                var id = this.$route.params.id;
                this.$http.delete(`/api/post/${id}`)
                .then((response) => {
                    this.$router.push({ name: 'post'})
                });
            },
            createComment: function() {
                var pid = this.$route.params.id;
                var re = 0;
                var user = this.user;
                this.$http.post(`/api/post/${pid}/comment`, {root: pid, re: re, user: user, comment:this.newComment})
                .then((response) => {
                    this.$http.get(`/api/post/${pid}/comment`)
                    .then((response) => {
                        this.comments = response.data;
                    });
                });
            },
            updateTF: function() {
                if (this.updateCommentTF === true){
                    this.updateCommentTF = false;
                } else {
                    this.updateCommentTF = true;
                }
            },
            deleteComment: function(cid) {
                var pid = this.$route.params.id;
                this.$http.delete(`/api/post/${pid}/comment/${cid}`)
                .then((response) => {
                    this.$http.get(`/api/post/${pid}/comment`)
                    .then((response) => {
                        this.comments = response.data;
                    });
                });
            },
            updateComment: function() {
                var pid = this.$route.params.id;

                var re = 0;
                var user = this.user;

                this.$http.put(`/api/post/${pid}/comment/${cid}`, {root: id, re: re, user: user, comment:this.newComment})
                .then((response) => {
                    // this.$router.push({ name: 'post'})
                });
            },
            cancleupdate: function() {

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
        height:300px;
    }
    .bottom{
        float:bottom;
    }
    .displayName{
        float:right;
        margin-right:20px;
    }
    .comments div{
        display:inline;
    }
</style>
