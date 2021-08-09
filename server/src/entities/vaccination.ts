import { prop, getModelForClass } from '@typegoose/typegoose';
import { ObjectType, Field, registerEnumType } from 'type-graphql';
import { VaccineOrder } from './vaccineOrder';

@ObjectType()
export class Vaccination {
  @Field()
  @prop({ required: true })
  vaccinationId!: string;

  @Field()
  @prop({ required: true })
  sourceBottle!: string;

  @Field()
  @prop({ required: true })
  gender!: Gender;

  @Field()
  @prop({ required: true })
  vaccinationDate!: string;

  @Field(() => VaccineOrder, { nullable: true })
  vaccineOrder!: VaccineOrder;

}

export const VaccinationModel = getModelForClass(Vaccination);

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  NONBINARY = 'nonbinary',
}
registerEnumType(Gender, {
  name: 'Gender',
});
