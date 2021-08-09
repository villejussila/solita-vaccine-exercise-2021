import { createVaccinationLoader } from "../loaders/VaccinationLoader";

export interface MyContext {
  vaccinationLoader: ReturnType<typeof createVaccinationLoader>;
}