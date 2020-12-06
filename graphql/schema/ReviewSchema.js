const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const schema = new Schema(
    {
        Source: {
            type: Schema.ObjectId,
            ref: "User",
            required: true
        },
        Value: {
            type: String,
            required: true
        }
    }
);

module.exports = schema;
