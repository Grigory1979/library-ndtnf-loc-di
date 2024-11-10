import { Schema, model } from 'mongoose';

const messageSchema = new Schema(
    {
        bookid: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            default: null,
        }
    },
    {
        versionKey: false,
        timestamps: true
    },
);

export default model('message', messageSchema);