<template>
    <v-container>
        <v-layout text-center wrap>
            <v-flex xs12 mb-5>
                <v-layout justify-center>
                    <v-text-field v-model="query" label="Search" @change="searchTorrents"></v-text-field>
                    <v-btn color="primary" @click="searchTorrents">
                        Search
                    </v-btn>
                </v-layout>
            </v-flex>

                <v-card v-if="$store.state.torrentsFetching" class="mx-auto" max-width="700" outlined :loading="true">
                    <v-card-subtitle class="pb-0">Загрузка...</v-card-subtitle>
                </v-card>


             <v-row dense>
              <v-col
                v-for="(torrent, hash) in $store.state.torrents"
                :key="hash"
                cols="12"
                md="4"
                lg="4"
              >
              <Torrent :torrent="torrent" />
            </v-col>
          </v-row>
          
        </v-layout>
    </v-container>
</template>
<script>
import Torrent from "./Torrent";
export default {
    name: "Search",

    components: {
      Torrent
    },


    data: () => ({
        torrents: {},        
        query: '',
        searchParams: {
            "limit": 50,
            "safeSearch": true,
            "orderBy": null,
            "orderDesc": false,
            "type": "video",
            "size": { "min": 0, "max": 0 },
            "maxSize": 1073741824,
            "sizeEnabled": false,
            "filesEnabled": false,
            "files": { "min": 0, "max": 0 },
            "filesMax": 100
        }
    }),
    methods: {
        getFiles(hash){
            return false
            let that = this
            if (that.$store.state.torrentFiles[hash] === undefined) {
                that.$store.commit('torrentFilesArrived', { hash, files: false })
                window.serverSocket.emit('getFiles', {hash}, function(response) {
                    that.$store.commit('torrentFilesArrived', { hash, files: response })
                })
            }
        },
        searchTorrents() {            
            let that = this
            that.$store.commit('torrentsSearch')
            window.ratsSocket.emit('searchTorrent', this.query, this.searchParams, function(msgs) {
                    let torrents = {}
                    msgs.forEach(function(msg) {
                        torrents[msg.hash] = msg     
                        that.getFiles(msg.hash)                   
                    })
                    console.log(that.torrents)
                    that.$store.commit('torrentsArrived', torrents)
            });
            window.ratsSocket.off('remoteSearchTorrent')
            window.ratsSocket.on('remoteSearchTorrent', function(message) {
                let torrents = that.$store.state.torrents
                message.forEach(function(msg) {
                    torrents[msg.hash] = msg
                    that.getFiles(msg.hash)
                })
                that.$store.commit('torrentsArrived', torrents)
            })
        }
    },
    mounted() {
        if (this.$store.state.torrentsQuery) {            
            this.query = this.$store.state.torrentsQuery
            this.$store.commit('torrentsQuery', null)
            this.searchTorrents()
        }
    }
};
</script>