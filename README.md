# movie-list 網路爬蟲版

## 環境建置與需求 (prerequisites)
- puppeteer 9.0.0
- Node.js 10.15.0
- body-parser 1.19.0
- download 8.0.0
- express 4.17.1
- express-handlebars 5.2.0

## 安裝與執行 (installation and execution)
1. 選定一個資料夾，用來存放本專案。開啟終端機，移動至該資料夾，下載本專案
```
git clone https://github.com/gg134679852/movie-list
```
1. 移動至本專案資料夾
```
cd movie-list
```
2. 安裝套件
```
npm install
```
3. 啟動伺服器
```
npm run dev 
```
4. 若終端機出現下列字樣，代表伺服器成功啟動
```
localhost:3000

```
5.打開瀏覽器，於網址列輸入
```
http://localhost:3000/
```

##爬蟲資料來源
https://movie.gamme.com.tw/

## 現階段的功能
- 使用者可以抓取板橋大遠百威秀影城今日的電影時刻表
- 使用者可以點擊more按鈕來查看電影詳細資訊

未來還會增加功能
