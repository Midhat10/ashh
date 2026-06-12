import { render, screen } from "@testing-library/react";
import NotFoundpage from "./NotFoundpage";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";

describe("render notfoundpage", () => {
  it("check of elements on this page", () => {
    render(
      <BrowserRouter
        basename="/"
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <MantineProvider>
          <NotFoundpage />
        </MantineProvider>
      </BrowserRouter>,
    );
    expect(
      screen.getByText(/Такой страницы не существует/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Давайте перейдём к началу")).toBeInTheDocument();
    expect(screen.getByText("На главную")).toBeInTheDocument();
  });
});
