const { buildSchema } = require("graphql")

module.exports = `
  input PersonInput {
    Name: String!
  }
  input RatingInput {
    Source: String!
    Value: String!
  }
  input MovieInput {
    Title: String!
    Year: Int!
    Rated: String
    Released: String
    Runtime: String
    Genre: [String]
    Director: [PersonInput]
    Writer: [PersonInput]
    Actors: [PersonInput]
    Plot: String!
    Language: [String]
    Country: [String]
    Awards: String
    Poster: String!
    Ratings: [RatingInput]
    Metascore: Int
    imdbRating: Float
    imdbVotes: Int
    imdbID: String
    Type: String
    DVD: String
    BoxOffice: String
    Production: String
    Website: String
    Response: Boolean
  }
  extend type Query {
    users: [User]
  }
  extend type Mutation {
    createMovie(movie:MovieInput): Movie!
    createMovies(movies: [MovieInput]): [Movie!]!
  }
`
