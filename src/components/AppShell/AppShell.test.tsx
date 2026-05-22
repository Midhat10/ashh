import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import vacancyReducer from "../../reducers/VacancySlice";
import AppShell from "./AppShell";

const createTestStore = (initialVacanciesState = {}) =>
  configureStore({
    reducer: {
      vacancies: vacancyReducer,
    },
    preloadedState: {
      vacancies: {
        items: [],
        isLoading: false,
        error: null,
        text: "",
        search_field: "all",
        area: "Все города" as "Все города" | "Москва" | "Санкт-Петербург",
        skill_set: ["TypeScript", "React"],
        ...initialVacanciesState,
      },
    },
  });

describe("Component: AppShell Integration", () => {
  it("should render successfully with all subcomponents", () => {
    const store = createTestStore();

    render(
      <Provider store={store}>
        <MantineProvider forceColorScheme="light">
          <AppShell />
        </MantineProvider>
      </Provider>,
    );

    expect(screen.getByText("Список вакансий")).toBeInTheDocument();
    expect(screen.getByText("Ключевые навыки")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Все города")).toBeInTheDocument();
  });

  it("should handle city selection and dispatch setArea action", async () => {
    const store = createTestStore();
    const dispatchSpy = vi.spyOn(store, "dispatch");
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <MantineProvider forceColorScheme="light">
          <AppShell />
        </MantineProvider>
      </Provider>,
    );

    const selectInputElement = screen.getByPlaceholderText("Все города");
    expect(selectInputElement).toBeInTheDocument();
    await user.click(selectInputElement);

    const moscowOption = screen.getByText("Москва");
    await user.click(moscowOption);

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "vacancies/setArea",
        payload: "Москва",
      }),
    );
  });

  it("should display error message and retry button when error state is active", async () => {
    const store = createTestStore({
      error: "Не удалось получить данные",
      isLoading: false,
    });

    const dispatchSpy = vi
      .spyOn(store, "dispatch")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockImplementation((action: any) => {
        if (typeof action === "function") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return Promise.resolve() as any;
        }

        return store.dispatch(action);
      });

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <MantineProvider forceColorScheme="light">
          <AppShell />
        </MantineProvider>
      </Provider>,
    );

    expect(screen.getByText(/An error ocurred/i)).toBeInTheDocument();

    const retryButton = screen.getByRole("button", {
      name: "Повторить загрузку",
    });
    expect(retryButton).toBeInTheDocument();

    await user.click(retryButton);

    expect(dispatchSpy).toHaveBeenCalled();
  });
});
