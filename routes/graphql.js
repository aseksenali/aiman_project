const express = require('express');
const router = express.Router();
const graphqlHttp = require('express-graphql')
const defaultSchema = require('../graphql/schema/default')
const adminSchema = require('../graphql/schema/admin')
const userSchema = require('../graphql/schema/regular')
const defaultResolver = require('../graphql/resolvers/defaultResolvers')
const regularResolvers = require('../graphql/resolvers/regularResolvers')
const contributingResolvers = require('../graphql/resolvers/contributingResolvers')
const { makeExecutableSchema } = require('@graphql-tools/schema')

function options(req) {
    let typeDefs = defaultSchema
    let resolvers = defaultResolver
    if (req.user) {
        if (req.user.Role === 'regular') {
            typeDefs = userSchema
            resolvers = regularResolvers
        } else if (req.user.Role === 'contributing') {
            typeDefs = [userSchema, adminSchema]
            resolvers = [regularResolvers, contributingResolvers]
        }
    }
    return {
        typeDefs, resolvers
    }
}

router.get('/',
    graphqlHttp.graphqlHTTP((req) => {
        return {
            schema: makeExecutableSchema(options(req)),
            graphiql: true,
        }
    }));

router.post('/',
    graphqlHttp.graphqlHTTP((req) => {
        return {
            schema: makeExecutableSchema(options(req)),
            graphiql: false,
        }
    }))

module.exports = router
