import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MantineProvider } from "@mantine/core";
import vacancyReducer from "../../reducers/VacancySlice.ts";
import Vacancypage from "./Vacancypage";
import { mockVacancy } from "../../mocks/vacancies";
import type { VacancyItem } from "../../vite-env";

const createStoreMock = (initialState?: VacancyItem[]) =>
  configureStore({
    reducer: {
      vacancies: vacancyReducer,
    },
    preloadedState: initialState,
  });

describe("render notfoundpage", () => {
  it("renders vacancy details when item is found", () => {
    const store = createStoreMock({
      vacancies: {
        items: [mockVacancy],
      },
    });
    render(
      <MemoryRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
        initialEntries={[`/vacancies/${mockVacancy.id}`]}
      >
        <Provider store={store}>
          <MantineProvider>
            <Routes>
              <Route path="/vacancies/:id" element={<Vacancypage />} />
            </Routes>
          </MantineProvider>
        </Provider>
      </MemoryRouter>,
    );
    expect(screen.getByText(/требования/i)).toBeInTheDocument();
    expect(screen.getByText(/отвественность/i)).toBeInTheDocument();
  });
});
