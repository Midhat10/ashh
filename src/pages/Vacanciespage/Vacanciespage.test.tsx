import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import vacancyReducer from "../../reducers/VacancySlice";
import AppShell from "./Vacanciespage";
import { BrowserRouter } from "react-router-dom";
import * as vacancyThunks from "../../reducers/VacancyThunk";

// ИСПРАВЛЕНИЕ: Мокаем Thunk так, чтобы сохранить его свойства pending/fulfilled/rejected
vi.mock("../../reducers/VacancyThunk", async (importOriginal) => {
  const original = await importOriginal<typeof vacancyThunks>();

  // Создаем мок-функцию, но копируем в неё свойства оригинального createAsyncThunk
  const mockFetch = vi.fn(() => ({ type: "vacancies/fetch/fulfilled" }));

  return {
    ...original,
    fetchVacancies: Object.assign(mockFetch, {
      pending: original.fetchVacancies.pending,
      fulfilled: original.fetchVacancies.fulfilled,
      rejected: original.fetchVacancies.rejected,
      typePrefix: original.fetchVacancies.typePrefix,
    }),
  };
});

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
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, "", "/");
  });

  it("should render successfully with all subcomponents", () => {
    const store = createTestStore();

    render(
      <BrowserRouter basename="/">
        <Provider store={store}>
          <MantineProvider forceColorScheme="light">
            <AppShell />
          </MantineProvider>
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText("Список вакансий")).toBeInTheDocument();
    expect(screen.getByText("Ключевые навыки")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Все города")).toBeInTheDocument();
  });

  it("should handle city selection and update URL search params", async () => {
    const store = createTestStore();
    const user = userEvent.setup();

    render(
      <BrowserRouter basename="/">
        <Provider store={store}>
          <MantineProvider forceColorScheme="light">
            <AppShell />
          </MantineProvider>
        </Provider>
      </BrowserRouter>,
    );

    const selectInputElement = screen.getByPlaceholderText("Все города");
    expect(selectInputElement).toBeInTheDocument();
    await user.click(selectInputElement);

    const moscowOption = screen.getByText("Москва");
    await user.click(moscowOption);

    // Проверяем, что изменился URL браузера
    expect(window.location.search).toContain(
      "area=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0",
    );
  });

  it("should display error message and retry button when error state is active", async () => {
    const store = createTestStore({
      error: "Не удалось получить данные",
      isLoading: false,
    });

    const dispatchSpy = vi.spyOn(store, "dispatch");
    const user = userEvent.setup();

    render(
      <BrowserRouter basename="/">
        <Provider store={store}>
          <MantineProvider forceColorScheme="light">
            <AppShell />
          </MantineProvider>
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/An error ocurred/i)).toBeInTheDocument();

    const retryButton = screen.getByRole("button", {
      name: "Повторить загрузку",
    });
    expect(retryButton).toBeInTheDocument();

    await user.click(retryButton);

    // Проверяем вызовы
    expect(dispatchSpy).toHaveBeenCalled();
    expect(vacancyThunks.fetchVacancies).toHaveBeenCalled();
  });
});
