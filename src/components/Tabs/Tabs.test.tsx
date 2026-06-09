import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import {
  createMemoryRouter,
  MemoryRouter,
  RouterProvider,
} from "react-router-dom";
import TabsVacancy from "./Tabs";
import { ContextVacancy } from "../Context/Context";

describe("Component: TabsVacancy", () => {
  const setSearchParamsMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderTabsWithContext = (
    area: "Москва" | "Санкт-Петербург",
    searchString = "vacancy=Frontend",
  ) => {
    const searchParams = new URLSearchParams(searchString);
    const user = userEvent.setup();

    // Создаем тестовые маршруты, чтобы проверить, куда navigate переключает вкладки
    const routes = [
      {
        path: "/vacancies/:city",
        element: <TabsVacancy />,
        children: [
          {
            index: true,
            element: <div data-testid="outlet-content">Контент аутлета</div>,
          },
        ],
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: [
        `/vacancies/${area === "Москва" ? "moscow" : "petersburg"}?${searchString}`,
      ],
      future: { v7_relativeSplatPath: true },
    });

    const navigateSpy = vi.spyOn(router, "navigate");

    render(
      <MantineProvider forceColorScheme="light">
        <ContextVacancy.Provider
          value={{
            searchParams,
            setSearchParams: setSearchParamsMock,
            vacancy: searchParams.get("vacancy") || "",
            skillset: searchParams.get("skillset") || "",
            area,
          }}
        >
          <RouterProvider
            router={router}
            future={{ v7_startTransition: true }}
          />
        </ContextVacancy.Provider>
      </MantineProvider>,
    );

    return { user, navigateSpy };
  };

  it("should render tabs successfully and set active tab to moscow based on context area", () => {
    renderTabsWithContext("Москва");

    const moscowTab = screen.getByRole("tab", { name: "Москва" });
    const spbTab = screen.getByRole("tab", { name: "Санкт-Петербург" });

    expect(moscowTab).toBeInTheDocument();
    expect(spbTab).toBeInTheDocument();

    expect(moscowTab).toHaveAttribute("aria-selected", "true");
    expect(spbTab).toHaveAttribute("aria-selected", "false");
    expect(screen.getByTestId("outlet-content")).toBeInTheDocument();
  });

  it("should set active tab to petersburg based on context area", () => {
    renderTabsWithContext("Санкт-Петербург");

    const moscowTab = screen.getByRole("tab", { name: "Москва" });
    const spbTab = screen.getByRole("tab", { name: "Санкт-Петербург" });

    expect(spbTab).toHaveAttribute("aria-selected", "true");
    expect(moscowTab).toHaveAttribute("aria-selected", "false");
  });

  it("should navigate to correct url and preserve search params when tab is changed", async () => {
    const { user, navigateSpy } = renderTabsWithContext(
      "Москва",
      "vacancy=React&skillset=TS",
    );

    const spbTab = screen.getByRole("tab", { name: "Санкт-Петербург" });

    await user.click(spbTab);

    expect(navigateSpy).toHaveBeenCalledWith(
      "/vacancies/petersburg?vacancy=React&skillset=TS",
      expect.objectContaining({
        state: {
          search: "vacancy=React&skillset=TS",
        },
      }),
    );
  });

  it("should throw an error if used outside of ContextVacancy Provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    let thrownError: unknown = null;

    class TestErrorBoundary extends React.Component<{
      children: React.ReactNode;
    }> {
      componentDidCatch(error: unknown) {
        thrownError = error as Error;
      }
      render() {
        return this.props.children;
      }
    }

    render(
      <MantineProvider forceColorScheme="light">
        <TestErrorBoundary>
          <MemoryRouter>
            <TabsVacancy />
          </MemoryRouter>
        </TestErrorBoundary>
      </MantineProvider>,
    );

    expect(thrownError).not.toBeNull();
    expect(thrownError).toBeInstanceOf(Error);
    if (thrownError instanceof Error) {
      expect(thrownError.message).toContain("Where is the context?");
    } else {
      // Если вдруг упало что-то другое, тест должен гарантированно провалиться
      assert.fail("Пойманный объект не является экземпляром класса Error");
    }

    consoleSpy.mockRestore();
  });
});
