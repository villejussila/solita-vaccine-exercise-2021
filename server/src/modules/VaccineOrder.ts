import { isDateString } from 'class-validator';
import { Arg, Int, Query, Resolver } from 'type-graphql';
import {
  VaccineInput,
  VaccineOrder,
  VaccineOrderModel,
} from '../entities/vaccineOrder';
import { parseVaccineProducer } from '../utils/validation';

@Resolver()
export class VaccineOrderResolver {
  @Query((_returns) => Int)
  async vaccineOrderCount() {
    return VaccineOrderModel.collection.countDocuments();
  }

  @Query((_returns) => [VaccineOrder])
  async allVaccineOrders(
    @Arg('vaccine', { nullable: true }) vaccine?: VaccineInput,
    @Arg('arrivedByDate', { nullable: true }) arrivedByDate?: string
  ) {
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
}

// Helpers
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
