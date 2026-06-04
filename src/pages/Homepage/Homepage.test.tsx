import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Homepage from "./Homepage";

describe("render notfoundpage", () => {
  it("do it", () => {
    render(
      <BrowserRouter
        basename="/"
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Homepage />
      </BrowserRouter>,
    );
    expect(
      screen.getByText(/the main page of hh, welcome/i),
    ).toBeInTheDocument();
  });
});
