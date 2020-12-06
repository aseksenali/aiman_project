module.exports = `
  type Rating {
    _id: ID!
    Source: String!
    Value: String!
  }
  type User {
    _id: ID!
    Username: String!
    Password: String!
    Email: String!
  }
  type Person {
    _id: ID!
    Name: String!
    Movies: [Movie]
  }
  type Movie {
    _id: ID!
    Title: String!
    Year: Int!
    Rated: String!
    Released: String!
    Runtime: String!
    Genre: [String!]!
    Director: [Person!]!
    Writer: [Person!]!
    Actors: [Person!]!
    Plot: String!
    Language: [String!]!
    Country: [String!]!
    Awards: String!
    Poster: String!
    Ratings: [Rating!]!
    Metascore: Int
    imdbRating: Float!
    imdbVotes: Int!
    imdbID: String!
    Type: String!
    DVD: String!
    BoxOffice: String!
    Production: String!
    Website: String!
    Response: Boolean!
  }
  
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
    Rated: String!
    Released: String!
    Runtime: String!
    Genre: [String!]!
    Director: [PersonInput!]!
    Writer: [PersonInput!]!
    Actors: [PersonInput!]!
    Plot: String!
    Language: [String!]!
    Country: [String!]!
    Awards: String!
    Poster: String!
    Ratings: [RatingInput!]!
    Metascore: Int
    imdbRating: Float!
    imdbVotes: Int!
    imdbID: String!
    Type: String!
    DVD: String!
    BoxOffice: String!
    Production: String!
    Website: String!
    Response: Boolean!
  }
  
  input UserInput {
    Username: String!
    Password: String!
    Email: String!
  }
  
  input UserUpdate {
    Id: String!
    Username: String
    Password: String
    Email: String
    Role: String
  }

  type Query {
    users: [User!]!
    movies: [Movie!]!
    movie(title: String!): Movie
    people: [Person!]!
    person(name: String!): Person
    actors: [Person!]!
  }

  type Mutation {
    createMovie(movie:MovieInput): Movie!
    createMovies(movies: [MovieInput]): [Movie!]!
    saveUser(user: UserInput): User!
    changeUser(user: UserUpdate): User!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`
