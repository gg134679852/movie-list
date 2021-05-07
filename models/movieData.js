const mongoose = require('mongoose')
const Schema = mongoose.Schema
const movieDataSchema = new Schema({
  id: {
    type: Number, 
    required: true 
  },
  time: {
    type: String,
    required: true
  },
  ScrapTime: {
    type: String,
    required: true
  },
  img:{
    type: Buffer,
    required: true
  },
  movieGenres:{
    type: String,
    required: true
  },
  date:{
    type: String,
    required: true
  },
  director:{
    type: String,
    required: true
  },
  stars:{
    type: String,
    required: true
  },
  movieTitle:{
    type: String,
    required: true
  },
  subMovieTitle:{
    type: String,
    required: true
  }
})
module.exports = mongoose.model('movieData', movieDataSchema)