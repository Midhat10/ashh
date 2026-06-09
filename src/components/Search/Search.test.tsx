import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { AppShell, MantineProvider } from "@mantine/core";
import Search from "./Search";
import { render, screen } from "@testing-library/react";
import vacancyReducer from "../../reducers/VacancySlice";
import { userEvent } from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ContextVacancy } from "../Context/Context.tsx"; // Импортируем ваш контекст

const createTestStore = () =>
  configureStore({
    reducer: {
      vacancies: vacancyReducer,
    },
  });

describe("render Search", () => {
  it("should update input value and call setSearchParams with correct filters on button click", async () => {
    const store = createTestStore();
    const user = userEvent.setup();

    const setSearchParamsMock = vi.fn();

    const initialUrlParams = new URLSearchParams("");

    render(
      <BrowserRouter
        basename="/"
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        <Provider store={store}>
          <MantineProvider forceColorScheme="light">
            <AppShell>
              <ContextVacancy.Provider
                value={{
                  searchParams: initialUrlParams,
                  setSearchParams: setSearchParamsMock,
                  vacancy: "",
                  skillset: "",
                  area: "Все города",
                }}
              >
                <Search />
              </ContextVacancy.Provider>
            </AppShell>
          </MantineProvider>
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText("Список вакансий")).toBeInTheDocument();
    expect(
      screen.getByText("по профессии Frontend-разработчик"),
    ).toBeInTheDocument();

    const input = screen.getByPlaceholderText(
      "Должность или название компании",
    ) as HTMLInputElement;
    const button = screen.getByRole("button", { name: "Найти" });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(input).toHaveValue("");

    await user.type(input, "Frontend");
    expect(input).toHaveValue("Frontend");

    await user.click(button);

    expect(setSearchParamsMock).toHaveBeenCalled();

    const firstArgument = setSearchParamsMock.mock.calls[0][0];

    const vacancyValue =
      firstArgument instanceof URLSearchParams
        ? firstArgument.get("vacancy")
        : firstArgument?.vacancy;

    expect(vacancyValue).toBe("Frontend");
  });
});
