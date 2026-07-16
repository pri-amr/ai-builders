import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renderiza sin errores", () => {
    render(<Home />);

    expect(
      screen.getByText(/edit the page.tsx file/i)
    ).toBeInTheDocument();
  });
});
