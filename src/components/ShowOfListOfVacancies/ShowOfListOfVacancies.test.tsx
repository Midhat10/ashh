import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import vacancyReducer from "../../reducers/VacancySlice";
import ShowOfListOfVacancies from "./ShowOfListOfVacancies";
import { ContextVacancy } from "../Context/Context";
import * as vacancyThunks from "../../reducers/VacancyThunk";

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

vi.mock("../ListOfVacations/ListOfVacancies", () => ({
  default: () => (
    <div data-testid="mock-list-of-vacancies">Список вакансий отрендерился</div>
  ),
}));

type AllowedAreas = "Все города" | "Москва" | "Санкт-Петербург";

const createTestStore = (initialState = {}) =>
  configureStore({
    reducer: {
      vacancies: vacancyReducer,
    },
    preloadedState: {
      vacancies: {
        items: [],
        currentVacancy: null,
        isLoading: false,
        error: null,
        text: "",
        search_field: "all",
        area: "Все города" as AllowedAreas,
        skill_set: [],
        ...initialState,
      },
    },
  });

describe("Component: ShowOfListOfVacancies", () => {
  const mockSearchParams = new URLSearchParams("");
  const setSearchParamsMock = vi.fn();

  const defaultContextValue = {
    searchParams: mockSearchParams,
    setSearchParams: setSearchParamsMock,
    vacancy: "Frontend",
    skillset: "React,TypeScript",
    area: "Москва" as AllowedAreas,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state when isLoading is true", () => {
    const store = createTestStore({ isLoading: true });

    render(
      <Provider store={store}>
        <ContextVacancy.Provider value={defaultContextValue}>
          <ShowOfListOfVacancies />
        </ContextVacancy.Provider>
      </Provider>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(
      screen.queryByTestId("mock-list-of-vacancies"),
    ).not.toBeInTheDocument();
  });

  it("should render list of vacancies when there is no error and loading is finished", () => {
    const store = createTestStore({ isLoading: false, error: null });

    render(
      <Provider store={store}>
        <ContextVacancy.Provider value={defaultContextValue}>
          <ShowOfListOfVacancies />
        </ContextVacancy.Provider>
      </Provider>,
    );

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.getByTestId("mock-list-of-vacancies")).toBeInTheDocument();
  });

  it("should display error message and dispatch fetchVacancies on retry button click", async () => {
    const store = createTestStore({
      isLoading: false,
      error: "Ошибка сервера",
    });

    const dispatchSpy = vi.spyOn(store, "dispatch");
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <ContextVacancy.Provider value={defaultContextValue}>
          <ShowOfListOfVacancies />
        </ContextVacancy.Provider>
      </Provider>,
    );

    expect(
      screen.getByText(/An error ocurred:Ошибка сервера/i),
    ).toBeInTheDocument();

    const retryButton = screen.getByRole("button", {
      name: "Повторить загрузку",
    });
    expect(retryButton).toBeInTheDocument();
    await user.click(retryButton);

    expect(dispatchSpy).toHaveBeenCalled();
    expect(vacancyThunks.fetchVacancies).toHaveBeenCalledWith({
      text: "Frontend",
      area: "Москва",
      skill_set: ["React", "TypeScript"],
    });
  });

  it("should throw an error if used outside of ContextVacancy Provider", () => {
    const store = createTestStore();

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(
        <Provider store={store}>
          <ShowOfListOfVacancies />
        </Provider>,
      );
    }).toThrow("Without context");

    consoleSpy.mockRestore();
  });
});
