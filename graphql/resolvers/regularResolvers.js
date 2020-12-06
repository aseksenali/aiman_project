const Movie = require("../schema/MovieSchema")
const Person = require("../schema/PersonSchema")
const User = require("../schema/UserSchema")

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

async function changeUser(user) {
    try {
        return await User.findById(user.Id, function (err, doc) {
            if (err) throw err
            if (user.Username) {
                const tmp = User.findOne({ Username: user.Username }).exec()
                if (tmp === null)
                    doc.Username = user.Username
            }
            if (user.Password)
                doc.Password = user.Password
            if (user.Email)
                doc.Email = user.Email
            if (user.Role && ['regular', 'contributing'].includes(user.Role)) {
                doc.Role = user.Role
            }
            return doc.save()
        })
    } catch (err) {
        throw err
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

async function subscribe(userId, id) {
    try {
        const source = await User.findOne({ Username: userId }).exec()
        if (source === null)
            return null
        let destination = await Person.findById(id).exec()
        if (destination !== null && !source.PersonSubscriptions.includes(destination._id)) {
            source.PersonSubscriptions = [...source.PersonSubscriptions, destination._id]
            return await source.save()
        }
        destination = await User.findById(id).exec()
        if (destination !== null && !source.PersonSubscriptions.includes(destination._id)) {
            source.UserSubscriptions = [...source.UserSubscriptions, destination._id]
            return await source.save()
        }
        return null
    } catch (err) {
        throw err
    }
}

async function createReview(userID, movieId, value) {
    try {
        const user = await User.findOne({ Username: userID }).exec()
        if (user === null) return null
        const movie = await Movie.findById(movieId)
        if (movie === null) return null
        const review = {
            Source: user._id,
            Value: value
        }
        movie.Reviews = [...movie.Reviews, review]
        movie.save()
        return populateReviews(movie)
    } catch
        (err) {
        throw err
    }
}

async function me(user) {
    try {
        return await User.findOne({ Username: user })
    } catch (err) {
        throw err
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
        actors: getAllActors,
        movie: async (objs, args, context, info) => getMovieById(args.id),
        person: async (objs, args, context, info) => getPersonById(args.id),
        me: async (objs, args, context, info) => me(context.user.Username),
        user: async (objs, args, context, info) => getUserById(args.id)
    },
    Mutation: {
        changeUser: async (objs, args, context, info) => changeUser(args.user),
        subscribe: async (objs, args, context, info) => subscribe(context.user.Username, args.id),
        createReview: async (objs, args, context, info) => createReview(context.user.Username, args.movieId, args.value),
    }
}
