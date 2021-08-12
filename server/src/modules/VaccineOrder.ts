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

import { getStartOfDayISO, getEndOfDayISO } from '../utils/date';
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
    @Arg('vaccine', { nullable: true }) vaccine?: VaccineInput
  ): Promise<VaccineOrder[]> {
    if (vaccine) {
      return vaccineOrdersByProducer(vaccine);
    }
    return VaccineOrderModel.find({});
  }

  @Query((_returns) => [VaccineOrder])
  async vaccineOrdersArrivedByDate(
    @Arg('date', { nullable: false }) date: string,
    @Arg('vaccine', { nullable: true }) vaccine?: VaccineInput
  ): Promise<DocumentType<VaccineOrder, BeAnObject>[]> {
    if (vaccine && date) {
      return vaccineOrdersByProducerAndArrivedByDate(vaccine, date);
    }
    return vaccineOrdersArrivedByDate(date);
  }
  @Query((_returns) => [VaccineOrder])
  async vaccineOrdersArrivedOnDate(
    @Arg('date', { nullable: false }) date: string,
    @Arg('vaccine', { nullable: true }) vaccine?: VaccineInput
  ): Promise<DocumentType<VaccineOrder, BeAnObject>[]> {
    console.log(date);
    if (vaccine && date) {
      return vaccineOrdersByProducerAndArrivedOnDate(vaccine, date);
    }
    return vaccineOrdersArrivedOnDate(date);
  }
}

const vaccineOrdersByProducerAndArrivedOnDate = (
  vaccine: VaccineInput,
  date: string
) => {
  parseVaccineProducer(vaccine.vaccineProducer);
  if (!isDateString(date)) {
    throw new Error('invalid date format: ' + date);
  }
  let dateISO = new Date(date).toISOString();
  const dayStartISO = getStartOfDayISO(date);
  if (dateISO === dayStartISO) {
    dateISO = getEndOfDayISO(date);
  }
  return VaccineOrderModel.find({
    $and: [
      {
        vaccine: { $in: [vaccine.vaccineProducer] },
      },
      {
        $and: [
          { arrived: { $gt: dayStartISO } },
          { arrived: { $lte: dateISO } },
        ],
      },
    ],
  });
};

const vaccineOrdersByProducerAndArrivedByDate = (
  vaccine: VaccineInput,
  date: string
) => {
  parseVaccineProducer(vaccine.vaccineProducer);
  if (!isDateString(date)) {
    throw new Error('invalid date format: ' + date);
  }
  const dateISO = new Date(date).toISOString();
  console.log(`by date: ${dateISO}`);
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

const vaccineOrdersArrivedByDate = (date: string) => {
  if (!isDateString(date)) {
    throw new Error('invalid date format: ' + date);
  }
  const dateISO = new Date(date).toISOString();
  console.log(JSON.stringify(dateISO));
  return VaccineOrderModel.find({ arrived: { $lte: dateISO } });
};

const vaccineOrdersArrivedOnDate = (date: string) => {
  if (!isDateString(date)) {
    throw new Error('invalid date format: ' + date);
  }
  let dateISO = new Date(date).toISOString();
  const dayStartISO = getStartOfDayISO(date);
  if (dateISO === dayStartISO) {
    dateISO = getEndOfDayISO(date);
  }

  return VaccineOrderModel.find({
    $and: [{ arrived: { $gt: dayStartISO } }, { arrived: { $lte: dateISO } }],
  });
};
