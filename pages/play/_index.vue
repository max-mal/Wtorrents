<template>
	<div height="100%">
    <v-alert type="error" v-if="error">
      {{ error }}
    </v-alert>
    <video :src="'http://localhost:8083/' + $route.params.index" autoplay controls @error="failed" style="height: calc(100vh - 190px);
    width: 100%;" />
</div>
</template>

<script>

export default {
  data: function (){
    return {
      error: null,
    }
  },
  components: {    
  },
  methods: {
    failed(e) {
        // video playback failed - show a message saying why
        switch (e.target.error.code) {
            case e.target.error.MEDIA_ERR_ABORTED:
                this.error = ('You aborted the video playback.');
                break;
            case e.target.error.MEDIA_ERR_NETWORK:
                this.error = ('A network error caused the video download to fail part-way.');
                break;
            case e.target.error.MEDIA_ERR_DECODE:
                this.error = ('The video playback was aborted due to a corruption problem or because the video used features your browser did not support.');
                break;
            case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                this.error = ('The video could not be loaded, either because the server or network failed or because the format is not supported.');
                break;
            default:
                this.error = ('An unknown error occurred.');
                break;
        }
    }
  },
  mounted() {

  }
}
</script>
