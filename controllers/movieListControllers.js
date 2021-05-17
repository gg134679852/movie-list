const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const ScrapedDate = db.ScrapedDate
const moment = require('moment')
const momentDay = moment().format('L')
const { movieDatas, totalLength} = require('../public/movie-data')
const movieListService = require('../services/movieListService')

const movieListControllers = {
  getMovie: (req, res) => {
    const loading = 'loading'
    if (movieDatas.length === 0 || movieDatas.length !== totalLength[0]) {
      res.render('movieList', { loading })
      movieListService.getMovie(req, res, (data) => {
        const renderData = data.movieDatas
        res.render('movieList', { renderData })
      })
    } else {
    movieListService.getMovie(req,res,(data)=>{
      const renderData = data.movieDatas
        res.render('movieList', { renderData })
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