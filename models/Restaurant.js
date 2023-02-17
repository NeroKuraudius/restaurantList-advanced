const mongoose = require("mongoose") // 引用mongoose
const Schema = mongoose.Schema // 建立資料庫綱要

// 設定資料庫綱要內容
const restaurantSchema = new Schema({
  name: { type: String, required: true },
  name_en: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  google_map: { type: String, required: true },
  rating: { type: Number, required: true },
  description: { type: String, required: true },
})

// 匯出資料庫綱要作為module
module.exports = mongoose.model('Restaurant', restaurantSchema)