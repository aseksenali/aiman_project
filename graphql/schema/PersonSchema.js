const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const personSchema = new Schema(
    {
        Name: {
            type: String,
            required: true
        }
    }
);

module.exports = mongoose.model("Person", personSchema);
