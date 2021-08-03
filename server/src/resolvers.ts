import Vaccination from './models/vaccination';

export const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    vaccinationCount: () => Vaccination.collection.countDocuments(),
    allVaccinations: () => Vaccination.find({})
  },
};
