var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    email: { type: String, required: true, trim: true },
    password:{ type: String, required: true, index: true, unique: true, trim: true },
    title: { type: String, required: true, index: true, unique: true, trim: true },
    content: { type: String },
    read: { type: String },
    createdAt: { type: Date, default: Date.now }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


var Board = mongoose.model('Board', schema);

module.exports = Board;
