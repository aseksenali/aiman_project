const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const schema = new Schema(
    {
        Source: {
            type: String,
            required: true
        },
        Value: {
            type: String,
            required: true
        }
    }
);

module.exports = schema;
