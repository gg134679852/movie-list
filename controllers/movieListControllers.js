const movieJson = require('../public/json/movies.json')
const movieListControllers = {
  getMovie: async (req, res) => {
    res.render('movieList', {movieJson})
    },
  movieDetailed: (req, res)=>{
    const index = req.params.id
    const renderData = movieJson[index]
    res.render('show', { renderData })
  }
    // res.render('movieList', { movies: movieList.results })
// app.get('/movies/:movie_id', (req, res) => {
//   const movie = movieList.results.find(movie => movie.id.toString() === req.params.movie_id)

//   res.render('show', { movie: movie })
// })
// app.get('/search', (req, res) => {
//   const keyword = req.query.keyword
//   const movies = movieList.results.filter(movie => {
//     return movie.title.toLowerCase().includes(keyword.toLowerCase())
//   })
//   res.render('index', { movies: movies, keyword: keyword })
// })
}

module.exports = movieListControllers