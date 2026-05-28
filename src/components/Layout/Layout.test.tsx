import { AppShell, MantineProvider } from "@mantine/core";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import Layout from "./Layout";

const createStore = () =>
  configureStore({
    reducer: {
      vacancies: (state = {}) => state,
    },
  });

describe("render Layout", () => {
  it("should display with logo and titles", () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <MantineProvider forceColorScheme="light">
          <AppShell>
            <Layout />
          </AppShell>
        </MantineProvider>
      </Provider>,
    );

    expect(screen.getByText(".FrontEnd")).toBeInTheDocument();
    expect(screen.getByText("Вакансии FE")).toBeInTheDocument();
    expect(screen.getByText("Обо мне")).toBeInTheDocument();
  });
});
