const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose') // 引入mongoose
const Restaurant = require('./models/Restaurant.js')

if (process.env.NODE_ENV !== 'production') { // 若node環境變數非production 
  require('dotenv').config() // 引用dotenv使用.config()函數
}

const app = express()
const port = 3000

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 以mongoose建立連線

const db = mongoose.connection // 將連線狀況宣告為db
db.on('error', () => { // 若error產生
  console.log('mongodb error!')
})
db.once('open', () => { // 若成功連線
  console.log('mongodb connected!')
})

// 設定固定樣板
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 設定靜態資料來源
app.use(express.static('public'))

// 設定body-parser
app.use(express.urlencoded({ extended: true }))

// 設定首頁渲染
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render("index", { restaurants }))
    .catch(error => console.log(error))
})

// 新增餐廳頁面
app.get('/new', (req, res) => {
  return res.render('new')
})

// 新增餐廳資料
app.post('/create', (req, res) => {
  const newRestaurant = req.body
  return Restaurant.create(newRestaurant)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 刪除餐廳資料
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(res.redirect('/'))
    .catch(error => console.log(error))
})

// 餐廳詳細資料渲染
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean() // 把資料整理乾淨(非常重要)
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// 修改資料頁面
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// 修改資料
app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const restaurantData = req.body
  return Restaurant.findById(id)
    // 以id搜尋出的資料存為restaurantData後，再以.save()儲存
    .then(restaurant => {
      restaurant.name = restaurantData.name
      restaurant.name_en = restaurantData.name_en
      restaurant.category = restaurantData.category
      restaurant.image = restaurantData.image
      restaurant.location = restaurantData.location
      restaurant.phone = restaurantData.phone
      restaurant.google_map = restaurantData.google_map
      restaurant.rating = restaurantData.rating
      restaurant.description = restaurantData.description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// 設定搜尋結果渲染
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  if (!keyword || !keyword.length) {
    return res.redirect('/')
  }

  Restaurant.find() // .find()中沒條件表示全部取出
    .lean() // 資料處理乾淨後再動作 ※非常重要
    .then(shops => { // shops：未篩選資料
      const shopsList = shops.filter(shop => shop.name.toLowerCase().includes(keyword) || shop.category.toLowerCase().includes(keyword))
      // shopsList：篩選後資料 、 shop：shops中取出篩選的單筆資料
      res.render('index', { restaurants: shopsList, keyword })
    })
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})