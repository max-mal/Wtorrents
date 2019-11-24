<template>
    <v-card class="mx-auto" max-width="400" height="100%"
        
        >
        <v-progress-linear
          indeterminate
          color="yellow darken-2"
          v-if="$store.state.torrentFiles[torrent.hash] === false"
        ></v-progress-linear>
        <v-img v-if="torrent.info && torrent.info.poster" :src="torrent.info.poster" height="200px"></v-img>
        <v-card-title>
            {{ torrent.name }}
        </v-card-title>
        <v-card-subtitle>
            {{size}} <br/>
            {{torrent.seeders}} / {{ torrent.leechers }} at {{ lastUpdated }} <br/>
            {{torrent.files}} files
        </v-card-subtitle>
        <v-card-subtitle>
            {{ lastSeen }}
        </v-card-subtitle>
        <v-card-actions>
                <!-- <nuxt-link :to="'/search/' + torrent.hash">View</nuxt-link>    -->
                <v-btn @click="watch(torrent.hash)">Смотреть</v-btn>
            <v-spacer></v-spacer>            
        </v-card-actions>        
    </v-card>
</template>
<script>
export default {
    name: "Torrent",

    props: ['torrent'],

    data: () => ({
        show: false,
    }),
    methods: {
        watch(hash) {
            this.$store.commit('setCurrentTorrent', this.torrent)
            this.$router.push('/search/' + hash)
        }
    },
    computed: {
        size() {
            return (this.torrent.size / 1000000) + ' Mb'
        },
        lastUpdated() {
            let date = new Date(this.torrent.trackersChecked * 1000)
            return date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear()
        },
        playable() {

            if (!this.$store.state.torrentFiles[this.torrent.hash]) {
                return true
            } 


            let isPlayable = false
            this.$store.state.torrentFiles[this.torrent.hash].forEach((file)=>{
                let extension = file.name.split('.').pop()
                if (['mp4', 'ogg', 'webm'].includes(extension.toLowerCase())) {
                    isPlayable = true
                }
            })

            return isPlayable
            
        },
        lastSeen() {
            if (!this.torrent.lastSeen) return ''

            let date = new Date(this.torrent.lastSeen)
            return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
        }
    }
};
</script>