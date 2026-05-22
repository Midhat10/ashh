import { createAsyncThunk } from "@reduxjs/toolkit";
import { VACANCIES } from "../mocks/vacancies";
import type { VacancyItem } from "../vite-env";

type SeacrParams = {
  text: string;
  area: "Все города" | "Москва" | "Санкт-Петербург";
  skill_set: string[];
};

export const fetchVacancies = createAsyncThunk<
  VacancyItem[],
  SeacrParams,
  { rejectValue: string }
>("vacancies/fetchVacancies", async (params, { rejectWithValue }) => {
  try {
    const { text, area, skill_set } = params;
    const data = await new Promise<VacancyItem[]>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() <= 0.1) {
          reject(new Error("Мы не получили данных"));
        }

        const filtredItems = VACANCIES.items.filter((vacancy) => {
          if (area !== "Все города" && vacancy.area.name !== area && area) {
            return false;
          }

          const requirement = vacancy?.snippet?.requirement.toLowerCase() || "";
          const responsibility =
            vacancy?.snippet?.responsibility.toLowerCase() || "";
          const combinedSpecs = `${requirement} ${responsibility}`;

          const matchesSkills = skill_set.every((skill) =>
            combinedSpecs.includes(skill.toLowerCase()),
          );
          if (!matchesSkills) return false;

          if (!text.trim()) return true;

          const query = text.toLowerCase().trim();
          const vacancyName = vacancy.name.toLowerCase() || "";
          const companyName = vacancy.employer.name.toLowerCase() || "";

          return vacancyName.includes(query) || companyName.includes(query);
        });

        resolve(filtredItems);
      }, 1000);
    });
    return data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
