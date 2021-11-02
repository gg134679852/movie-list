const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const ScrapedDate = db.ScrapedDate
const Genre = db.Genre
const Favorite = db.Favorite
const { Op } = require("sequelize");
const movieListService = {
  getMovie: (req, res,callback) => {
    const pageLimit = 12
    let offset = 0
    let genres = []
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if(genres.length === 0){
      Genre.findAll({ raw: true, nest: true}).then(genre => {
      genres = genre
    })
    }
     return Product.findAll({ raw: true, nest: true,limit:pageLimit,offset:offset}).then(product => {
      callback({product,genres})
    })
  },
  searchMovie:(req, res, callback)=>{
    if(req.query.genre){
      Product.findAll({ raw: true, nest: true,where:{
        genres:{[Op.like]: `%${req.query.genre}%`}
      }}).then(product => {
      callback({product})
     })
    }
    if(req.query.keyWord){
       const wordFliter = /\w+/g
      if(wordFliter.test(req.query.keyWord)){
      Product.findAll({ raw: true, nest: true,where:{
       subMovieTitle:{[Op.like]: `%${req.query.keyWord}%`}
      }}).then(product => {
      callback({product})
    })
    }else{
      Product.findAll({ raw: true, nest: true,where:{
        name:{[Op.like]: `%${req.query.keyWord}%`}
      }}).then(product => {
      callback({product})
     })
    }
   }
  },
  getFavoriteMovies:(req, res, callback)=>{
    return Favorite.findAll({ where:{userId:req.query.userId}, raw: true, nest: true}).then(data => {
      callback({data})
    })
  },
  addFavoriteMovie: async (req, res, callback) => {
    try {
      const movieData = await Product.findByPk(req.body.data.movieId)
      .then((data)=>{
        return data.dataValues
      })
      const accordingData = await Favorite.findOne({where:{
        userId:req.body.data.userId,
        name:movieData.name
      }})

      if(accordingData !== null){
        return callback({status: 'success',
        message: '已加入最愛'})
      }else{
    await Favorite.create({
        userId:req.body.data.userId,
        date:movieData.date,
        name:movieData.name,
        subMovieTitle:movieData.subMovieTitle,
        poster:movieData.poster,
        backdrop:movieData.backdrop,
        genres:movieData.genres,
        director:movieData.director,
        stars:movieData.stars,
        trailer:movieData.trailer,
        description:movieData.description
      })
      return callback({status: 'success',
        message: '成功加入最愛'})
      }
    } catch (error) {
      console.log(error)
      return callback({ status: 'error', message: '發生錯誤,請稍後在試' })
    }
  },
  removeFavoriteMovie: async (req, res, callback) => {
    try {
      const accordingData = await Favorite.findOne({where:{
        subMovieTitle:req.body.subMovieTitle,
        userId:req.body.userId
      }})
      if(accordingData === null){
        return callback({status: 'error',
        message: '找不到資料'})
      }else{
        await Favorite.destroy({where:{
        subMovieTitle:req.body.subMovieTitle,
        userId:req.body.userId
        }})
        return callback({status: 'success',
        message: '成功刪除'})
      }
    } catch (error) {
      console.log(error)
      return callback({ status: 'error', message: '發生錯誤,請稍後在試' })
    }
  },
  movieDetailed: (req, res, callback) => {
    Product.findByPk(req.params.id)
    .then((renderData)=>{
      callback({renderData})
    })
  }
}

module.exports = movieListService