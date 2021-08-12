/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { VaccineOrder, VaccineOrderModel } from '../entities/vaccineOrder';
import { graphqlCall } from './test_helper';
import { initialVaccineOrders, initialVaccinations } from './test_initialData';
import { startServer } from '../../index';
import mongoose from 'mongoose';
import { VaccinationModel } from '../entities/vaccination';

describe('when Vaccineorders exist initially', () => {
  beforeAll(() => {
    void startServer();
  });
  beforeEach(async () => {
    await VaccineOrderModel.deleteMany({});
    await VaccineOrderModel.insertMany(initialVaccineOrders);
    await VaccinationModel.deleteMany({});
    await VaccinationModel.insertMany(initialVaccinations);
  });

  test('all vaccineorders are returned', async () => {
    const allVaccineOrdersQuery = `
    {
      allVaccineOrders {
        vaccine
        arrived
        injections
      }
    }
    `;
    const response = await graphqlCall({
      source: allVaccineOrdersQuery,
    });
    expect(response).toBeDefined();
    expect(response.data?.allVaccineOrders).toHaveLength(
      initialVaccineOrders.length
    );
    expect(response.data?.allVaccineOrders[0]).toHaveProperty('vaccine');
  });

  test('vaccineOrders are returned by arrival date. bottleExpires and isBottleExpiredOnDate have correct values', async () => {
    const vaccineOrdersByDateQuery = `
    query byDate ($isBottleExpiredOnDate: String!) {
      vaccineOrdersArrivedByDate (date: $isBottleExpiredOnDate) {
        vaccine
        arrived
        bottleExpires
        isBottleExpiredOnDate(date: $isBottleExpiredOnDate)
        injections
      }
    }
    `;
    const testDate = '2021-03-11T10:59:28.642790Z';

    const response = await graphqlCall({
      source: vaccineOrdersByDateQuery,
      variableValues: {
        isBottleExpiredOnDate: testDate,
      },
    });

    expect(response).toBeDefined();

    const arrivedDatesAndExpirations: Record<string, string>[] =
      response.data?.vaccineOrdersArrivedByDate.map((obj: VaccineOrder) => ({
        arrived: obj.arrived,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        bottleExpires: obj.bottleExpires,
      }));

    arrivedDatesAndExpirations.forEach((date) => {
      expect(Date.parse(date.arrived)).toBeLessThanOrEqual(
        Date.parse(testDate)
      );

      const timeArrivedExcludingDateAndFractions = date.arrived
        .split('T')[1]
        .split('.')[0];
      const timeExpiredExcludingDateAndFractions = date.bottleExpires
        .split('T')[1]
        .split('.')[0];
      console.log(
        timeArrivedExcludingDateAndFractions,
        '----',
        timeExpiredExcludingDateAndFractions
      );
      expect(timeArrivedExcludingDateAndFractions).toBe(
        timeExpiredExcludingDateAndFractions
      );
    });

    if (
      response?.data?.vaccineOrdersArrivedByDate[0].isBottleExpiredOnDate ===
      true
    ) {
      expect(
        Date.parse(response.data.vaccineOrdersArrivedByDate[0].bottleExpires)
      ).toBeLessThan(Date.parse(testDate));
    }
  });
  test('allVaccineOrders populated with correct vaccinations are returned', async () => {
    const allVaccineOrdersWithVaccinationsQuery = `{
      allVaccineOrders {
        arrived
        id
        injections
        vaccinationsDoneWithVaccine {
          sourceBottle
          vaccinationId
        }
      }
    }
    `;

    const response = await graphqlCall({
      source: allVaccineOrdersWithVaccinationsQuery,
    });

    expect(response).toBeDefined();
    const orders: VaccineOrder[] = response?.data?.allVaccineOrders;
    orders.forEach((order) => {
      expect(order.vaccinationsDoneWithVaccine).toBeDefined();
      if (order.vaccinationsDoneWithVaccine.length) {
        order.vaccinationsDoneWithVaccine.forEach((vaccination) => {
          expect(vaccination.sourceBottle).toBe(order.id);
          expect(vaccination.vaccinationId).toBeDefined();
        });
      }
    });
  });
  afterAll(() => {
    void mongoose.connection.close();
  });
});
