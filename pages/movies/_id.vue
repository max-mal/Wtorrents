<template>
  <div>
    <v-alert type="error" v-if="error">
      {{ error }}
    </v-alert>
    <v-card v-if="fetching" class="mx-auto" max-width="700" outlined :loading="true">
      <v-card-subtitle class="pb-0">Загрузка...</v-card-subtitle>
    </v-card>
    <v-row dense v-if="movie">
      <v-col cols="12" md="8" lg="8">
        <v-card  class="mx-auto my-12" max-width="874">
          <v-img v-if="movie.backdrop_path" height="250" :src="movie.backdrop_path"></v-img>
          <v-card-title>{{ movie.name? movie.name : movie.title }}</v-card-title>
          <v-card-text>
            <v-row align="center" class="mx-0">
              <v-rating :value="movie.popularity" color="amber" dense half-increments readonly size="14"></v-rating>
              <div class="grey--text ml-4">{{ movie.popularity }} (Популярность)</div>
            </v-row>
            <div class="my-4 subtitle-1 black--text">
              <a :href="movie.homepage" target="_blank">{{ movie.homepage }}</a>
            </div>
            <div class="my-4 subtitle-1 ">
              Жанры: {{ (movie.genres ? movie.genres : []).map((item) => item.name).join(', ') }}
            </div>
            <div>{{ movie.overview }}</div>
          </v-card-text>
          <v-divider class="mx-4"></v-divider>          
          
          <v-list-item v-if="movie.created_by" v-for="creator in movie.created_by">
            <v-list-item-avatar color="grey">
              <v-img :src="'http://image.tmdb.org/t/p/w45/' + creator.profile_path" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ creator.name }}</v-list-item-title>
              <v-list-item-subtitle></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="movie.networks" v-for="network in movie.networks">
            <!-- <v-list-item-avatar color="grey"> -->
              <v-img max-width="100" :style="{'margin-right': '10px'}" :src="'http://image.tmdb.org/t/p/w92/' + network.logo_path" />
            <!-- </v-list-item-avatar> -->
            <v-list-item-content>
              <v-list-item-title>{{ network.name }}</v-list-item-title>
              <v-list-item-subtitle></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-card-actions>
            <v-btn @click="torrents">
              Искать торренты
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" lg="4">
        <v-card v-if="" class="mx-auto my-12" max-width="874">
          <v-img max-height="650" :src="movie.poster_path"></v-img>
          <br/>
          <v-divider class="mx-4"></v-divider>
          <v-card-title v-if="movie.seasons">Сезоны</v-card-title>
          <v-card-text v-if="movie.seasons">
            <v-chip-group v-model="seasonSelection" active-class="deep-purple accent-4 white--text" column>
              <v-chip v-for="season in movie.seasons">{{ season.name }}</v-chip>
            </v-chip-group>
          </v-card-text>          

        </v-card>
        <v-card v-if="movie.seasons" class="mx-auto my-12" max-width="874">
          <v-img max-height="350" :src="'http://image.tmdb.org/t/p/original/' + movie.seasons[seasonSelection].poster_path"></v-img>
          <v-card-title>{{ movie.seasons[seasonSelection].name }}</v-card-title>
          <v-card-text >            
            Кол-во серий: {{ movie.seasons[seasonSelection].episode_count }}<br/>
            Дата выхода: {{ movie.seasons[seasonSelection].air_date }}<br/>
            <br />
            {{ movie.seasons[seasonSelection].overview }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

      <v-banner v-if="recomendations" style="margin: 10px 0 10px; border-radius: 4px;">
      <h2 style="display: inline-block;">Рекомендации</h2>
      
    </v-banner>
    <v-expand-transition>
      <v-sheet class="mx-auto" elevation="8" v-if="recomendations">        
        <v-slide-group class="pa-3" :show-arrows="true" :center-active="true" :dark="true">
          <v-slide-item v-for="movie in recomendations.recs" :key="movie.id">
            <Movie :movie="movie" />
          </v-slide-item>
        </v-slide-group>
      </v-sheet>
    </v-expand-transition>


  </div>
</template>
<script>
  import Movie from '~/components/Movie'
export default {
  data: function() {
    return { error: null, seasonSelection: 0 }
  },
  components: {
    Movie
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    movie() {
      return this.$store.state.movieDetails[this.id]
    },
    fetching() {
      if (!this.movie) return false
      return this.movie.fetching
    },
    recomendations() {
      return this.$store.state.moviesRecomendations[this.id]
    } 
  },
  methods: {
    getMovieData() {
      let that = this
      if (!this.movie) {
        this.$store.commit('movieDetailSearch', this.id)
        window.serverSocket.emit('mdbDetails', { id: that.id }, function(movie) {
          console.log(movie)
          that.$store.commit('movieDetailsArrived', { id: that.id, movie })
        })
      }
    },
    getRecomendations(){
      let that = this
      if (!this.recomendations) {
        window.serverSocket.emit('mdbRecommendations', { id: that.id }, function(results) {
          console.log('recs', results)
          that.$store.commit('addMovieRecomendations', { recs: results, movie: {
            id: that.id,
            name: that.movie.name? that.movie.name : that.movie.title
          } })
        })
      }
    },
    torrents() {
      let that = this      
      let name = this.movie.name? this.movie.name : this.movie.title
      this.$store.commit('torrentsQuery', name)

      let genres = this.movie.genres? this.movie.genres : []
      genres.forEach((genre) => {
        console.log('set', genre.id)
        that.$store.commit('setGenreScore', genre.id)
      })

      this.$store.commit('addRecomendationStore', this.id)


      this.$router.push('/search')
    }
  },
  mounted() {
    this.getMovieData()
    this.getRecomendations()
  }
}

</script>
