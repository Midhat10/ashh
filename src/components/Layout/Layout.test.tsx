import { AppShell, MantineProvider } from "@mantine/core";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import Layout from "./Layout";
import { BrowserRouter } from "react-router-dom";

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
      <BrowserRouter
        basename="/"
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Provider store={store}>
          <MantineProvider forceColorScheme="light">
            <AppShell>
              <Layout />
            </AppShell>
          </MantineProvider>
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(".FrontEnd")).toBeInTheDocument();
    expect(screen.getByText("Вакансии FE")).toBeInTheDocument();
    expect(screen.getByText("Обо мне")).toBeInTheDocument();
  });
});
