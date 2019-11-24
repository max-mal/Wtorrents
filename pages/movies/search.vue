<template>
    <v-container>
        <v-layout text-center wrap>
            <v-flex xs12 mb-5>
                <v-layout justify-center>
                    <v-text-field v-model="query" label="Поиск фильмов" @change="search"></v-text-field>
                    <v-btn color="primary" @click="search">
                        Search
                    </v-btn>
                </v-layout>
            </v-flex>

                <v-card v-if="$store.state.moviesFetching" class="mx-auto" max-width="700" outlined :loading="true">
                    <v-card-subtitle class="pb-0">Загрузка...</v-card-subtitle>
                </v-card>


             <v-row dense>
              <v-col
                v-for="movie in $store.state.movies"
                :key="movie.id"
                cols="12"
                md="4"
                lg="4"
              >
              <Movie :movie="movie" />
            </v-col>
          </v-row>
          
        </v-layout>
    </v-container>
</template>
<script>
import Movie from '~/components/Movie'
export default {

    components: {
        Movie
    },


    data: () => ({
        query: null,    
    }),
    methods: {
        search() {            
            let that = this
            that.$store.commit('moviesSearch')

            window.serverSocket.emit('mdbSearch', {query: that.query}, function(r){
                console.log(r)
                that.$store.commit('moviesArrived', r)
            })
        }
    }
};
</script>