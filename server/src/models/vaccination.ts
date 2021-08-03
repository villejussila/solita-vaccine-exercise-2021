import mongoose from 'mongoose';

interface Vaccination {
  vaccinationId: string;
  sourceBottle: string;
  gender: string;
  vaccinationDate: string;
}

const schema = new mongoose.Schema<Vaccination>({
  vaccinationId: String,
  sourceBottle: String,
  gender: String,
  vaccinationDate: String,
});

export default mongoose.model<Vaccination>('Vaccination', schema);
