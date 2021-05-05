const movieJson = require('../public/json/movies.json')
const { movieScraper} = require('../public/movie-data.js')
const movieListControllers = {
  getMovie: (req, res) => {
    res.render('movieList', {movieJson})
  },
  movieDetailed: (req, res)=>{
    const index = req.params.id
    const renderData = movieJson[index]
    res.render('show', { renderData })
  },
  movieScraper: (req, res) => {
    movieScraper()
      .then(() => {
        res.redirect('back')
      })
    }
}

module.exports = movieListControllers