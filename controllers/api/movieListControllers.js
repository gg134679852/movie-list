const movieListService = require('../../services/movieListService')
const movieListControllers = {
  getMovie: (req, res) => {
    movieListService.getMovie(req,res,(data)=>{
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