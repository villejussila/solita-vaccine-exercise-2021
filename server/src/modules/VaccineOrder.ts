import { DocumentType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import { isDateString } from 'class-validator';
import {
  Arg,
  Ctx,
  Int,
  Query,
  Resolver,
  Root,
  FieldResolver,
} from 'type-graphql';
import { Vaccination } from '../entities/vaccination';
import {
  VaccineInput,
  VaccineOrder,
  VaccineOrderModel,
} from '../entities/vaccineOrder';
import { MyContext } from '../types/MyContext';
import { parseVaccineProducer } from '../utils/validation';

@Resolver((_of) => VaccineOrder)
export class VaccineOrderResolver {
  @Query((_returns) => Int)
  async vaccineOrderCount() {
    return VaccineOrderModel.collection.countDocuments();
  }

  @FieldResolver()
  async vaccinationsDoneWithVaccine(
    @Root() root: VaccineOrder,
    @Ctx() ctx: MyContext
  ): Promise<Vaccination[]> {
    const response = await ctx.vaccinationLoader.load(root.id);
    return response;
  }

  @Query((_returns) => [VaccineOrder])
  async allVaccineOrders(
    @Arg('vaccine', { nullable: true }) vaccine?: VaccineInput,
    @Arg('arrivedByDate', { nullable: true }) arrivedByDate?: string
  ): Promise<DocumentType<VaccineOrder, BeAnObject>[]> {
    if (vaccine && arrivedByDate) {
      return vaccineOrdersByProducerAndArrivedByDate(vaccine, arrivedByDate);
    }

    if (vaccine) {
      return vaccineOrdersByProducer(vaccine);
    }

    if (arrivedByDate) {
      return vaccineOrdersArrivedByDate(arrivedByDate);
    }
    return VaccineOrderModel.find({});
  }

  //   @Query((_returns) => [VaccineOrder])
  //   async allVaccineOrders2(
  //     @Arg('byDate', { nullable: true }) byDate?: string
  //   ): Promise<VaccineOrder[]> {
  //     if (byDate) {
  //       /*
  //       const dateISO = new Date(byDate).toISOString();
  //       const dateISO2 = new Date('2021-03-21').toISOString();
  //       const response: VaccineOrder[] = await VaccineOrderModel.aggregate([
  //         {
  //           $match: {
  //             arrived: { $lte: dateISO },
  //           },
  //           $match: {
  //             $and: [
  //               { arrived: { $gte: dateISO } },
  //               { arrived: { $lt: dateISO2 } },
  //             ],
  //           },
  //       },
  //         {
  //           $lookup: {
  //             from: 'vaccinations',
  //             localField: 'id',
  //             foreignField: 'sourceBottle',
  //             as: 'vaccinationsDoneWithVaccine',
  //           },
  //         },
  //         {
  //           $unwind: '$vaccinationsWithVaccine',
  //         },
  //       ]);
  //       console.log(response.length);
  //       return response;
  //       */
  //     }
  //     return VaccineOrderModel.find({});
  //   }
}

const vaccineOrdersByProducerAndArrivedByDate = (
  vaccine: VaccineInput,
  arrivedByDate: string
) => {
  parseVaccineProducer(vaccine.vaccineProducer);
  if (!isDateString(arrivedByDate)) {
    throw new Error('invalid date format: ' + arrivedByDate);
  }
  const dateISO = new Date(arrivedByDate).toISOString();
  return VaccineOrderModel.find({
    $and: [
      {
        vaccine: { $in: [vaccine.vaccineProducer] },
      },
      { arrived: { $lte: dateISO } },
    ],
  });
};

const vaccineOrdersByProducer = (vaccine: VaccineInput) => {
  parseVaccineProducer(vaccine.vaccineProducer);
  return VaccineOrderModel.find({
    vaccine: { $in: [vaccine.vaccineProducer] },
  });
};

const vaccineOrdersArrivedByDate = (arrivedByDate: string) => {
  if (!isDateString(arrivedByDate)) {
    throw new Error('invalid date format: ' + arrivedByDate);
  }
  const dateISO = new Date(arrivedByDate).toISOString();
  return VaccineOrderModel.find({ arrived: { $lte: dateISO } });
};
