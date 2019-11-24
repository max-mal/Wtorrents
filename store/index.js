import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({

  state: {
    torrents: {},
    torrentFiles: {},
    currentTorrent: null,
    torrentsFetching: false,
    moviesFetching: false,
    movies: [],
    movieDetails: {},
    torrentsQuery: null,   
    popularFetching: false, 
    popularMovies: null,
    topRated: null,
    topRatedFetching: false,
    showPopular: true,
    showTopRated: true,
    genreScores: {},
    isGenreScoresLoaded: false,
    genreMovies: null,
    genreMoviesFetching: false,
    moviesRecomendations: {},
    recomendationsStore: {},
    lastSeenTorrents: {},
    currentTorrentObj: null,
  },
  mutations: {
    torrentsArrived (state, torrents) {
      state.torrents = {... torrents}
      state.torrentsFetching = false
    },
    torrentFilesArrived(state, data) {
    	state.torrentFiles[data.hash] = data.files
    	state.torrentFiles = {... state.torrentFiles}
    },
    selectTorrent(state, hash) {
    	state.currentTorrent = hash
    },
    torrentsSearch(state) {
      state.torrentsFetching = true
    },
    moviesSearch(state) {
      state.moviesFetching = true
    },
    moviesArrived(state, movies) {
      state.movies = movies
      state.moviesFetching = false
    },
    movieDetailSearch(state, id){
      state.movieDetails = { ... { [id]: { fetching: true } }}
    },
    movieDetailsArrived(state, data) {
      state.movieDetails = { ... { [data.id]: data.movie }}
    },
    torrentsQuery(state, query) {
      state.torrentsQuery = query
    },
    getPopular(state) {
      state.popularFetching = true
    },
    popularArrived(state, movies) {
      state.popularMovies = movies
      state.popularFetching = false
    },
    getTopRated(state) {
      state.topRatedFetching = true
    },
    topRatedArrived(state, movies) {
      state.topRated = movies
      state.topRatedFetching = false
    },
    toggleElement(state, element) {
      if (element == 'topRated') {
        state.showTopRated = !state.showTopRated
      }
      if (element == 'popular') {
        state.showPopular = !state.showPopular
      }
    },
    setGenreScore(state, genre) {
      // let score = state.genreScores[genre]? state.genreScores[genre] : 0
      // state.genreScores = { ... { [genre] : score + 1  } }

      if (!state.genreScores[genre]) {
        state.genreScores[genre] = 0
      }
      state.genreScores[genre] += 1
      state.genreScores = {... state.genreScores}

      window.localStorage.setItem('genreScores', JSON.stringify(state.genreScores))
      // TODO Sync with backend DB
    },
    loadGenreScores(state) {
      let localData = window.localStorage.getItem('genreScores')
      if (localData) {
        localData = JSON.parse(localData)
        state.genreScores = localData
      } else {
        state.isGenreScoresLoaded = true
      }      
      state.isGenreScoresLoaded = true

      let recs = window.localStorage.getItem('recomendationsStore')
      if (recs) {
        state.recomendationsStore = JSON.parse(recs)
      }

      let lastSeenTorrents = window.localStorage.getItem('lastSeenTorrents')
      if (lastSeenTorrents) {
        state.lastSeenTorrents = JSON.parse(lastSeenTorrents)
      }
    },
    getGenreMovies(state) {
      state.genreMoviesFetching = true
    },
    genreMoviesArrived(state, movies) {
      state.genreMovies = movies
      state.genreMoviesFetching = false
    },
    addMovieRecomendations(state, data) {
      state.moviesRecomendations[data.movie.id] = data
      state.moviesRecomendations = {... state.moviesRecomendations}
    },
    addRecomendationStore(state, id) {
      state.recomendationsStore[id] = state.moviesRecomendations[id]
      state.recomendationsStore = {... state.recomendationsStore}

      window.localStorage.setItem('recomendationsStore', JSON.stringify(state.recomendationsStore))
    },
    addLastSeenTorrent(state, torrent) {      
      torrent.lastSeen = new Date().getTime()
      state.lastSeenTorrents[torrent.hash] = torrent
      state.lastSeenTorrents = {... state.lastSeenTorrents}

      window.localStorage.setItem('lastSeenTorrents', JSON.stringify(state.lastSeenTorrents))
    },
    deleteLastSeenTorrent(state, hash) {
      delete state.lastSeenTorrents[hash]
      state.lastSeenTorrents = {... state.lastSeenTorrents}

      window.localStorage.setItem('lastSeenTorrents', JSON.stringify(state.lastSeenTorrents))
    },
    removeMovieRecomendations(state, id) {
      delete state.recomendationsStore[id]
      state.recomendationsStore = {... state.recomendationsStore}

      window.localStorage.setItem('recomendationsStore', JSON.stringify(state.recomendationsStore))
    },
    setCurrentTorrent(state, torrent) {
      state.currentTorrentObj = torrent
    },
    deleteData(state) {
      state = {
        torrents: {},
        torrentFiles: {},
        currentTorrent: null,
        torrentsFetching: false,
        moviesFetching: false,
        movies: [],
        movieDetails: {},
        torrentsQuery: null,   
        popularFetching: false, 
        popularMovies: null,
        topRated: null,
        topRatedFetching: false,
        showPopular: true,
        showTopRated: true,
        genreScores: {},
        isGenreScoresLoaded: false,
        genreMovies: null,
        genreMoviesFetching: false,
        moviesRecomendations: {},
        recomendationsStore: {},
        lastSeenTorrents: {},
        currentTorrentObj: null,
      }
      localStorage.clear()
    }
  }
})

export default store