import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchVacancies, fetchVacancyById } from "./VacancyThunk";
import type { VacancyItem } from "../vite-env";

type VacanciesStateType = {
  currentVacancy: VacancyItem | null;
  items: VacancyItem[];
  error: string | null;
  isLoading: boolean;
  text: string;
  area: "Все города" | "Москва" | "Санкт-Петербург";
  skill_set: string[];
};

export const initialState: VacanciesStateType = {
  currentVacancy: null,
  items: [],
  isLoading: false,
  error: null,
  text: "",
  area: "Все города",
  skill_set: ["TypeScript", "React", "Redux"],
};

const VacancySlice = createSlice({
  name: "vacancies",
  initialState,
  reducers: {
    setText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    },
    setArea: (
      state,
      action: PayloadAction<"Все города" | "Москва" | "Санкт-Петербург">,
    ) => {
      state.area = action.payload;
    },
    addSkill: (state, action: PayloadAction<string>) => {
      const cleanSkill = action.payload.trim();
      if (cleanSkill && !state.skill_set.includes(cleanSkill)) {
        state.skill_set.push(cleanSkill);
      }
    },
    removeSkill: (state, action: PayloadAction<string>) => {
      state.skill_set = state.skill_set.filter(
        (skill) => skill !== action.payload,
      );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchVacancies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVacancies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchVacancies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Ошибка";
        state.items = [];
      })
      .addCase(fetchVacancyById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentVacancy = null;
      })
      .addCase(fetchVacancyById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentVacancy = action.payload;
      })
      .addCase(fetchVacancyById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Произошла ошибка";
      });
  },
});

export const { addSkill, removeSkill, setArea, setText } = VacancySlice.actions;
export default VacancySlice.reducer;
