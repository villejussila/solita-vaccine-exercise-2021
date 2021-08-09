import DataLoader from 'dataloader';
import { Vaccination } from '../entities/vaccination';
import { VaccinationModel } from '../entities/vaccination';
import _ from 'lodash';

const batchVaccinations = async (sourceBottleIds: readonly string[]) => {
  const ids: string[] = sourceBottleIds.map((s) => s);
  const vaccinations: Vaccination[] = await VaccinationModel.find({
    sourceBottle: { $in: ids },
  });

  const groupedVaccinations = _.groupBy(vaccinations, 'sourceBottle');

  const result = sourceBottleIds.map(
    (sourceBottleId) => groupedVaccinations[sourceBottleId] || []
  );
  return result;
};

export const createVaccinationLoader = () => new DataLoader(batchVaccinations);
