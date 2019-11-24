<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <v-card min-width="300" max-width="500">
        <v-card-title class="headline">
          WebTorrents
        </v-card-title>
        <v-card-text>
          <p>Привет!</p>
          <p>Здесь ты можешь искать фильмы, сериалы, получать персональные рекомендации, а также смотреть все это онлайн, если тебе повезет и ты найдешь подходящий торрент</p>
          <p></p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn            
            nuxt
            to="/search"
          >
            Поиск торрентов
          </v-btn>
          <v-btn            
            nuxt
            to="/movies/search"
          >
            Поиск фильмов / сериалов
          </v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            nuxt
            to="/explore"
          >
            Explore
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>


export default {
  components: {
  }
}
</script>
