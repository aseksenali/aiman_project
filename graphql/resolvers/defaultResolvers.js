const User = require("../schema/UserSchema")
const Movie = require("../schema/MovieSchema")
const Person = require("../schema/PersonSchema")

async function saveUser(user) {
    try {
        const users = await User.find({ $or: [{ Username: user.Username }, { Email: user.Email }] }).exec()
        if (users.length !== 0) {
            return null
        }
        const newUser = new User({
            ...user,
            Role: 'regular'
        })
        return await newUser.save()
    } catch (error) {
        throw error
    }
}

function populateReviews(movie) {
    const populated = movie.Reviews.map(async review => {
        const source = await User.findOne({ _id: review.Source }).exec()
        return {
            _id: review._id,
            Source: {
                _id: review.Source,
                Username: source.Username,
                Email: source.Email,
            },
            Value: review.Value
        }
    })
    return {
        ...movie._doc,
        Reviews: populated
    }
}

async function getAllMovies(args) {
    try {
        let movies = await Movie.find().populate('Director').populate('Actors').populate('Writer')
        movies.map(async movie => await populateReviews(movie))
        if (args && args.Title) {
            movies = movies.filter(movie => movie.Title.toLowerCase().startsWith(args.Title.toLowerCase()))
        }
        if (args && args.Genre) {
            movies = movies.filter(movie => movie.Genre.includes(args.Genre))
        }
        if (args && args.Year) {
            movies = movies.filter(movie => movie.Year === args.Year)
        }
        if (args && args.minrating) {
            movies = movies.filter(movie => (movie.Reviews.length !== 0 ? movie.Reviews.map(review => parseInt(review.Value)).reduce((acc, cur) => acc + cur, 0) / movie.Reviews.length : 0) > args.minrating)
        }
        return movies
    } catch (error) {
        throw error
    }
}

async function getAllActors() {
    try {
        const map = new Map()
        const moviesFetched = await Movie.find().populate('Director').populate('Actors').populate('Writer');
        moviesFetched.forEach(movie => movie.Actors.forEach(actor => {
            if (map.has(actor)) {
                map.set(actor, map.get(actor).push(movie))
            } else
                map.set(actor, [movie])
        }));
        const actors = Array.from(map.keys()).sort((a, b) => {
            if (a === b) {
                return 0;
            }
            return a.Name < b.Name ? -1 : 1;
        })
        return actors.map(actor => ({
            ...actor._doc,
            Movies: map.get(actor)
        }))
    } catch (error) {
        throw error
    }
}

async function getMovieById(id) {
    try {
        let movie = await Movie.findById(id).populate('Director').populate('Actors').populate('Writer')
        movie = populateReviews(movie)
        return movie
    } catch (error) {
        throw error
    }
}

async function getPersonById(id) {
    try {
        const person = await Person.findOne({ _id: id }).exec()
        const movies = await Movie.find().or([{ Actors: { $in: [person._id] } }, { Writer: { $in: [person._id] } }, { Director: { $in: [person._id] } }]).populate("Actors").populate("Director").populate("Writer")
        return {
            ...person._doc,
            Movies: movies
        }
    } catch (error) {
        throw error
    }
}

async function getUserById(id) {
    try {
        const user = await User.findOne({ _id: id }).populate('UserSubscriptions').populate('PersonSubscriptions').exec()
        return user
    } catch (err) {
        throw err
    }
}

module.exports = {
    Query: {
        movies: async (objs, args, context, info) => getAllMovies(args.query),
        movie: async (objs, args, context, info) => getMovieById(args.id),
        person: async (objs, args, context, info) => getPersonById(args.id),
        actors: getAllActors,
        user: async (objs, args, context, info) => getUserById(args.id)
    },
    Mutation: {
        saveUser: (objs, args, context, info) => saveUser(args.user),
    }
}
