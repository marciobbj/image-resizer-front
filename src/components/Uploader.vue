<template>
  <div class="container">
    <div v-if="hasImage && !loading">
      <img id="image" :src="imagePath" :width="width" :height="height" alt="your image" />
    </div>
    <form action="#" style="height: 97vh;">
      <div class="form__container" v-show="!loading">
        <input
          type="file"
          id="fileInput"
          ref="fileInput"
          @input="putImage($event)"
          style="display: none;"
        />
        <button v-show="!isJobComplete" class="form__upload_button" @click="getFile()">Upload Image</button>
        <input
          type="text"
          class="form__fileName_input"
          v-show="!isJobComplete"
          v-model="fileName"
          placeholder="Please insert the image name here"
        />
        <label v-show="!isJobComplete" for="width">Width: {{ width }}px</label>
        <input
          v-show="!isJobComplete"
          type="range"
          :disabled="!hasImage"
          name="width"
          v-model="width"
          min="10"
          :max="367"
        />
        <label v-show="!isJobComplete" for="height">Height: {{ height }}px</label>
        <input
          type="range"
          :disabled="!hasImage"
          v-show="!isJobComplete"
          name="height"
          v-model="height"
          min="10"
          :max="367"
        />
        <h4 v-show="isJobComplete">Job Done!!!!</h4>
        <a
          class="form__download_button"
          v-show="isJobComplete"
          :href="resizedImageUrl"
          @click="refreshPage()"
          target="_blank"
        >Download Image</a>
        <h4
          v-show="fileName === null && hasImage && !isJobComplete"
        >You can submit after naming the file</h4>
        <button
          class="form__submit_button"
          v-show="!isJobComplete && hasImage && fileName !== null"
          @click="resizeJob($event)"
        >Resize Image</button>
      </div>
      <div class="form__loading" v-show="loading">
        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="24px"
          height="30px"
          viewBox="0 0 24 30"
          style="enable-background:new 0 0 50 50;"
          xml:space="preserve"
        >
          <rect x="0" y="0" width="4" height="10" fill="rgb(95, 247, 103)">
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="translate"
              values="0 0; 0 20; 0 0"
              begin="0"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="10" y="0" width="4" height="10" fill="rgb(95, 247, 103)">
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="translate"
              values="0 0; 0 20; 0 0"
              begin="0.2s"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="20" y="0" width="4" height="10" fill="rgb(95, 247, 103)">
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="translate"
              values="0 0; 0 20; 0 0"
              begin="0.4s"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div>
    </form>
  </div>
</template>

<script>
import ImageResize from "vue-image-upload-resize";
import { setTimeout, setInterval, clearInterval } from "timers";
import axios from "axios";

let interval; // usado para parar as chamadas na api quando o job for inicializado

export default {
  name: "Uploader",
  data: () => {
    return {
      hasImage: false,
      width: 10,
      height: 10,
      imagePath: null,
      fileName: null,
      loading: false,
      isJobComplete: false,
      resizedImageUrl: null
    };
  },
  methods: {
    setImage(src, target) {
      this.hasImage = true;
      const fileReader = new FileReader();
      fileReader.onload = e => {
        this.imagePath = fileReader.result; // carregar o preview da imagem sem guarda-la no db
      };
      fileReader.readAsDataURL(src.files[0]); // pegar a url desse arquivo
    },
    putImage(e) {
      e.preventDefault();
      let src = document.getElementById("fileInput");
      let target = document.getElementById("image");
      this.setImage(src, target);
    },
    getFile() {
      let fileInput = document.querySelector("#fileInput");
      fileInput.click(); // quando o user clicar no botão "upload" esse codigo irá ativar a janela para upload do arquivo
    },
    async checkJob(job) {
      let response = await axios.get(`http://localhost:8000/images/${job.id}/`);
      if (response.data.job_done === true) {
        this.loading = false;
        this.isJobComplete = true;
        this.resizedImageUrl = response.data.resized_image;
        clearInterval(interval); // freeza as chamadas na api
      } else {
        this.isJobComplete = false;
      }
    },
    async resizeJob(e) {
      e.preventDefault();
      this.loading = true;
      /**
       * Aqui estou montando o payload manualmente
       * mas com certeza existe algum método magico
       * na ES6 que faz esse trampo in no time, but...
       */
      let formData = new FormData();
      formData.append("name", this.fileName);
      formData.append("file", this.$refs.fileInput.files[0]);
      formData.append("width", this.width);
      formData.append("height", this.height);

      const headers = { "Content-Type": "multipart/form-data" };
      let response = await axios.post(
        "http://localhost:8000/images/",
        formData,
        { headers }
      );
      if (response.status !== 201) {
        console.error(response.data);
        return;
      }
      let job = response.data;
      interval = setInterval(() => this.checkJob(job), 2000); // a cada 2 segundos verificar o status do job
    },
    refreshPage() {
      location.reload();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
  animation: fadein 2s;
  display: flex;
  flex-direction: column;
}
.form__container {
  display: flex;
  flex-direction: column;
  align-self: flex-end;
  animation: fadein 2s;
}
.form__fileName_input {
  text-align: center;
  margin: 1rem;
  padding: 0.8rem;
  font-size: 1.2rem;
  border: 0;
}
.form__upload_button {
  margin: 1rem;
  background: rgb(233, 233, 233);
  border: 0;
  padding: 0.8rem;
  border-radius: 3%;
  cursor: pointer;
}
.form__download_button {
  background: #f0e666;
  margin: 2rem auto;
  border: 0;
  width: 250px;
  padding: 0.8rem;
  border-radius: 3%;
  cursor: pointer;
}
.form__loading {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadein 2s;
}
.form__submit_button {
  margin: 2rem auto;
  background: rgb(95, 247, 103);
  border: 0;
  width: 250px;
  padding: 0.8rem;
  border-radius: 3%;
  cursor: pointer;
}
@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
