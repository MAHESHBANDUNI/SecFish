const mongoose = require("mongoose");

const fileschema = new mongoose.Schema({
    name: {
        type: String,
    },
    orijinalName: {
        type: String,
    },
    password: String,
})

const File= new mongoose.model('File', fileschema);

module.exports = File;