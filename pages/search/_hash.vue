<template>
  <div>
    <p v-if="torrent"> {{ torrent.name }}</p>
    <p>{{$route.params.hash}}</p>

    <v-alert type="error" v-if="error">
      {{ error }}
    </v-alert>

    <v-card v-if="!files || !files.length || $store.state.currentTorrent != $route.params.hash" class="mx-auto" max-width="700" outlined :loading="true">
    	<v-card-subtitle class="pb-0">Загрузка...</v-card-subtitle>
    </v-card>

    <div class="list" v-if="$store.state.currentTorrent == $route.params.hash && files">
      <div v-for="(file, index) in files">
        <v-card class="mx-auto" max-width="700" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              
              <v-list-item-subtitle v-if="isPlayable(file.name)">
              <!--   <nuxt-link :to="'/play/' + index">{{ file.name }}</nuxt-link> {{ file.length / 1000000 }} Mb -->
              <v-btn @click="play(index)">{{ file.name }}</v-btn> {{ file.length / 1000000 }} Mb
              </v-list-item-subtitle>

              <v-list-item-subtitle v-if="!isPlayable(file.name)">
                <v-btn @click="openVlc(index)">{{ file.name }}</v-btn> {{ file.length / 1000000 }} Mb
              </v-list-item-subtitle>

            </v-list-item-content>
          </v-list-item>
        </v-card>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: function () {
  	return  {error: null,}
  },
  components: {},
  computed: {
    torrent() {
      return this.$store.state.currentTorrentObj
    },
    files() {
    	return this.$store.state.torrentFiles[this.$route.params.hash]
    }
  },
  methods: {
    getTorrentData() {
      let hash = this.$route.params.hash
      let that = this
      if (this.$store.state.currentTorrent != hash) {
        window.serverSocket.emit('startServer', { hash }, function(files) {
          console.log(files)
          that.$store.commit('torrentFilesArrived', { hash, files })
          that.$store.commit('selectTorrent', hash)
        })
        
      }
    },
    play (index) {
		this.$store.commit('addLastSeenTorrent', that.torrent)
		this.$router.push('/play/' + index)

    },
    isPlayable(file) {
    	return ['ogg', 'mp4', 'webm'].includes(file.split('.').pop())
    },
    openVlc(i) {
    	let files = this.files
    	let that = this
    	that.$store.commit('addLastSeenTorrent', that.torrent)
    	window.serverSocket.emit('startVlc', files.filter((el, index) => index >= i), function(res) {

    		if (!res.ok) {
    			that.error = res.err
    		} else {
    			that.error = null    			
    		}
    	})
    }
  },
  mounted() {
    this.getTorrentData()
  }
}

</script>
