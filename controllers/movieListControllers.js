const { movieScraper, movieDatas} = require('../public/movie-data.js')
const movieListControllers = {
  getMovie: (req, res) => {
    res.render('movieList', { movieDatas})
  },
  movieDetailed: (req, res)=>{
    const index = req.params.id
    const renderData = movieDatas[index]
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