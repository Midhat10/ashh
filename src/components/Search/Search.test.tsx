import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { AppShell, MantineProvider } from "@mantine/core";
import Search from "./Search";
import { render, screen } from "@testing-library/react";
import vacancyReducer from "../../reducers/VacancySlice";
import { userEvent } from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

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

    render(
      <BrowserRouter basename="/">
        <Provider store={store}>
          <MantineProvider forceColorScheme="light">
            <AppShell>
              <Search
                setSearchParams={setSearchParamsMock}
                area=""
                vacancy=""
                skillset=""
              />
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

    expect(setSearchParamsMock).toHaveBeenCalledWith({
      vacancy: "Frontend",
    });
  });
});
