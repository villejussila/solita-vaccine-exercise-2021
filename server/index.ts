import config from './src/utils/config';
import 'reflect-metadata';
import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { VaccineOrderResolver } from './src/modules/VaccineOrder';
import { VaccinationResolver } from './src/modules/Vaccination';
import path from 'path';
import { TypegooseMiddleware } from './typegoose-middleware';
import { createVaccinationLoader } from './src/loaders/VaccinationLoader';

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

  const schema = await buildSchema({
    resolvers: [VaccineOrderResolver, VaccinationResolver],
    emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
    globalMiddlewares: [TypegooseMiddleware],
  });

  const server = new ApolloServer({
    schema,
    context: () => ({ vaccinationLoader: createVaccinationLoader() }),
  });

  const app = express();
  void (await server.start());
  server.applyMiddleware({ app });

  app.listen({ port: config.PORT }, () =>
    console.log(`Server started at http://localhost:4000${server.graphqlPath}`)
  );
};

void startServer();
