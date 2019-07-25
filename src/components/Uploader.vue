<template>
  <div class="container">
    <image-uploader
      :preview="true"
      :className="['fileinput', { 'fileinput--loaded': hasImage }]"
      capture="environment"
      :debug="0"
      :autoRotate="true"
      outputFormat="verbose"
      @input="setImage"
    ></image-uploader>
  </div>
</template>

<script>
import ImageResize from "vue-image-upload-resize";
export default {
  name: "Uploader",
  data: () => {
    return {
      hasImage: false
    };
  },
  methods: {
    setImage(output) {
      this.hasImage = true;
      console.log(output);
    },
    startImageResize(event) {
      console.log(event);
    },
  },
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
