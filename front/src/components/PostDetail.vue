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
            <div v-if="authorized == true">
                <button v-on:click="recommendPost()"> 추천 </button>
                <button v-on:click="updatePost()"> 수정 </button>
                <button v-on:click="deletePost()"> 삭제 </button>
            </div>
        </div>

        <div class="desc">
        <hr>
        <h5>댓글</h5>
            <textarea v-model="newComment" class="newCommentBox"></textarea>
            <button v-on:click="createComment()" class="createComment"> 댓글 작성 </button>
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
                        <button v-on:click="updateTF()"> 수정 </button>
                        <button v-on:click="deleteComment(comment)"> 삭제 </button>
                    </div>
                    <div v-else>
                        <button v-on:click="updateComment(comment)"> 수정 완료 </button>
                        <button v-on:click="updateTF()"> 수정 취소 </button>
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

                this.$http.get(`/api/login/session`)
                .then((response) => {
                    this.user = response.data;
                    
                    if(this.user.id == this.post.user) {
                        this.authorized = true;
                    } else {
                        this.authorized = false;
                    }
                })
            });

            this.$http.get(`/api/post/${id}/comment`)
            .then((response) => {
                this.comments = response.data;
            });
        },
        data: function() {
            return {
                user:{},
                post:{},
                newComment:'',
                comments:[],
                id:0,
                authorized:false,
                updateCommentTF:false
            }
        },
        methods: {
            updatePost: function() {
                var id = this.$route.params.id;
                this.$router.push({ name: 'postformupdate', params: { id: id }})
            },
            deletePost: function() {
                this.$http.get(`/api/login/session`)
                .then((response) => {
                    this.user = response.data;
                    
                    if (this.user) {
                        if (this.post.user == this.user.id) {
                            var id = this.$route.params.id;
                            this.$http.delete(`/api/post/${id}`)
                            .then((response) => {
                                this.$router.push({ name: 'post'})
                            });
                        } else {
                            alert('본인이 작성한 글만 삭제 하실수 있습니다.')
                        }
                    } else {
                        alert('사용자 로그인이 필요합니다.');
                    }
                    
                    

                })
            },
            recommendPost: function() {
                var pid = this.$route.params.id;
                console.log('recommendPost call!');
                this.$http.get(`/api/post/${pid}/recommend`)
                .then((response) => {
                    location.reload();
                });
            },
            createComment: function() {
                this.$http.get(`/api/login/session`)
                .then((response) => {
                    this.user = response.data;
                    if (this.user) {
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
                    } else {
                        alert('사용자 로그인이 필요합니다.');
                    }
                })
            },
            updateTF: function() {
                if (this.updateCommentTF === true){
                    this.updateCommentTF = false;
                } else {
                    this.updateCommentTF = true;
                }
            },
            deleteComment: function(comment) {
                var cid = comment.id
                var pid = this.$route.params.id;

                if (this.user) {
                    if (comment.user == this.user.id) {
                        this.$http.delete(`/api/post/${pid}/comment/${cid}`)
                        .then((response) => {
                            this.$http.get(`/api/post/${pid}/comment`)
                            .then((response) => {
                                this.comments = response.data;
                            });
                        });
                    } else {
                        alert('본인의 댓글만 삭제 가능합니다.');
                    }
                } else {
                    alert('사용자 로그인이 필요합니다.');
                }
            },
            updateComment: function() {
                var pid = this.$route.params.id;

                var re = 0;
                var user = this.user;

                this.$http.put(`/api/post/${pid}/comment/${cid}`, {root: id, re: re, user: user, comment:this.newComment})
                .then((response) => {
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
    .bottom div{
        float:bottom;
    }
    .displayName{
        float:right;
        margin-right:20px;
    }
    .comments div{
        display:inline;
    }
    .createComment{
        width: 80px;
        height: 70px;
        background: #868686;
        color: white;
        font-size: 15px;
        font-weight: bold;
        border-radius: 5px;
        vertical-align: top;
    }
    .newCommentBox{
        text-rendering: auto;
        color: initial;
        width:80%;
        height: 70px;
        letter-spacing: normal;
        word-spacing: normal;
        text-transform: none;
        text-indent: 0px;
        text-shadow: none;
        display: inline-block;
        text-align: start;
        margin: 0em;
        font: 400 11px system-ui;
    }
</style>
