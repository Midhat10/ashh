import { configureStore } from "@reduxjs/toolkit";
import vacancyReducer from "../../reducers/VacancySlice.ts";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MantineProvider } from "@mantine/core";
import KeySkills from "./KeySkills.tsx";
import userEvent from "@testing-library/user-event";

const createMockStore = (initialSkills = ["TypeScript", "Javascript"]) =>
  configureStore({
    reducer: {
      vacancies: vacancyReducer,
    },
    preloadedState: {
      vacancies: {
        items: [],
        error: null,
        isLoading: false,
        text: "",
        area: "Все города" as "Все города" | "Москва" | "Санкт-Петербург",
        skill_set: initialSkills,
      },
    },
  });

describe("render keySkills", () => {
  it("should render existing skills, allow adding a new one, and allow removing", async () => {
    const store = createMockStore(["TypeScript", "Javascript"]);
    const dispatchSpy = vi.spyOn(store, "dispatch");
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <MantineProvider>
          <KeySkills />
        </MantineProvider>
      </Provider>,
    );

    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Javascript")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Навык");
    expect(input).toBeInTheDocument();
    const buttonPlus = screen.getByText("+");
    expect(buttonPlus).toBeInTheDocument();
    expect(input).toHaveValue("");

    await user.type(input, "React");

    expect(input).toHaveValue("React");

    await user.click(buttonPlus);

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: "vacancies/addSkill",
      payload: "React",
    });

    expect(screen.getByText("React")).toBeInTheDocument();

    const badge = screen.getByText("TypeScript").closest("span");
    expect(badge).toBeInTheDocument();
    const closeBtn =
      badge?.querySelector("button") || screen.getAllByRole("button")[0];
    expect(closeBtn).toBeInTheDocument();

    await user.click(closeBtn);

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: "vacancies/removeSkill",
      payload: "TypeScript",
    });
  });
});
