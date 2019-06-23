<template>
    <div align="center" >
        <h1> Notice Board </h1>
        <table class = "posts">
            <thead>
                <tr>
                    <th v-for="(value,key) in column" > {{ value }} </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="post in posts" v-on:click="clickPost(post)">
                    <td v-for="key in column" > {{ post[key] }} </td>
                </tr>
            </tbody>
        </table>
        <hr>
        <router-link to="/examples/postform" tag="button">글쓰기</router-link>
        <router-link to="/examples" tag="button">Go to Examples</router-link>
    </div>
</template>

<script>
export default {
    created: function() {
        this.$http.get('/api/post')
        .then((response) => {
            var posts = response.data;
            var temp = "";

            for(var index in posts){
                console.log(posts[index]);
                var today = new Date();
                var created = new Date(posts[index].created);
                // console.log("today: ", today);
                // console.log("created: ", created);
                if (created.getDate() == today.getDate() &&
                    created.getMonth() == today.getMonth() &&
                    created.getYear() == today.getYear()) {
                    posts[index].created = created.getHours()+":"+created.getMinutes() +":"+ created.getSeconds();
                } else {
                    posts[index].created = created.getFullYear()+"-"+created.getMonth() +"-"+ created.getDate();
                }
            }

            this.posts = posts;

            console.log(this.posts);
        });
    },
    data: function() {
        return {
            session:{},
            posts:[],
            column:["id", "title", "displayName", "hit", "created"]
        }
    },
    methods:{
        clickPost(post) {
            var id = post.id;
            this.$router.push({ name: 'postdetail', params: { id: id }})
        }
    }
}
</script>

<style>
    table.posts {
        border-collapse: separate;
        border-spacing: 1px;
        text-align: center;
        line-height: 1.5;
        margin: 20px 10px;
    }
    table.posts th {
        width: 155px;
        padding: 10px;
        font-weight: bold;
        vertical-align: center;
        color: #fff;
        background: #ce4869 ;
    }
    table.posts td {
        width: 155px;
        padding: 10px;
        vertical-align: center;
        border-bottom: 1px solid #ccc;
        background: #eee;
    }
</style>