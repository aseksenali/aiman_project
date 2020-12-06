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
            type: String,
            required: true
        },
        Runtime: {
            type: String,
            required: true
        },
        Released: {
            type: String,
            required: true
        },
        Genre: [{
            type: String,
            required: true
        }],
        Director: [{
            type: Schema.ObjectId,
            ref: 'Person',
            required: true
        }],
        Writer: [{
            type: Schema.ObjectId,
            ref: 'Person',
            required: true
        }],
        Actors: [{
            type: Schema.ObjectId,
            ref: 'Person',
            required: true
        }],
        Plot: {
            type: String,
            required: true
        },
        Country: [{
            type: String,
            required: true
        }],
        Language: [{
            type: String,
            required: true
        }],
        Awards: {
            type: String,
            required: true
        },
        Poster: {
            type: String,
            required: true
        },
        Ratings: [{
            type: RatingSchema,
            required: true
        }],
        Metascore: {
            type: Number
        },
        imdbRating: {
            type: Number,
            required: true
        },
        imdbVotes: {
            type: Number,
            required: true
        },
        imdbID: {
            type: String,
            required: true
        },
        Type: {
            type: String,
            required: true
        },
        DVD: {
            type: String,
            required: true
        },
        BoxOffice: {
            type: String,
            required: true
        },
        Production: {
            type: String,
            required: true
        },
        Website: {
            type: String,
            required: true
        },
        Response: {
            type: Boolean,
            required: true
        },
        Reviews: [{
            type: ReviewSchema,
        }]
    }
);

module.exports = mongoose.model("Movie", movieSchema);
