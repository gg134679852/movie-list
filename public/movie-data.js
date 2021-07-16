const db = require('../models')
const Product = db.Product
const ScrapedDate = db.ScrapedDate
const base64 = require('node-base64-image')
const puppeteer = require('puppeteer')
const movieDatas = []
const totalLength = []
const functionSwitch = []
const moment = require('moment')
const momentDay = moment().format('L')
const splitMomentDay = momentDay.split('/')

async function movieScraper() {
  try {
    //更新啟動狀態為on
    functionSwitch.push('on')
    //清空商品資料庫
    Product.destroy({ where: {} })
    //清空最後抓取時間資料庫
    ScrapedDate.destroy({ where: {} })
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
    //前往五月十五日的上映電影一覽表網站
    await page.goto(`https://movie.gamme.com.tw/mtime/%E6%96%B0%E5%8C%97/0/43/0515`, {
      waitUntil: 'networkidle0'
    })
    //抓取電影時刻表
    console.log('正在抓取電影時刻表...')
    const movieTime = await page.$$eval('.bottom > ul', e => e.map(e => e.outerHTML))
    //抓取電影詳細連結
    await page.$$eval('.timeTable2', e => e.map(e => e.querySelector('a').href))
      .then(async (movieLinks) => {
        //紀錄電影數量
        totalLength.push(movieLinks.length)
        //抓取電影詳細資料
        for (i = 0; i < movieLinks.length; i++) {
          //電影詳細資料連結
          const url = movieLinks[i]
          //存放電影詳細資料物件
          let data = {}
          //電影封面網址
          let imgUrl = ''
          //node-base64-image的設定
          const options = {
            string: true,
            headers: {
              "User-Agent": "my-app"
            }
          }
          //前往電影詳細資料頁面
          await page.goto(`${url}`)
          console.log(`正在抓取第${i}部電影詳細資料...`)
          //紀錄電影id
          data.id = i + 1
          //寫入電影上映時間
          data.time = movieTime[i]
          //抓取電影封面網址
          imgUrl = await page.$eval('.poster', e => e.querySelector('img[title]').src)
          //將圖片轉換成base64編碼
          data.movieImg = await base64.encode(imgUrl, options)
          //抓取電影類型
          data.movieGenres = await page.$eval('.filmCast', e => e.querySelectorAll('p')[0].innerText.split('\t\n')[1])
          //抓取電影上映日期
          data.date = await page.$eval('.filmCast', e => e.querySelectorAll('p')[1].innerText.split('\t\n')[1])
          //抓取電影導演名單
          data.director = await page.$eval('.filmCast', e => e.querySelectorAll('p')[2].innerText.split('\t\n')[1])
          //抓取電影演員名單
          data.stars = await page.$eval('.filmCast', e => e.querySelectorAll('p')[3].innerText.split('\t\n')[1])
          //抓取電影中文名稱
          data.movieTitle = await page.$eval('.right', e => e.querySelector('h2').innerText)
          //抓取電影英文名稱
          data.subMovieTitle = await page.$eval('.right', e => e.querySelector('h3').innerText)
          //抓取電影介紹
          data.description = await page.$eval('.intro', e => e.outerHTML)
          //點擊電影預告片
          await page.click('.trailer_sample')
          //抓取電影預告片網址
          data.trailer = await page.$eval('iframe', e => { return e.src})
          //存取電影名稱跟票價到資料庫
          await Product.create({
            id:data.id,
            name: data.movieTitle,
            price: 250,
            date: data.date
          })
          //將電影詳細資料儲存至movieDatas陣列
            movieDatas.push(data)
        }
      })
      .then(async () => {
        //關閉puppeteer
        await browser.close()
        //紀錄抓取時間
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
  totalLength,
  functionSwitch
}
