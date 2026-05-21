import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { mockVacancy } from "../../mocks/vacancies";
import Vacancy from "./Vacancy";

describe("render Vacancy", () => {
  it("we have all values for this vacancy", () => {
    render(<Vacancy vacancy={mockVacancy} />);
    expect(screen.getByText("DevOps Engineer")).toBeInTheDocument();
  });
});
