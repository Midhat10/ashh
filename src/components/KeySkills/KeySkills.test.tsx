import { configureStore } from "@reduxjs/toolkit";
import vacancyReducer from "../../reducers/VacancySlice.ts";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MantineProvider } from "@mantine/core";
import KeySkills from "./KeySkills.tsx";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ContextVacancy } from "../Context/Context.tsx";

const createMockStore = () =>
  configureStore({
    reducer: {
      vacancies: vacancyReducer,
    },
  });

describe("render keySkills", () => {
  it("should render existing skills, allow adding a new one, and allow removing", async () => {
    const store = createMockStore();
    const user = userEvent.setup();

    const setSearchParamsMock = vi.fn();

    const initialUrlParams = new URLSearchParams(
      "?skillset=TypeScript,Javascript",
    );

    render(
      <BrowserRouter
        basename="/"
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Provider store={store}>
          <MantineProvider>
            <ContextVacancy.Provider
              value={{
                searchParams: initialUrlParams,
                setSearchParams: setSearchParamsMock,
                vacancy: "",
                skillset: "TypeScript,Javascript",
                area: "Все города",
              }}
            >
              <KeySkills />
            </ContextVacancy.Provider>
          </MantineProvider>
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Javascript")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Навык");
    const buttonPlus = screen.getByText("+");

    expect(input).toBeInTheDocument();
    expect(buttonPlus).toBeInTheDocument();
    expect(input).toHaveValue("");

    await user.type(input, "React");
    expect(input).toHaveValue("React");
    await user.click(buttonPlus);

    const firstCallArgs = setSearchParamsMock.mock
      .calls[0][0] as URLSearchParams;
    expect(firstCallArgs.get("skillset")).toBe("TypeScript,Javascript,React");

    setSearchParamsMock.mockClear();

    const typeScriptPill =
      screen.getByText("TypeScript").closest(".mantine-Pill-root") ||
      screen.getByText("TypeScript").parentElement;
    const closeBtn =
      typeScriptPill?.querySelector("button") ||
      screen.getAllByRole("button")[0];

    expect(closeBtn).toBeInTheDocument();
    await user.click(closeBtn);

    const secondCallArgs = setSearchParamsMock.mock
      .calls[0][0] as URLSearchParams;
    expect(secondCallArgs.get("skillset")).toBe("Javascript");
  });
});
