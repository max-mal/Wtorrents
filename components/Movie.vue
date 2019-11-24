<template>
  <v-card class="ma-4" max-width="300" v-if="movie">
    <v-img v-if="movie.poster_path" :src="movie.poster_path" height="200px"></v-img>
    <v-card-title>
      {{ movie.name? movie.name: movie.title }}
    </v-card-title>
    <v-card-subtitle>
      Популярность: {{movie.popularity}} <br />
      Дата выхода: {{movie.first_air_date? movie.first_air_date: movie.release_date}}
      <p v-if="movie.origin_country">
        Страна: <span v-for="country in movie.origin_country">{{ country }} </span>
      </p>
    </v-card-subtitle>
    <v-card-subtitle>
    </v-card-subtitle>
    <v-card-actions>
      <!-- <v-btn @click="torrents">Торренты</v-btn> -->
      <v-btn @click="details">Подробно</v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: "Movie",

  props: ['movie'],

  data: () => ({
    show: false,
  }),
  methods: {
    torrents() {
      let that = this
      let name = this.movie.name? this.movie.name : this.movie.title
      this.$store.commit('torrentsQuery', name)

      let genres = this.movie.genre_ids? this.movie.genre_ids : []
      genres.forEach((genre) => {
        that.$store.commit('setGenreScore', genre)
      })

      this.$router.push('/search')
    },
    details() {
        this.$router.push('/movies/' + this.movie.type + ':' + this.movie.id)
    }
  },
  computed: {

  }
};

</script>
