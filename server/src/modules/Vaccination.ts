import { Int, Query, Resolver } from 'type-graphql';
import { VaccinationModel } from '../entities/vaccination';

@Resolver()
export class VaccinationResolver {
  @Query((_returns) => Int)
  async vaccinationCount() {
    return VaccinationModel.collection.countDocuments();
  }
}
