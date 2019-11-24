<template>
  <v-container>
        <v-layout text-center wrap> 

        	 
             <v-row dense>
             	<v-col                
                cols="12"
                md="12"
                lg="12"
              >
             	<v-banner v-if="!Object.keys($store.state.lastSeenTorrents).length" style="margin: 10px 0 10px; border-radius: 4px;">
          		<h2 style="display: inline-block;">Здесь ничего нет, но, возможно, скоро появятся</h2>
          
        		</v-banner> 
        	</v-col>                      
              <v-col
                v-for="(torrent, hash) in lastSeen"
                :key="hash"
                cols="12"
                md="4"
                lg="4"
              >
              	<div style="position: relative;">
	              <Torrent :torrent="torrent" />
	               <v-btn
                dark
                small
                fab
                @click="deleteTorrent(torrent.hash)"
                style="bottom: -20px; position: absolute;right: 25px;"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
	          	</div>

            </v-col>
          </v-row>
          
        </v-layout>
    </v-container>
</template>

<script>
import Torrent from '~/components/Torrent.vue'

export default {
  components: {
    Torrent,
  },
  computed: {
  	lastSeen() {
  		let keys = Object.keys(this.$store.state.lastSeenTorrents)
  		let lastSeen = this.$store.state.lastSeenTorrents
  		keys.sort((a,b) => {
            if ( lastSeen[a].lastSeen > lastSeen[b].lastSeen ){
                return -1;
            }
            if (lastSeen[a].lastSeen < lastSeen[b].lastSeen ){
                return 1;
            }
            return 0;
        })

        let res = []
        keys.forEach((key) => {
        	res.push(lastSeen[key])
        })

        return res
  	}
  },
  methods: {
  	deleteTorrent(hash) {
  		this.$store.commit('deleteLastSeenTorrent', hash)
  		console.log('del', hash)
  	}
  },
  mounted() {
  	 if (!this.$store.state.isGenreScoresLoaded) {
        this.$store.commit('loadGenreScores')
    }
    console.log(this.$store.state.lastSeenTorrents)
  }
}
</script>
