const { ApolloServer, gql } = require('apollo-server');
const getStream = require('get-stream');

const typeDefs = gql`
  type Query {
    hello: String
  }
  type Mutation {
    uploadFile(file: Upload): Boolean
  }
`;

const resolvers = {
  Query: {
    hello() {
      return 'world';
    },
  },
  Mutation: {
    async uploadFile(_, { file }) {
      const { createReadStream, encoding, filename } = await file;
      console.log('got file!', filename);

      // Comment out this, and the error is not propagated to the client properly
      const data = await getStream.buffer(createReadStream(), { encoding });

      throw new Error('you shall not pass');

      return true;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError(error) {
    console.log('returning error to GQL', error);
    return error;
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
