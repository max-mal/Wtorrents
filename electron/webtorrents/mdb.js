const fetch = require('node-fetch');

let kp = {
	socket: null,
	apiKey: '3ac3ff9b975fff300aadd3b1b9f7657c',
	url: 'https://api.themoviedb.org/3/',
	configuration: {},
	init(socket) {
		let that = this
		this.socket = socket

		this.getConfiguration()

		this.socket.on('mdbSearch', function(msg, answer) {
			let results = []
			that.call('search/tv', {query: msg.query}).then((response) => {
				response.results.forEach((res) => {
					res.type = 'tv'
					if (res.poster_path)
					res.poster_path = `${that.configuration.images.base_url}w500${res.poster_path}`
					results.push(res)
				})
				return that.call('search/movie', {query: msg.query})
			}).then((response) => {
				response.results.forEach((res) => {
					res.type = 'movie'
					if (res.poster_path)
					res.poster_path = `${that.configuration.images.base_url}w500${res.poster_path}`
					results.push(res)
				})

				answer(results)
			}).catch((err) => {
				answer(err)
			})
		})

		this.socket.on('mdbDetails', function(msg, answer) {
			let type = msg.id.split(':')[0]
			let id = msg.id.split(':')[1]

			that.call(`${type}/${id}`).then((response) => {
				if (response.poster_path)
				response.poster_path = `${that.configuration.images.base_url}original${response.poster_path}`
				if (response.backdrop_path)
				response.backdrop_path = `${that.configuration.images.base_url}original${response.backdrop_path}`
				answer(response)
			})
		})

		this.socket.on('mdbRecommendations', function(msg, answer) {
			let type = msg.id.split(':')[0]
			let id = msg.id.split(':')[1]

			let results = []
			that.call(`${type}/${id}/recommendations`).then((response) => {
				response.results.forEach((res) => {
					res.type = type
					if (res.poster_path)
					res.poster_path = `${that.configuration.images.base_url}w500${res.poster_path}`
					results.push(res)
				})
				answer(results)
			})
		})

		this.socket.on('mdbPopular', function(msg, answer) {
			let results = []
			let type = msg.type? msg.type: 'popular'
			that.call('movie/' + type).then((response) => {
				response.results.forEach((res) => {
					res.type = 'movie'
					if (res.poster_path)
					res.poster_path = `${that.configuration.images.base_url}w500${res.poster_path}`
					results.push(res)
				})
				return that.call('tv/' + type)
			}).then((response) => {
				response.results.forEach((res) => {
					res.type = 'tv'
					if (res.poster_path)
					res.poster_path = `${that.configuration.images.base_url}w500${res.poster_path}`
					results.push(res)
				})

				answer(that.shuffle(results))
			}).catch((err) => {
				answer(err)
			})
		})

		this.socket.on('mdbDiscover', function(msg, answer) {
			let results = []
			let type = msg.type? msg.type: 'all'
			if (type == 'all') {
				that.call('discover/movie', msg.params).then((response) => {
				response.results.forEach((res) => {
						res.type = 'movie'
						if (res.poster_path)
						res.poster_path = `${that.configuration.images.base_url}w500${res.poster_path}`
						results.push(res)
					})
					return that.call('discover/tv', msg.params)
				}).then((response) => {
					response.results.forEach((res) => {
						res.type = 'tv'
						if (res.poster_path)
						res.poster_path = `${that.configuration.images.base_url}w500${res.poster_path}`
						results.push(res)
					})

					answer(results)
				}).catch((err) => {
					answer(err)
				})
			} else {
				that.call('discover/' + type, msg.params).then((response) => {
				response.results.forEach((res) => {
						res.type = type
						if (res.poster_path)
						res.poster_path = `${that.configuration.images.base_url}w500${res.poster_path}`
						results.push(res)
					})
					answer(results)
				}).catch((err) => {
					answer(err)
				})
			}
			
		})
	},
	call(method, params = {}, callback = null) {
		params.api_key = this.apiKey
		params.language = 'ru-RU'
		params.region = 'ru'

		let queryString = ''
		Object.keys(params).forEach((key) => {
			queryString += `&${key}=${encodeURIComponent(params[key])}`
		})

		return fetch(`https://api.themoviedb.org/3/${method}?${queryString}`)
	    .then(res => res.json())	    

	},
	getConfiguration() {
		let that = this
		this.call('configuration').then((configuration) => {
			that.configuration = configuration
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
}


}


module.exports = kp