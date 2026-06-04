import { render, screen } from "@testing-library/react";
import NotFoundpage from "./NotFoundpage";
import { BrowserRouter } from "react-router-dom";

describe("render notfoundpage", () => {
  it("do it", () => {
    render(
      <BrowserRouter
        basename="/"
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <NotFoundpage />
      </BrowserRouter>,
    );
    expect(screen.getByText(/page isn't found/i)).toBeInTheDocument();
  });
});
