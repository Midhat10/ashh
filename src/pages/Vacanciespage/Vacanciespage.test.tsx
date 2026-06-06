import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import vacancyReducer from "../../reducers/VacancySlice";
import AppShell from "./Vacanciespage";
import { MemoryRouter, useLocation } from "react-router-dom"; // Заменили BrowserRouter на MemoryRouter
import * as vacancyThunks from "../../reducers/VacancyThunk";

// Мокаем Thunk так, чтобы сохранить его свойства pending/fulfilled/rejected для extraReducers
vi.mock("../../reducers/VacancyThunk", async (importOriginal) => {
  const original = await importOriginal<typeof vacancyThunks>();
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

// Вспомогательный компонент-шпион для безопасного тестирования URL внутри MemoryRouter
const LocationTracker = () => {
  const location = useLocation();
  return <div data-testid="url-debugger">{location.search}</div>;
};

const createTestStore = (initialVacanciesState = {}) =>
  configureStore({
    reducer: {
      vacancies: vacancyReducer,
    },
    preloadedState: {
      vacancies: {
        currentVacancy: null,
        items: [],
        isLoading: false,
        error: null,
        text: "",
        search_field: "all",
        area: "Все города" as "Все города" | "Москва" | "Санкт-Петербург",
        skill_set: [],
        ...initialVacanciesState,
      },
    },
  });

describe("Component: AppShell Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render successfully with all subcomponents", () => {
    const store = createTestStore();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Provider store={store}>
          <MantineProvider forceColorScheme="light">
            <AppShell />
          </MantineProvider>
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText("Список вакансий")).toBeInTheDocument();
    expect(screen.getByText("Ключевые навыки")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Все города")).toBeInTheDocument();
  });

  it("should read initial filters from URL parameters and display them", async () => {
    const store = createTestStore();

    render(
      <MemoryRouter
        initialEntries={[
          "/vacancies?vacancy=Frontend&area=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&skillset=React,TypeScript",
        ]}
      >
        <Provider store={store}>
          <MantineProvider forceColorScheme="light">
            <AppShell />
          </MantineProvider>
        </Provider>
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText(
      "Должность или название компании",
    );
    expect(input).toHaveValue("Frontend");

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("should dispatch fetchVacancies with correct parameters parsed from URL", () => {
    const store = createTestStore();

    render(
      <MemoryRouter
        initialEntries={[
          "/vacancies?vacancy=Frontend&area=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&skillset=React",
        ]}
      >
        <Provider store={store}>
          <MantineProvider forceColorScheme="light">
            <AppShell />
          </MantineProvider>
        </Provider>
      </MemoryRouter>,
    );

    expect(vacancyThunks.fetchVacancies).toHaveBeenCalledWith({
      text: "Frontend",
      area: "Москва",
      skill_set: ["React"],
    });
  });

  it("should handle city selection and update URL search params safely", async () => {
    const store = createTestStore();
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Provider store={store}>
          <MantineProvider forceColorScheme="light">
            <AppShell />
            <LocationTracker />
          </MantineProvider>
        </Provider>
      </MemoryRouter>,
    );

    const selectInputElement = screen.getByPlaceholderText("Все города");
    expect(selectInputElement).toBeInTheDocument();
    await user.click(selectInputElement);

    const moscowOption = screen.getByText("Москва");
    await user.click(moscowOption);

    // Проверяем изменение виртуального URL через наш отслеживающий компонент
    const urlDebugger = screen.getByTestId("url-debugger");
    expect(urlDebugger.textContent).toContain(
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
      <MemoryRouter initialEntries={["/"]}>
        <Provider store={store}>
          <MantineProvider forceColorScheme="light">
            <AppShell />
          </MantineProvider>
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/An error ocurred/i)).toBeInTheDocument();

    const retryButton = screen.getByRole("button", {
      name: "Повторить загрузку",
    });
    expect(retryButton).toBeInTheDocument();

    await user.click(retryButton);

    expect(dispatchSpy).toHaveBeenCalled();
    expect(vacancyThunks.fetchVacancies).toHaveBeenCalled();
  });
});
