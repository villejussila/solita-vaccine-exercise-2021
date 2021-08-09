import { Arg, Int, Query, Resolver } from 'type-graphql';
import { Vaccination, VaccinationModel } from '../entities/vaccination';

@Resolver(Vaccination)
export class VaccinationResolver {
  @Query((_returns) => Int)
  async vaccinationCount() {
    return VaccinationModel.collection.countDocuments();
  }

  @Query((_returns) => [Vaccination])
  async allVaccinations(
    @Arg('onDate', { nullable: true }) onDate: string,
    @Arg('untilDate', { nullable: true }) untilDate: string
  ): Promise<Vaccination[]> {
    console.log(onDate);
    console.log(untilDate);
    return VaccinationModel.find({});
  }
}
