const movieJson = require('../public/json/movies.json')
const movieListControllers = {
  getMovie: (req, res) => {
    res.render('movieList', {movieJson})
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