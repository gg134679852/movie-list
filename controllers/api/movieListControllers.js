const movieListService = require('../../services/movieListService')
const movieListControllers = {
  getMovie: (req, res) => {
    movieListService.getMovie(req,res,(data)=>{
      res.json(data)
    })
  },
  searchMovie:(req, res)=>{
    movieListService.searchMovie(req,res,(data)=>{
      res.json(data)
    })
  },
  getFavoriteMovies:(req, res) => {
    movieListService.getFavoriteMovies(req,res,(data)=>{
      res.json(data)
    })
  },
  addFavoriteMovie:(req, res) => {
    movieListService.addFavoriteMovie(req,res,(data)=>{
      res.json(data)
    })
  },
  removeFavoriteMovie:(req, res)=>{
    movieListService.removeFavoriteMovie(req,res,(data)=>{
      res.json(data)
    })
  },
  movieDetailed: (req, res) => {
    movieListService.movieDetailed(req,res,(data)=>{
      res.json(data)
    })
  }
}

module.exports = movieListControllers