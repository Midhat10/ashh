import { createContext, useContext } from "react";
import type { URLSearchParamsInit } from "react-router-dom";

export type VacancyContextType = {
  setSearchParams: (
    nextInit: URLSearchParamsInit,
    navigateOptions?: { replace?: boolean; state?: unknown },
  ) => void;
  searchParams: URLSearchParams;
  vacancy: string;
  skillset: string;
  area?: string;
};

export const ContextVacancy = createContext<VacancyContextType | null>(null);

export const useVacancyContext = () => {
  const context = useContext(ContextVacancy);
  if (!context) {
    throw new Error(
      "Ну и почему ты не использовал этот элемент в ContextVacancy?",
    );
  }
  return context;
};
