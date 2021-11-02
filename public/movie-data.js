const db = require('../models')
const Product = db.Product
const ScrapedDate = db.ScrapedDate
const Genre = db.Genre
const FormData = require('form-data');
const Axios = require('axios')
const puppeteer = require('puppeteer')
const moment = require('moment')
const momentDay = moment().format('L')
require('dotenv').config()
   //宣告從TMBD API抓取資料函式
   async function getMovieDatasFromTmbd (data){
      const tmbdDatas = []
      console.log("從TMBD API抓取資料")
      let movieId = ''

      for(i=0;i<data.length;i++)
      {
        const url = {
          chUrl: encodeURI(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=zh-TW&query=${data[i].chName}&language=en-US&page=1&include_adult=true`),
          enUrl: encodeURI(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&query=${data[i].enName}&page=1&include_adult=true`)
        }  
        const moviedata ={}
       await Axios.get(url.chUrl)
        .then(async (obj)=>{
          if(obj.data.results[0] === undefined){
            await Axios.get(url.enUrl)
            .then((obj)=>{
               if(obj.data.results[0] === undefined){
               movieId = 'none'}else{
                 if(data[i].enName === obj.data.results[0].title){
                    moviedata.poster=obj.data.results[0].poster_path
                    moviedata.backdrop=obj.data.results[0].backdrop_path
                    movieId = obj.data.results[0].id
                 }else{
                    movieId = 'none'
                   }
                  }
                })            
              }else{
                  moviedata.poster=obj.data.results[0].poster_path
                  moviedata.backdrop=obj.data.results[0].backdrop_path
                  movieId = obj.data.results[0].id
                  }
                }) 
         if(movieId !== 'none'){
           const videoUrl = encodeURI(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.API_KEY}&language=en-US`)
           moviedata.trailer = await Axios.get(videoUrl).then((obj)=>{
           if(obj.data.results[0]){
             return obj.data.results[0].key
           }else{
             return null
           }
          })
          tmbdDatas.push(moviedata)
        }else{
          tmbdDatas.push('none')
        }
      }
      return tmbdDatas
     }
   //宣告上傳圖片到imgur函式
   async function imgurUploader(link){
      let imgLink = ''
      const data = new FormData()
      data.append('image', link)
      const config = {
            method: 'post',
            url: 'https://api.imgur.com/3/image',
            headers: { 
              'Authorization': `Client-ID ${process.env.CLIENT_ID}`,
            ...data.getHeaders()
          },
            data : data
      } 
     await Axios(config)
        .then((response) => {
        imgLink = response.data.data.link
        })
        .catch( (error) => {
          console.log(error)
        })
        return imgLink 
    }

 //宣告執行puppeteer的函式
 async function movieScraper() {
  try {
    //備份商品資料庫
    const ProductCopy = await Product.findAll({ raw: true, nest: true})
    //清空商品資料庫
    await Product.destroy({ where: {} })
    //清空最後抓取時間資料庫
    await ScrapedDate.destroy({ where: {} })
    //清空電影類型資料庫
    await Genre.destroy({ where: {} })
    //啟動puppeteer
    console.log("載入網頁中...")
    const browser = await puppeteer.launch({
      // headless: false,
      'args': [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process'
      ]
    })
    //開啟新的頁面
    const page = await browser.newPage()
     //宣告抓取電影詳細頁面連結的函式
    async function getMovieDetailLinks(datas){
      const detailDatas = []
      for(i=0;i<datas.length;i++){
        console.log(`正在抓取第${i}頁的資料`)
        await page.goto(datas[i], {
          waitUntil: 'networkidle0',timeout: 0
        })
        .then(async ()=>{
          await page.$$eval('.info', e => e.map((e) => {return {link:e.querySelector('h3 a').href,chName:e.querySelector('h3 a').title,enName:e.querySelector('h4 a').title}
          }))
          .then((data)=>{
            detailDatas.push(...data)
          })
        })
      }
      return detailDatas
    }
    //前往近期上映電影一覽表網站的第一頁
    await page.goto(`https://movie.gamme.com.tw/upcoming/page1`, {
      waitUntil: 'networkidle0',timeout: 0
    })
    //抓取電影網站總頁數
    console.log('正在抓取頁數...')
    const webSitePages = await page.$$eval('.incenter > a', e => e.map(e => e.href))
    webSitePages.unshift("https://movie.gamme.com.tw/upcoming/page1")
    
    const movieDetailDatas = await getMovieDetailLinks(webSitePages)
    const TmbdDatas = await getMovieDatasFromTmbd (movieDetailDatas)
    //存放電影類型
    let genresArrary =[]
    //計數器
    let counter = 0
    // 抓取電影詳細資料
    for (i = 0; i < movieDetailDatas.length; i++) {
      counter++
      //檢查電影備份是否有存在該電影
      const existData = ProductCopy.filter(obj => obj.name === movieDetailDatas[i].chName)
      if (existData.length !== 0 && existData[0].poster.length !== 0 && existData[0].backdrop.length !== 0){
        console.log(`${existData[0].name}已存在`)
        genresArrary = genresArrary.concat(existData[0].genres.split('、'))
        await Product.create({
          id: i + 1,
          name: existData[0].name,
          price: 250,
          date: existData[0].date,
          poster: existData[0].poster,
          backdrop: existData[0].backdrop,
          description: existData[0].description,
          genres: existData[0].genres,
          director: existData[0].director,
          stars: existData[0].stars,
          subMovieTitle: existData[0].subMovieTitle,
          trailer: existData[0].trailer
        })
        continue
      }
          //電影詳細資料連結
          const url = movieDetailDatas[i].link
          //TMDB資料
          const tmdb = TmbdDatas[i]
          //存放電影詳細資料物件
          let data = {}
          // 前往電影詳細資料頁面
          await page.goto(`${url}`,{
            waitUntil: 'networkidle0',timeout: 0
          })
          console.log(`正在抓取第${i}部電影詳細資料...`)
          //紀錄電影id
          data.id = i + 1
          //抓取電影封面網址
         const posterUrl = await page.$eval('.poster img[title]', e => e.src).then((src)=>{
          return `${src.slice(0,59)}${src.slice(67,71)}`
         })
          //抓取電影背景網址
         const backdropUrl = await page.$eval('.hPoster img', e => e.src)
          //取得電影封面
          data.poster = tmdb.poster ?  data.poster =`https://image.tmdb.org/t/p/w500${tmdb.poster}`: await imgurUploader(posterUrl) 
          //取得電影背景
          data.backdrop = tmdb.backdrop ? data.backdrop = `https://image.tmdb.org/t/p/original${tmdb.backdrop}`: await imgurUploader(backdropUrl)
          //抓取電影類型
          data.movieGenres = await page.$eval('.filmCast', e =>(
            e.querySelectorAll('p')[0] ? e.querySelectorAll('p')[0].innerText.split('\t\n')[1]: 'none'
          ))
          genresArrary =genresArrary.concat(data.movieGenres.split('、'))
          //抓取電影上映日期
          data.date = await page.$eval('.filmCast', e =>(
            e.querySelectorAll('p')[1] ?
            e.querySelectorAll('p')[1].innerText.split('\t\n')[1]: 'none'
          ))
          //抓取電影導演名單
          data.director = await page.$eval('.filmCast', e => (
            e.querySelectorAll('p')[2] ? e.querySelectorAll('p')[2].innerText.split('\t\n')[1]:'none'
          ))
          //抓取電影演員名單
          data.stars = await page.$eval('.filmCast', e => (
            e.querySelectorAll('p')[3] ?
            e.querySelectorAll('p')[3].innerText.split('\t\n')[1]:'none'
          ))
          //抓取電影中文名稱
          data.movieTitle = await page.$eval('.right', e => e.querySelector('h2').innerText)
          //抓取電影英文名稱
          data.subMovieTitle = await page.$eval('.right', e => e.querySelector('h3').innerText)
          //抓取電影介紹
          data.description = await page.$eval('.intro', e => e.outerHTML)
          // 點擊電影預告片
          await page.click('.trailer_sample')
          //抓取電影預告片網址
          data.trailer =  await page.$eval('iframe', e => { return e.src})
          .then((e)=>{
            if(e.length !== 0){
              return e.split('/')[4]
            }else{
              if(tmdb.trailer){
                return tmdb.trailer
              }else{
                return 'none'
              } 
            }
          })

        await Product.create({
          id: data.id,
          name: data.movieTitle,
          price: 250,
          date: data.date,
          poster: data.poster,
          backdrop: data.backdrop,
          description: data.description,
          genres: data.movieGenres,
          director: data.director,
          stars: data.stars,
          subMovieTitle: data.subMovieTitle,
          trailer: data.trailer
        })
        }
    if (counter === movieDetailDatas.length) {
      //關閉puppeteer
      await browser.close()
      //紀錄抓取時間
      await ScrapedDate.create({
        date: momentDay
      })
      genresArrary = new Set(genresArrary)
      genresArrary = [...genresArrary]
      genresArrary.forEach(e => {
        Genre.create({
          name: e
        })
      })
      console.log('完成~~')
    }
  } catch (err) {
    console.log(err)
  }
}

movieScraper()