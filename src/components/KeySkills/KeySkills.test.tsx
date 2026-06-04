import { configureStore } from "@reduxjs/toolkit";
import vacancyReducer from "../../reducers/VacancySlice.ts";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MantineProvider } from "@mantine/core";
import KeySkills from "./KeySkills.tsx";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

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
            <KeySkills
              setSearchParams={setSearchParamsMock}
              skillset="TypeScript,Javascript"
            />
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

    expect(setSearchParamsMock).toHaveBeenCalledWith(
      expect.objectContaining({}),
    );

    setSearchParamsMock.mockClear();

    const typeScriptPill =
      screen.getByText("TypeScript").closest(".mantine-Pill-root") ||
      screen.getByText("TypeScript").parentElement;
    const closeBtn =
      typeScriptPill?.querySelector("button") ||
      screen.getAllByRole("button")[0];

    expect(closeBtn).toBeInTheDocument();
    await user.click(closeBtn);
  });
});
