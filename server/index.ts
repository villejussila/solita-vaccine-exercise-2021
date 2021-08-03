import config from './src/utils/config';
import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './src/schema';
import { resolvers } from './src/resolvers';

const startServer = async () => {
  try {
    console.log('Connecting to MongoDB');
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Error connecting to MongoDB: ', error.message);
  }

  const server = new ApolloServer({ typeDefs, resolvers });

  const app = express();
  void (await server.start());
  server.applyMiddleware({ app });

  app.listen({ port: config.PORT }, () =>
    console.log(`Server started at http://localhost:4000${server.graphqlPath}`)
  );
};

void startServer();
// console.log('connecting to', config.MONGODB_URI);

// mongoose
//   .connect(config.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true,
//   })
//   .then(() => {
//     console.log('connected to MongoDB');
//   })
//   .catch((error) => {
//     console.log('error connecting to MongoDB:', error.message);
//   });

// const server = new ApolloServer({ typeDefs, resolvers });

// const app = express();
// void server.start().then(() => server.applyMiddleware({ app }));

// app.get('/', (_req, _res) => {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//   const vaxes = Vaccination.find({});
//   console.log(vaxes);
//   return;
// });

// app.listen({ port: config.PORT }, () =>
//   console.log(`Server started at http://localhost:4000${server.graphqlPath}`)
// );
