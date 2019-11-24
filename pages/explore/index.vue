<template>
  <div>
    <v-banner style="margin-bottom: 10px; border-radius: 4px;">
      <h2 style="display: inline-block;">Популярное</h2>

      <v-btn icon @click="$store.commit('toggleElement', 'popular')">
        <v-icon>{{ $store.state.showPopular ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>

    </v-banner>
    <v-expand-transition>
      <v-sheet class="mx-auto" elevation="8" v-if="$store.state.showPopular">
        <v-card v-if="$store.state.popularFetching" class="mx-auto" max-width="700" outlined :loading="true">
          <v-card-subtitle class="pb-0">Загрузка...</v-card-subtitle>
        </v-card>
        <!-- <v-row dense> -->
        <v-slide-group class="pa-3" :show-arrows="true" :center-active="true" :dark="true">
          <v-slide-item v-for="movie in $store.state.popularMovies" :key="movie.id">
            <Movie :movie="movie" />
          </v-slide-item>
        </v-slide-group>
      </v-sheet>
    </v-expand-transition>
    <v-banner style="margin: 10px 0 10px; border-radius: 4px;">
      <h2 style="display: inline-block;">Top Rated</h2>

      <v-btn icon @click="$store.commit('toggleElement', 'topRated')">
        <v-icon>{{ $store.state.showTopRated ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-banner>
    <v-expand-transition>
      <v-sheet class="mx-auto" elevation="8" v-if="$store.state.showTopRated">
        <v-card v-if="$store.state.topRatedFetching" class="mx-auto" max-width="700" outlined :loading="true">
          <v-card-subtitle class="pb-0">Загрузка...</v-card-subtitle>
        </v-card>
        <v-slide-group class="pa-3" :show-arrows="true" :center-active="true" :dark="true">
          <v-slide-item v-for="movie in $store.state.topRated" :key="movie.id">
            <Movie :movie="movie" />
          </v-slide-item>
        </v-slide-group>
      </v-sheet>
    </v-expand-transition>



    <v-banner style="margin: 10px 0 10px; border-radius: 4px;" v-if="$store.state.genreMovies && $store.state.genreMovies.length">
      <h2 style="display: inline-block;">Возможно вам понравится</h2>
       <v-select
        style="margin-top: 20px;"           
          :items="sortItems"
          v-model="sort"
          label="Сортировка"
          @change="getGenre"
        ></v-select>
    </v-banner>
    <v-expand-transition>
      <v-sheet class="mx-auto" elevation="8" v-if="$store.state.genreMovies && $store.state.genreMovies.length">
        <v-card v-if="$store.state.genreMoviesFetching" class="mx-auto" max-width="700" outlined :loading="true">
          <v-card-subtitle class="pb-0">Загрузка...</v-card-subtitle>
        </v-card>
        <v-slide-group class="pa-3" :show-arrows="true" :center-active="true" :dark="true">
          <v-slide-item v-for="movie in $store.state.genreMovies" :key="movie.id">
            <Movie :movie="movie" />
          </v-slide-item>
        </v-slide-group>
      </v-sheet>
    </v-expand-transition>


    <div v-for="slide in recomendations">
        <v-banner v-if="slide.type == 'list'" style="margin: 10px 0 10px; border-radius: 4px;">
          <h2 style="display: inline-block;">Вы смотрели {{ slide.movie.name? slide.movie.name : slide.movie.title }}, возможно Вам понравится</h2>
          <v-btn dark fab small absolute right bottom @click="dislike(slide.movie.id)">
              <v-icon>mdi-heart-off</v-icon>
          </v-btn>
          
        </v-banner>
        <v-expand-transition v-if="slide.type == 'list'">
          <v-sheet class="mx-auto" elevation="8" v-if="slide.movies">        
            <v-slide-group class="pa-3" :show-arrows="true" :center-active="true" :dark="true">
              <v-slide-item v-for="movie in slide.movies" :key="movie.id">
                <Movie :movie="movie" />
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
        </v-expand-transition>


        <v-row dense v-if="slide.type == 'single'">
            <v-col cols="12" md="4" lg="4">
                <v-card class="mx-auto my-12" max-width="874">
                  <v-img max-height="650" :src="slide.movie.poster_path"></v-img>                        
                </v-card>
            </v-col>

            <v-col cols="12" md="8" lg="8">
                <v-card  class="mx-auto my-12" max-width="874">                  
                  <v-card-title>{{ slide.movie.name? slide.movie.name : slide.movie.title }}</v-card-title>
                  <v-card-text>
                    Популярность: {{slide.movie.popularity}} <br />
                  Дата выхода: {{slide.movie.first_air_date? slide.movie.first_air_date: slide.movie.release_date}}<br/>
                  <p v-if="slide.movie.origin_country">
                    Страна: <span v-for="country in slide.movie.origin_country">{{ country }} </span>
                  </p>
                      {{ slide.movie.overview }}
                  </v-card-text>
                  <v-card-actions>
                  <v-btn @click="details(slide.movie.type +':'+slide.movie.id)">Подробно</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-col>
        </v-row>

    </div>


  </div>
</template>
<script>
import Movie from '~/components/Movie'
export default {

  components: {
    Movie
  },


  data: () => ({
    query: null,
    sort: 'popularity.desc',
    sortItems: [
        'popularity.asc',
        'popularity.desc',
        'vote-average.asc',
        'vote-average.desc',
    ],
    recomendations: [],

  }),
  methods: {
    getPopular() {
      let that = this
      that.$store.commit('getPopular')

      window.serverSocket.emit('mdbPopular', {}, function(r) {
        console.log(r)
        that.$store.commit('popularArrived', r)
      })
    },
    getTopRated() {
      let that = this
      that.$store.commit('getTopRated')

      window.serverSocket.emit('mdbPopular', { type: 'top_rated' }, function(r) {
        console.log(r)
        that.$store.commit('topRatedArrived', r)
      })
    },
    getGenre() {
        let that = this
        that.$store.commit('getGenreMovies')
        let genres = []
            
        Object.keys(that.$store.state.genreScores).forEach((key) => {
            genres.push({key, value: that.$store.state.genreScores[key]})
        })

        genres.sort((a,b) => {
            if ( a.value < b.value ){
                return -1;
            }
            if ( a.value > b.value ){
                return 1;
            }
            return 0;
        })

        console.log(genres)

        window.serverSocket.emit('mdbDiscover', { type: 'all', params: {

            'with_genres': genres.map((el) => el.key).slice(0,3).join(','),
            'sort_by': that.sort,

        } }, function(r) {
            console.log('Genre', r)
            that.$store.commit('genreMoviesArrived', r)
        })
    },
    shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    },
    getRecomendations(more = true) {
        let that = this
        let result = []

        let source = this.shuffle(Object.keys(this.$store.state.recomendationsStore))
        
        if (more) {
            for (let i=0; i<2; i++) {
                source = source.concat(source)
            }            
        }

        source.forEach((key, index) => {
            let type = ((index +1) %2 == 0)? 'list' : 'single'
            if (more) {
                type = ((index +1) %3 == 0)? 'list' : 'single'
            }
            let r = that.$store.state.recomendationsStore[key]
            if (type == 'single') {
                let movie = that.shuffle(r.recs)[0]
                result.push({type, movie})
            } else {
                result.push({type, movies: r.recs, movie: r.movie})
            }
        })

        this.recomendations = result
    },
    dislike(id) {
        this.$store.commit('removeMovieRecomendations', id)
        this.getRecomendations()
        window.scrollTo(0,0);
    },
    details(id) {
        this.$router.push('/movies/' + id)
    }

  },
  computed: {

  },
  mounted() {

    if (!this.$store.state.popularMovies) {
      this.getPopular()
    }
    if (!this.$store.state.topRated) {
      this.getTopRated()
    }

    if (!this.$store.state.isGenreScoresLoaded) {
        this.$store.commit('loadGenreScores')
    }


    if (this.$store.state.genreScores && Object.keys(this.$store.state.genreScores).length) {
      this.getGenre()
    }    

    if (!this.recomendations.length) {
        this.getRecomendations()
    }
    
  }
};

</script>
