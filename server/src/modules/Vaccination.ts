import { Int, Query, Resolver } from 'type-graphql';
import { Vaccination, VaccinationModel } from '../entities/vaccination';

@Resolver(Vaccination)
export class VaccinationResolver {
  @Query((_returns) => Int)
  async vaccinationCount() {
    return VaccinationModel.collection.countDocuments();
  }

  @Query((_returns) => [Vaccination])
  async allVaccinations(): Promise<Vaccination[]> {
    return VaccinationModel.find({});
  }
}
