import { configureStore } from "@reduxjs/toolkit";
import type { VacancyItem } from "../../vite-env";
import vacancyReducer from "../../reducers/VacancySlice.ts";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MantineProvider } from "@mantine/core";
import ListOfVacancies from "./ListOfVacancies.tsx";
import { BrowserRouter } from "react-router-dom";

const generateMockVacancies = (count: number): VacancyItem[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: String(index + 1),
    name: `Разработчик ${index + 1}`,
    experience: { id: "between1And3", name: "От 1 года до 3 лет" },
    employer: { name: "Тестовая Компания" },
    schedule: { id: "fullDay", name: "Полный день" },
    address: { city: "Москва", street: "", building: "" },
    salary_range: null,
    alternate_url: "https://hh.ru",
    apply_alternate_url: "https://hh.ru",
  })) as unknown as VacancyItem[];
};

const createMockStore = (preloadedItems: VacancyItem[]) =>
  configureStore({
    reducer: {
      vacancies: vacancyReducer,
    },
    preloadedState: {
      vacancies: {
        items: preloadedItems,
        isLoading: false,
        error: null,
        text: "",
        search_field: "all",
        area: "all" as "Москва" | "Санкт-Петербург" | "Все города",
        skill_set: [],
      },
    },
  });

describe("render ListOfVacancies", () => {
  it("should render 5 items per page and hanlde pagination correctly", async () => {
    const mockVacancies = generateMockVacancies(7);
    const store = createMockStore(mockVacancies);

    const user = userEvent.setup();

    render(
      <BrowserRouter basename="/">
        <Provider store={store}>
          <MantineProvider forceColorScheme="light">
            <ListOfVacancies />
          </MantineProvider>
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText("Разработчик 1")).toBeInTheDocument();
    expect(screen.getByText("Разработчик 5")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: "2" });
    expect(button).toBeInTheDocument();

    await user.click(button);

    expect(screen.queryByText("Разработчик 5")).not.toBeInTheDocument();

    expect(screen.getByText("Разработчик 6")).toBeInTheDocument();
  });
  it("should display items, who less than 5 items and without pagination", () => {
    const store = createMockStore(generateMockVacancies(4));

    render(
      <BrowserRouter basename="/">
        <Provider store={store}>
          <MantineProvider forceColorScheme="light">
            <ListOfVacancies />
          </MantineProvider>
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText("Разработчик 1")).toBeInTheDocument();
    expect(screen.getByText("Разработчик 4")).toBeInTheDocument();

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
  it("should display empty state placeholder when items list is empty", () => {
    const store = createMockStore([]);

    render(
      <BrowserRouter basename="/">
        <Provider store={store}>
          <MantineProvider forceColorScheme="light">
            <ListOfVacancies />
          </MantineProvider>
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText("Ничего не найдено")).toBeInTheDocument();
    expect(
      screen.getByText(/Попробуйте изменить параметры/i),
    ).toBeInTheDocument();

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
