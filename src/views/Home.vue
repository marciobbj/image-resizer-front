<template>
  <div class="home">
    <Uploader />
  </div>
</template>

<script>
// @ is an alias to /src
import Uploader from "@/components/Uploader.vue";

export default {
  name: "home",
  components: {
    Uploader
  }
};
</script>
