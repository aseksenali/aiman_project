const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        Username: {
            type: String,
            required: true
        },
        Password: {
            type: String,
            required: true
        },
        Email: {
            type: String,
            required: true
        },
        Role: {
            type: String,
            enum: ['regular', 'contributing'],
            required: true
        },
        PersonSubscriptions: [{
            type: Schema.ObjectId,
            ref: 'Person'
        }],
        UserSubscriptions: [{
            type: Schema.ObjectId,
            ref: 'User'
        }]
    }
);

userSchema.methods.validPassword = function (password) {
    return this.Password === password;
}

module.exports = mongoose.model("User", userSchema);
