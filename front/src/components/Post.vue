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
                    <td v-for="(value,key) in column" > {{ post[value] }} </td>
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
            this.posts = response.data;
            
            for (var key in this.posts[0]) {
                this.column.push(key);
            }
        });
    },
    data: function() {
        return {
            session:{},
            posts:[],
            column:[]
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