import { configureStore } from "@reduxjs/toolkit";
import vacancyReducer from "../../reducers/VacancySlice.ts";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MantineProvider } from "@mantine/core";
import Vacancypage from "./Vacancypage";
import { mockVacancy } from "../../mocks/vacancies";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import * as vacancyThunks from "../../reducers/VacancyThunk";

vi.mock("../../reducers/VacancyThunk", async (importOriginal) => {
  const original = await importOriginal<typeof vacancyThunks>();
  const mockFetchById = vi.fn(() => ({
    type: "vacancies/fetchVacancyById/fulfilled",
    payload: mockVacancy,
  }));

  return {
    ...original,
    fetchVacancyById: Object.assign(mockFetchById, {
      pending: original.fetchVacancyById.pending,
      fulfilled: original.fetchVacancyById.fulfilled,
      rejected: original.fetchVacancyById.rejected,
      typePrefix: original.fetchVacancyById.typePrefix,
    }),
  };
});

type AllowedAreas = "Все города" | "Москва" | "Санкт-Петербург";

const createStoreMock = (initialVacancy = mockVacancy) =>
  configureStore({
    reducer: {
      vacancies: vacancyReducer,
    },
    preloadedState: {
      vacancies: {
        items: [],
        currentVacancy: initialVacancy,
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
  it("renders vacancy details when item is found in currentVacancy state", async () => {
    const store = createStoreMock(mockVacancy);

    render(
      <MemoryRouter initialEntries={[`/vacancies/${mockVacancy.id}`]}>
        <Provider store={store}>
          <MantineProvider forceColorScheme="light">
            <Routes>
              <Route path="/vacancies/:id" element={<Vacancypage />} />
            </Routes>
          </MantineProvider>
        </Provider>
      </MemoryRouter>,
    );

    const requirementsLabel = await screen.findByText((content) =>
      content.toLowerCase().includes("требования"),
    );
    expect(requirementsLabel).toBeInTheDocument();

    const responsibilityLabel = await screen.findByText((content) =>
      content.toLowerCase().includes("ответственность"),
    );
    expect(responsibilityLabel).toBeInTheDocument();
  });
});
