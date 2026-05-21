/// <reference types="vite/client" />
import { VACANCIES } from "./mocks/vacancies";
type VacanciesApiResponse = typeof VACANCIES;
type VacancyItem = (typeof VACANCIES)["items"][number];
