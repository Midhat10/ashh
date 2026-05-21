import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchVacations } from "./VacationThunk";
import type { VacancyItem } from "../vite-env";

type VacationsStateType = {
  items: VacancyItem[];
  error: string | null;
  isLoading: boolean;
  text: string;
  area: "Все города" | "Москва" | "Санкт-Петербург";
  skill_set: string[];
};

const initialState: VacationsStateType = {
  items: [],
  isLoading: false,
  error: null,
  text: "",
  area: "Все города",
  skill_set: ["TypeScript", "React", "Redux"],
};

const VacationSlice = createSlice({
  name: "vacations",
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
      .addCase(fetchVacations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVacations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchVacations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Ошибка";
        state.items = [];
      });
  },
});

export const { addSkill, removeSkill, setArea, setText } =
  VacationSlice.actions;
export default VacationSlice.reducer;
