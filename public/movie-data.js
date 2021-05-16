const db = require('../models')
const Product = db.Product
const ScrapedDate = db.ScrapedDate
const base64 = require('node-base64-image')
const puppeteer = require('puppeteer')
const movieDatas = []
const totalLength = []
const moment = require('moment')
const momentDay = moment().format('L')
const splitMomentDay = momentDay.split('/')

async function movieScraper() {
  try {
    Product.destroy({ where: {} })
    ScrapedDate.destroy({ where: {} })
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

    await page.goto(`https://movie.gamme.com.tw/mtime/%E6%96%B0%E5%8C%97/0/43/0515`, {
      waitUntil: 'networkidle0'
    })
    console.log('正在抓取電影時刻表...')
    const movieTime = await page.$$eval('.bottom > ul', e => e.map(e => e.outerHTML))
    await page.$$eval('.timeTable2', e => e.map(e => e.querySelector('a').href))
      .then(async (m) => {
        totalLength.push(m.length)
        for (i = 0; i < m.length; i++) {
          const url = m[i]
          let data = {}
          let imgUrl = ''
          const options = {
            string: true,
            headers: {
              "User-Agent": "my-app"
            }
          };
          await page.goto(`${url}`)

          console.log(`正在抓取第${i}部電影詳細資料...`)
          
          data.id = i + 1

          data.time = movieTime[i]

          imgUrl = await page.$eval('.poster', e => e.querySelector('img[title]').src)

          data.movieImg = await base64.encode(imgUrl, options)

          data.movieGenres = await page.$eval('.filmCast', e => e.querySelectorAll('p')[0].innerText.split('\t\n')[1])

          data.date = await page.$eval('.filmCast', e => e.querySelectorAll('p')[1].innerText.split('\t\n')[1])

          data.director = await page.$eval('.filmCast', e => e.querySelectorAll('p')[2].innerText.split('\t\n')[1])

          data.stars = await page.$eval('.filmCast', e => e.querySelectorAll('p')[3].innerText.split('\t\n')[1])

          data.movieTitle = await page.$eval('.right', e => e.querySelector('h2').innerText)

          data.subMovieTitle = await page.$eval('.right', e => e.querySelector('h3').innerText)

          data.description = await page.$eval('.intro', e => e.outerHTML)

          await page.click('.trailer_sample')

          data.trailer = await page.$eval('iframe', m => { return m.src })
         
          await Product.create({
            id:data.id,
            name: data.movieTitle,
            price: 250,
            date: data.date
          })
            movieDatas.push(data)
        }
      })
      .then(async () => {
        await browser.close()
        await ScrapedDate.create({
          date: momentDay
        })
        console.log('完成~~')
        return movieDatas
      })
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  movieScraper,
  movieDatas,
  totalLength
}
