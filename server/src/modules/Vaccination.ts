import { Arg, Int, Query, Resolver } from 'type-graphql';
import { Vaccination, VaccinationModel } from '../entities/vaccination';

@Resolver(Vaccination)
export class VaccinationResolver {
  @Query((_returns) => Int)
  async vaccinationCount() {
    return VaccinationModel.collection.countDocuments();
  }

  // @FieldResolver()
  // async vaccineOrder() {
  //   return VaccinationModel.aggregate([
  //     {
  //       $lookup: {
  //         from: 'vaccineorders',
  //         localField: 'sourceBottle',
  //         foreignField: 'id',
  //         as: 'vaccineOrder',
  //       },
  //     },
  //     {
  //       $unwind: '$vaccineOrder',
  //     },
  //   ]);
  // }

  @Query((_returns) => [Vaccination])
  async test() {
    const asd = await VaccinationModel.find({
      sourceBottle: {
        $in: [
          '596425c8-f1d6-44ce-b67a-c0e9fa076a42',
          '8b992541-9f7d-4fd8-b6fc-9c42c1b7148f',
        ],
      },
    });
    console.log(asd);
    return asd;
  }

  @Query((_returns) => [Vaccination])
  async allVaccinations(
    @Arg('onDate', { nullable: true }) onDate: string,
    @Arg('untilDate', { nullable: true }) untilDate: string
  ): Promise<Vaccination[]> {
    console.log(onDate);
    console.log(untilDate);
    // return VaccinationModel.find({
    //   sourceBottle: { $in: ['2b00bc58-3faf-4d06-bb11-ef47aad8086a'] },
    // });
    const date = new Date('2021-03-20').toISOString();
    const date2 = new Date('2021-03-21').toISOString();
    console.log(date);
    const res: Vaccination[] = await VaccinationModel.aggregate([
      {
        //   $match: {
        //     sourceBottle: '2b00bc58-3faf-4d06-bb11-ef47aad8086a',
        //   },
        $match: {
          $and: [
            { vaccinationDate: { $gte: date } },
            { vaccinationDate: { $lt: date2 } },
          ],
        },
      },
      {
        $lookup: {
          from: 'vaccineorders',
          localField: 'sourceBottle',
          foreignField: 'id',
          as: 'vaccineOrder',
        },
      },
      {
        $unwind: '$vaccineOrder',
      },
    ]);
    // return VaccinationModel.find({
    //   sourceBottle: { $in: ['2b00bc58-3faf-4d06-bb11-ef47aad8086a'] },
    // });
    console.log(res[0]);
    console.log(res.length);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return res;
  }
}
