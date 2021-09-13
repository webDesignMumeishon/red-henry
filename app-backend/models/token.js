const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TokenSchema = new Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, require: true, ref: 'Usuario'},
    token: {type: String, required: true},
    //when the expiration is reach mongo detecs it and remove the entire document
    createdAt: {type: Date, required: true, default: Date.now, expires: 43200}
})

module.exports = mongoose.model("Token", TokenSchema)
