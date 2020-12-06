const fetch = require('node-fetch')

const graphql = function (url, graphqlRequest, req, variables) {
    const body = {
        query: graphqlRequest,
        variables: variables
    }
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Cookie": `${req.headers.cookie}`
        },
        body: JSON.stringify(body)
    })
}

module.exports = graphql
