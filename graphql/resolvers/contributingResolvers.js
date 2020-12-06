const Movie = require("../schema/MovieSchema")
const Person = require("../schema/PersonSchema")
const User = require("../schema/UserSchema")

async function createMovie(data) {
    try {
        const directors = await Promise.all(Array.from(new Set(data.Director.map(directors => directors.Name))).map(name => ({ Name: name })).map(async director => {
            let person = await Person.findOne({ Name: director.Name });
            if (person == null) {
                person = new Person(director)
                await person.save()
            }
            return person
        }))
        const writers = await Promise.all(Array.from(new Set(data.Writer.map(writers => writers.Name))).map(name => ({ Name: name })).map(async writer => {
            let person = await Person.findOne({ Name: writer.Name });
            if (person == null) {
                person = new Person(writer)
                await person.save()
            }
            return person
        }))
        const actors = await Promise.all(Array.from(new Set(data.Actors.map(actor => actor.Name))).map(name => ({ Name: name })).map(async actor => {
            let person = await Person.findOne({ Name: actor.Name });
            if (person == null) {
                person = new Person(actor)
                await person.save()
            }
            return person
        }))
        const movie = new Movie({
            ...data,
            Director: directors,
            Writer: writers,
            Actors: actors,
            Reviews: []
        })
        return await movie.save()
    } catch (error) {
        throw error;
    }
}

async function createMovies(data) {
    try {
        return await Promise.all(data.map(async movie => createMovie(movie)))
    } catch (error) {
        throw error
    }
}

async function getAllUsers() {
    try {
        return await User.find().exec()
    } catch (error) {
        throw error
    }
}



module.exports = {
    Query: {
        users: getAllUsers
    },
    Mutation: {
        createMovie: async args => createMovie(args.movie),
        createMovies: async args => createMovies(args.movies),
    }
}


