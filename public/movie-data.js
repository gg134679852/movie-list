const puppeteer = require('puppeteer')
const download = require('download')
const movieJson ='./public/json/movies.json'
const fs = require('fs')
const movieDatas = []
const moment = require('moment')
const momentDay = moment().format('L')
const splitMomentDay = momentDay.split('/')

async function movieScraper() {
  try {
    // fs.rm('img', { recursive: true },function (err) {
    //   if (err) {
    //     console.log(err)
    //   } else {
    //     fs.mkdirSync('img')
    //   }
    // })
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
    const page = await browser.newPage()

    await page.goto(`https://movie.gamme.com.tw/mtime/%E6%96%B0%E5%8C%97/0/43/${splitMomentDay[0]}${splitMomentDay[1]}`, {
      waitUntil: 'networkidle0'
    })
    // await page.waitForTimeout(3000)
    console.log('正在抓取電影時刻表...')
    const movieTime =  await page.$$eval('.bottom > ul', e => e.map(e => e.outerHTML))
    await page.$$eval('.timeTable2', e => e.map(e => e.querySelector('a').href))
      .then(async (m) => {
        for (i = 0; i < m.length; i++) {
          const url = m[i]
          let movieData = {}
          let imgUrl = ''
          await page.goto(`${url}`)
        
          console.log(`正在抓取第${i}部電影詳細資料...`)
          
          movieData.id = i
          
          movieData.time = movieTime[i]
          
          movieData.ScrapTime = momentDay

          imgUrl = await page.$eval('.poster', e => e.querySelector('img[title]').src)
          
          download(imgUrl,'./img')

          movieData.movieImg = imgUrl.split('/')[6]
           
          movieData.movieGenres = await page.$eval('.filmCast', e => e.querySelectorAll('p')[0].innerText.split('\t\n')[1])
          
          movieData.date = await page.$eval('.filmCast', e => e.querySelectorAll('p')[1].innerText.split('\t\n')[1])

          movieData.director = await page.$eval('.filmCast', e => e.querySelectorAll('p')[2].innerText.split('\t\n')[1])

          movieData.stars = await page.$eval('.filmCast', e => e.querySelectorAll('p')[3].innerText.split('\t\n')[1])
          
          movieData.movieTitle = await page.$eval('.right', e => e.querySelector('h2').innerText)

          movieData.subMovieTitle = await page.$eval('.right', e => e.querySelector('h3').innerText)

          movieData.description = await page.evaluate(() => {
            const elements = document.querySelector(".intro").querySelectorAll('p')
            const text = []
            for (i = 0; i < elements.length; i++) {
              text.push(document.querySelector(".intro").querySelectorAll('p')[i].innerText)
            }
            return text
          })

          await page.click('.trailer_sample')

          movieData.trailer = await page.$eval('iframe', m => { return m.src })

          movieDatas.push(movieData)
        }
      })
      .then(async () => {
        await browser.close()
          console.log("完成~~")
      })
  } catch (err) {
    console.log(err)
  }
}

module.exports= {
  movieScraper,
  movieDatas
}
