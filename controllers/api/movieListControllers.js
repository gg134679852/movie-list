const movieListService = require('../../services/movieListService')
const movieListControllers = {
  getMovie: (req, res) => {
    movieListService.getMovie(req,res,(data)=>{
      res.json(data)
    })
  },
  movieDetailed: (req, res) => {
    const index = req.params.id - 1
    const renderData = movieDatas[index]
    res.render('show', { renderData })
  }
}

module.exports = movieListControllers