import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { mockVacancy } from "../../mocks/vacancies";
import Vacancy from "./Vacancy";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";

describe("render Vacancy", () => {
  const clickFn = vi.fn();
  it("we have all values for this vacancy and click on button", () => {
    render(
      <BrowserRouter
        basename="/"
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <MantineProvider forceColorScheme="light">
          <Vacancy vacancy={mockVacancy} onApply={clickFn} isFullPage={false} />
        </MantineProvider>
      </BrowserRouter>,
    );

    const button = screen.getByText("Откликнуться");
    expect(screen.getByText("DevOps Engineer")).toBeInTheDocument();
    expect(screen.getByText("От 1 до 3 лет")).toBeInTheDocument();
    expect(screen.getByText("2ГИС")).toBeInTheDocument();
    expect(screen.getByText("Новосибирск")).toBeInTheDocument();
    expect(screen.getByText("Смотреть вакансию")).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(clickFn).toHaveBeenCalledTimes(0);
    fireEvent.click(button);
    expect(clickFn).toHaveBeenCalledTimes(1);
  });
});
