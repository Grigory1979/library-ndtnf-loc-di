import { Schema, model } from 'mongoose';

const bookSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    authors: {
        type: String,
        require: true
    },
    favorite: {
        type: String,
        require: true
    },
    fileCover: {
        type: String,
        require: true
    },
    fileName: {
        type: String,
        require: true
    },
    fileBook: {
        type: String,
        require: null
    }
})

export default model('Book', bookSchema)