<template>
<div>
  <div style="display:inline; float:left">
<v-navigation-drawer
    stateless
    value="true"
  >
    <v-list>
      <v-list-tile @click="goHome()">
        <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>Home</v-list-tile-title>
      </v-list-tile>

      <v-list-group
        prepend-icon="account_circle"
      >

        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>Algorithm</v-list-tile-title>
          </v-list-tile>
        </template>

        <v-list-group v-for="algorithm in algorithms"
          no-action
          sub-group
        >
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title>{{algorithm.title.name}}</v-list-tile-title>
              <v-icon v-text="algorithm.title.icon"></v-icon>
            </v-list-tile>
          </template>

          <v-list-tile
            v-for="question in algorithm.questions"
              
              @click="temp(question.name)"
          >
            <v-list-tile-title v-text="question.name"></v-list-tile-title>
            <v-list-tile-action>
              <v-icon v-text="question.icon"></v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
      </v-list-group>
      
    </v-list>
  </v-navigation-drawer>

  </div>
  <div style="display:inline;">
    {{selected}}<br><br>
    
    {{answer.id}}
    {{answer.question_id}}
    {{answer.concept}}
    {{answer.answer}}
    {{answer.reference}}
  </div>
  <div>
    {{data1}}<br><br>
    {{data2}}<br><br>
    {{data3}}
  </div>
  </div>
</template>


<script>
export default {
    created: function() {
    },
    data: function() {
        return {
          // DB에서 algorithms Table 과 Questions Table을 조회해서 아래 구조의 데이터를 만드는 로직 필요하다.
          algorithms: [
            {title:{id:1, name:'Maze', icon:'map'}, questions:[{id: 1, name: 'Maze Question1', icon: 'map'}, {id: 2, name: 'Maz2 Question2', icon: 'map'}]},
            {title:{id:2, name:'Graph', icon:'settings'}, questions:[{id: 3, name: 'Graph Question1', icon: 'people_outline'}, {id: 4, name: 'Graph Question2', icon: 'people_outline'}]}
          ],
          // 
          data1: `1. 컨텐츠 집중 프로젝트 깔끔한 UI로 컨텐츠 전달에 집중
                큰 카테고리는 왼쪽 탭으로 (다이나믹, 그리디, )
                문제은 두번째 탭
                정답은 바디(가능하면 UI로 표현)(code markdown 적용되는지 확인)`,
          data2: `소요시간 측정
                풀이과정 UI로`,
          data3:`category (id, name)
                question (id, category_id, question title, question desc, reference(질문 참조 사이트))
                answer (id, question_id, concept(어떤식으로 풀려는건지), answer(풀이 코드), reference(답변 참조 사이트 or 책))`,
          selected:'',
          answer: {
            id:1,
            created:'',
            updated:'',
            question_id:1,
            concept:'DFS, BFS',
            answer:'code',
            reference:'www.algorithm.com'
          }
        }
    },
    methods:{
      temp: function(input) {
        this.selected = input;
        // alert(input);
      },
      goHome: function() {
        this.$router.push({name:'main'})
      }
    }
}
</script>

<style>
</style>