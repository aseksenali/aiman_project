module.exports = `
  type User {
    _id: ID!
    Username: String!
    Password: String!
    Email: String!
    Role: String
    UserSubscriptions: [User]
    PersonSubscriptions: [Person]
  }
  type Rating {
    _id: ID!
    Source: String!
    Value: String!
  }
  type Review {
    _id: ID!
    Source: User!
    Value: Int!
  }
  type Person {
    _id: ID!
    Name: String!
    Movies: [Movie]
  }
  input MovieQuery {
    Title: String
    Year: Int
    Genre: String
    minrating: Int
  }
  type Movie {
    _id: ID!
    Title: String!
    Year: Int!
    Rated: String
    Released: String
    Runtime: String
    Genre: [String]
    Director: [Person]
    Writer: [Person]
    Actors: [Person]
    Plot: String!
    Language: [String]
    Country: [String]
    Awards: String
    Poster: String!
    Ratings: [Rating]
    Metascore: Int
    imdbRating: Float
    imdbVotes: Int
    imdbID: String
    Type: String
    DVD: String
    BoxOffice: String
    Production: String
    Website: String
    Reviews: [Review]
    Response: Boolean
  }
  input UserInput {
    Username: String!
    Password: String!
    Email: String!
  }
  
  type Query {
    movies(query: MovieQuery): [Movie!]
    movie(id: ID): Movie
    person(id: ID): Person
    user(id: ID): User
    actors: [Person!]!
  }

  type Mutation {
    saveUser(user: UserInput): User
  }

  schema {
    query: Query
    mutation: Mutation
  }
`
