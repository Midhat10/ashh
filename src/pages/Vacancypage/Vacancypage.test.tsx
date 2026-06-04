import { configureStore } from "@reduxjs/toolkit";
import vacancyReducer from "../../reducers/VacancySlice.ts";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MantineProvider } from "@mantine/core";
import Vacancypage from "./Vacancypage";
import { mockVacancy } from "../../mocks/vacancies";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

type AllowedAreas = "Все города" | "Москва" | "Санкт-Петербург";

const createStoreMock = (initialItems = [mockVacancy]) =>
  configureStore({
    reducer: {
      vacancies: vacancyReducer,
    },
    preloadedState: {
      vacancies: {
        items: initialItems,
        isLoading: false,
        error: null,
        text: "",
        search_field: "all",
        area: "Все города" as AllowedAreas,
        skill_set: [] as string[],
      },
    },
  });

describe("Component: Vacancypage Integration", () => {
  it("renders vacancy details when item is found", () => {
    const store = createStoreMock([mockVacancy]);

    render(
      <MemoryRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
        initialEntries={[`/vacancies/${mockVacancy.id}`]}
      >
        <Provider store={store}>
          <MantineProvider forceColorScheme="light">
            <Routes>
              <Route path="/vacancies/:id" element={<Vacancypage />} />
            </Routes>
          </MantineProvider>
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/требования/i)).toBeInTheDocument();
    expect(screen.getByText(/ответственность/i)).toBeInTheDocument();
  });
});
