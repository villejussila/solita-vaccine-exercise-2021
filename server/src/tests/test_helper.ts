import { VaccineOrderModel } from '../entities/vaccineOrder';
import { VaccinationModel } from '../entities/vaccination';
import { graphql } from 'graphql';
import { buildSchema, Maybe } from 'type-graphql';
// import path from 'path';
import { VaccineOrderResolver } from '../modules/VaccineOrder';
import { VaccinationResolver } from '../modules/Vaccination';
import { TypegooseMiddleware } from '../../typegoose-middleware';
import { createVaccinationLoader } from '../loaders/VaccinationLoader';

export const vaccineOrdersInDb = async () => {
  const vaccineOrders = await VaccineOrderModel.find({});
  return vaccineOrders;
};
export const vaccinationsInDb = async () => {
  const vaccinations = await VaccinationModel.find({});
  return vaccinations;
};

interface Options {
  source: string;
  variableValues?: Maybe<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }>;
}

export const graphqlCall = async ({ source, variableValues }: Options) => {
  return graphql({
    schema: await buildSchema({
      resolvers: [VaccineOrderResolver, VaccinationResolver],
      // emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
      globalMiddlewares: [TypegooseMiddleware],
    }),
    source,
    variableValues,
    contextValue: {
      vaccinationLoader: createVaccinationLoader(),
    },
  });
};
