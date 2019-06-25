<template>
    <div align="center" >
        <h1> Interview</h1>
        컨텐츠 집중 프로젝트 깔끔한 UI로 컨텐츠 전달에 집중<br><br>
        큰 카테고리는 왼쪽 탭으로 (java, javascript....)<br>
        질문은 두번째 탭<br>
        답변은 바디<br>
        <br>

        category (id, name)<br>
        question (id, category_id, question)<br>
        answer (id, question_id, answer)<br>
        <br>
        <hr>
    </div>
</template>

<script>
export default {
    created: function() {
    },
    data: function() {
        return {
        }
    },
    methods:{
    }
}
</script>

<style>
</style>