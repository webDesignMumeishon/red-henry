//creating mongoDB
let mongoose = require('mongoose')
const { Schema } = require("mongoose")

let bicicletaSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion: {
        type: [Number], index: {type: '2dsphere', sparse: true}
    }
})

bicicletaSchema.statics.createInstance = function(code, color, modelo, ubicacion){
    return new this({
        code: code,
        color: color,
        modelo: modelo,
        ubicacion: ubicacion
    })
}

bicicletaSchema.statics.findAndUpdate = function(code, update){
    return this.findOneAndUpdate(code, update, {
        new: true
    })
} 

bicicletaSchema.statics.allBicis = function(cb){
    // return this.find({}, cb);
    return this.find({});

}

bicicletaSchema.method.toString = function(){
    return `code: ${this.code} | color: ${this.color}`
}

bicicletaSchema.statics.add = function(aBici, cb){
    // this.create(aBici, cb) //original
    return this.create(aBici)
}

bicicletaSchema.statics.findByCode = function(aCode, cb){
    // return this.findOne({code: aCode}, cb)
    return this.findOne({code: aCode})
}

bicicletaSchema.statics.removeByCode = function(aCode){
    return this.deleteOne({code: aCode})
}

module.exports = mongoose.model('Bicicleta', bicicletaSchema)



