const { movieDatas, totalLength} = require('../public/movie-data')
const movieListService = require('../services/movieListService')
const loading = 'loading'

const movieListControllers = {
  getMovie: (req, res) => {
    if (movieDatas.length === 0 || movieDatas.length !== totalLength[0]) {
      if (totalLength[0]> 0){
        const movieDataLength = movieDatas.length
        const totalmovieLength = totalLength[0]
        res.render('movieList', { movieDataLength, totalmovieLength })
      } else { 
        res.render('movieList', { loading })}
      movieListService.getMovie(req, res, (data) => {
        const renderData = data.movieDatas
        res.render('movieList', {renderData})
      })
    } else {
    movieListService.getMovie(req,res,(data)=>{
      const renderData = data.movieDatas
      const renderCart = data.cart
      const totalPrice = data.totalPrice
      res.render('movieList', { renderData, renderCart, totalPrice})
      })
    }
 },
  movieDetailed: (req, res)=>{
    movieListService.movieDetailed(req,res,(data)=>{
      const renderData = data.renderData
      res.render('show', {renderData})
    })
  }
}

module.exports = movieListControllers