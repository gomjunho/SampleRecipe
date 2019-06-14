<!-- App.vue -->



<!-- HTML Template -->
<template>
  <div id="app">


    <div class="container">
<!--
      <v-container fluid>
        <v-layout row wrap align-center justify-center>
          <v-flex xs6 class="text-xs-center text-sm-center text-md-center text-lg-center">

            <img :src="imageUrl" height="150" v-if="imageUrl"/>
            <v-text-field label="이미지를 선택해주세요." color="#5c8d89" @click='pickFile' v-model='imageName' prepend-icon='attach_file'></v-text-field>
            <input type="file" style="display: none" ref="image" id="uploadImg" accept="image/*" @change="onFilePicked">

          </v-flex>
        </v-layout>       
      </v-container>

      -->

      <!--UPLOAD-->
      
      <form enctype="multipart/form-data" novalidate >
        <h1>Upload images</h1>
        <div class="dropbox">
          <input type="file" style="display: none" ref="image" id="uploadImg" accept="image/*" @change="onFilePicked">
          <input type="file" multiple :name="uploadFieldName" :disabled="isSaving" @change="onFilePicked($event.target.name, $event.target.files); fileCount = $event.target.files.length" accept="image/*" class="input-file">
        </div>
      </form>

      <!--SUCCESS-->
      <!-- 
<div v-if="isSuccess">
  <h2>Uploaded {{ uploadedFiles.length }} file(s) successfully.</h2>
  <p>
    <a href="javascript:void(0)" @click="reset()">Upload again</a>
  </p>
  <ul class="list-unstyled">
    <li v-for="item in uploadedFiles">
      <img :src="item.url" class="img-responsive img-thumbnail" :alt="item.originalName">
    </li>
  </ul>
</div>
-->

<!--FAILED-->
<!-- 
<div v-if="isFailed">
  <h2>Uploaded failed.</h2>
  <p>
    <a href="javascript:void(0)" @click="reset()">Try again</a>
  </p>
  <pre>{{ uploadError }}</pre>
</div>
-->
</div>
</div>
</template>


<!-- Javascript -->
<script>
  import * as axios from 'axios';

  const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

  export default {
    name: 'app',
    data() {
      return {
        uploadedFiles: [],
        uploadError: null,
        currentStatus: null,
        uploadFieldName: 'photos'
      }
    },
    computed: {
      isInitial() {
        return this.currentStatus === STATUS_INITIAL;
      },
      isSaving() {
        return this.currentStatus === STATUS_SAVING;
      },
      isSuccess() {
        return this.currentStatus === STATUS_SUCCESS;
      },
      isFailed() {
        return this.currentStatus === STATUS_FAILED;
      }
    },
    methods: {
      pickFile () {
            this.$refs.image.click ()
      },		
      onFilePicked (e) {
        const files = e.target.files
        if(files[0] !== undefined) {
          this.imageName = files[0].name
          console.log(this.imageName.length);
          if(this.imageName.lastIndexOf('.') <= 0) {
            return
          }

          if(this.imageName.length >19){
            this.filefeedback='파일의 이름은 14자 이하만 가능합니다.'
          }

          const fr = new FileReader ()
          fr.readAsDataURL(files[0])
          fr.addEventListener('load', () => {
            this.imageUrl = fr.result
            //this.imageFile = files[0] // this is an image file that can be sent to server...
      
          })

        } else {
          this.filefeedback=null;
          this.imageName = ''
          this.imageFile = ''
          this.imageUrl = ''
        }
      },
      reset() {
        // reset form to initial state
        this.currentStatus = STATUS_INITIAL;
        this.uploadedFiles = [];
        this.uploadError = null;
      },
      save(formData) {
        // upload data to the server
        this.currentStatus = STATUS_SAVING;

        this.upload(formData)
          .then(x => {
            this.uploadedFiles = [].concat(x);
            this.currentStatus = STATUS_SUCCESS;
          })
          .catch(err => {
            this.uploadError = err.response;
            this.currentStatus = STATUS_FAILED;
          });
      },
      filesChange(fieldName, fileList) {
        // handle file changes
        const formData = new FormData();

        if (!fileList.length) return;

        // append the files to FormData
        Array
          .from(Array(fileList.length).keys())
          .map(x => {
            formData.append(fieldName, fileList[x], fileList[x].name);
          });

        // save it
        this.save(formData);
      },
      upload(formData) {
          const url = `/api/images`;
          return axios.post(url, formData)
              // get data
              .then(x => x.data)
              // add url field
              .then(x => x.map(img => Object.assign({},
                  img, { url: url })));
      }
    },
    mounted() {
      this.reset();
    },
  }

</script>


<!-- SASS styling -->
<style>
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>
