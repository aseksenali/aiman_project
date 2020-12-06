const mongoose = require("mongoose")
const RatingSchema = require('../schema/RatingSchema')
const ReviewSchema = require('../schema/ReviewSchema')

const Schema = mongoose.Schema;

const movieSchema = new Schema(
    {
        Title: {
            type: String,
            required: true
        },
        Year: {
            type: Number,
            required: true
        },
        Rated: {
            type: String
        },
        Runtime: {
            type: String
        },
        Released: {
            type: String
        },
        Genre: [{
            type: String
        }],
        Director: [{
            type: Schema.ObjectId,
            ref: 'Person'
        }],
        Writer: [{
            type: Schema.ObjectId,
            ref: 'Person'
        }],
        Actors: [{
            type: Schema.ObjectId,
            ref: 'Person'
        }],
        Plot: {
            type: String,
            required: true
        },
        Country: [{
            type: String
        }],
        Language: [{
            type: String
        }],
        Awards: {
            type: String
        },
        Poster: {
            type: String,
            required: true
        },
        Ratings: [{
            type: RatingSchema
        }],
        Metascore: {
            type: Number
        },
        imdbRating: {
            type: Number
        },
        imdbVotes: {
            type: Number
        },
        imdbID: {
            type: String
        },
        Type: {
            type: String
        },
        DVD: {
            type: String
        },
        BoxOffice: {
            type: String
        },
        Production: {
            type: String
        },
        Website: {
            type: String
        },
        Response: {
            type: Boolean
        },
        Reviews: [{
            type: ReviewSchema,
        }]
    }
);

module.exports = mongoose.model("Movie", movieSchema);
