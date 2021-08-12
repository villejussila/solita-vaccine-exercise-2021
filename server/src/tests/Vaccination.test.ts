import { startServer } from '../..';
import { initialVaccinations } from './test_initialData';
import mongoose from 'mongoose';
import { VaccinationModel } from '../entities/vaccination';
import { graphqlCall } from './test_helper';

describe('when Vaccinations exist initially', () => {
  beforeAll(() => {
    void startServer();
  });
  beforeEach(async () => {
    await VaccinationModel.deleteMany({});
    await VaccinationModel.insertMany(initialVaccinations);
    await VaccinationModel.deleteMany({});
    await VaccinationModel.insertMany(initialVaccinations);
  });

  test('all vaccinations are returned and contain at least sourceBottle field', async () => {
    const allVaccinationsQuery = `
    {
      allVaccinations {
        sourceBottle
        vaccinationDate
        gender
        vaccinationId
      }
    }`;

    const response = await graphqlCall({ source: allVaccinationsQuery });

    expect(response).toBeDefined();
    expect(response.data?.allVaccinations).toHaveLength(
      initialVaccinations.length
    );
    expect(response.data?.allVaccinations[0]).toHaveProperty('sourceBottle');
  });

  afterAll(() => {
    void mongoose.connection.close();
  });
});
