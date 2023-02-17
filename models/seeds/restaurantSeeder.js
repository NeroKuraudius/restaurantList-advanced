const mongoose = require("mongoose")
const Restaurant = require("../Restaurant.js")
const restaurantList = require("../../restaurant.json").results

// 設定環境變數
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on("error", () => {
  console.log("mongodb error!")
})

db.once("open", () => {
  console.log('mongodb connected!')
  
  Restaurant.create(restaurantList)
    .then(() => {
      db.close()
    })
    .catch(error => console.log(error))
})