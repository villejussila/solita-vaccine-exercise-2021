import { prop, getModelForClass } from '@typegoose/typegoose';
import { isDateString } from 'class-validator';
import {
  Arg,
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
  Root,
} from 'type-graphql';

import { getExpirationDate } from '../utils/date';

import { Vaccination } from './vaccination';

@ObjectType()
export class VaccineOrder {
  @Field()
  @prop({ required: true })
  id!: string;

  @Field(() => Int)
  @prop({ required: true })
  orderNumber!: number;

  @Field()
  @prop({ required: true })
  responsiblePerson!: string;

  @Field()
  @prop({ required: true })
  healthCareDistrict!: string;

  @Field()
  @prop({ required: true })
  vaccine!: Vaccine;

  @Field(() => Int)
  @prop({ required: true })
  injections!: number;

  @Field()
  @prop({ required: true })
  arrived!: string;

  @Field(() => [Vaccination], { nullable: true })
  vaccinationsDoneWithVaccine!: [Vaccination];

  @Field({ nullable: true })
  bottleExpires(@Root() root: VaccineOrder): string {
    return getExpirationDate(root.arrived);
  }
  @Field({ nullable: true })
  isBottleExpiredOnDate(@Root() root: VaccineOrder, @Arg('date') date: string): boolean {
    const expirationDate = getExpirationDate(root.arrived);
    if (!isDateString(date)) {
      throw new Error('invalid date format: ' + date);
    }
    if (date >= expirationDate) {
      return true;
    }
    return false;
  }
}

export const VaccineOrderModel = getModelForClass(VaccineOrder);

export enum Vaccine {
  ANTIQUA = 'Antiqua',
  ZERPFY = 'Zerpfy',
  SOLAR_BUDDHICA = 'SolarBuddhica',
}
registerEnumType(Vaccine, {
  name: 'Vaccine',
  description: 'Vaccine producers',
});

@InputType()
export class VaccineInput {
  @Field()
  vaccineProducer!: Vaccine;
}
