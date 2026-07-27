import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { OurValues } from "@/components/about-us/OurValues";

afterEach(() => {
  cleanup();
});

describe("OurValues", () => {
  it("renders heading, body and four value cards", () => {
    render(<OurValues />);

    expect(screen.getByTestId("our-values-heading")).toHaveTextContent("Our Values");
    expect(screen.getByTestId("our-values-body")).toHaveTextContent("continuous growth and evolution");

    expect(screen.getByTestId("our-values-card-trust")).toHaveTextContent("Trust");
    expect(screen.getByTestId("our-values-card-excellence")).toHaveTextContent("Excellence");
    expect(screen.getByTestId("our-values-card-client-centric")).toHaveTextContent("Client-Centric");
    expect(screen.getByTestId("our-values-card-our-commitment")).toHaveTextContent("Our Commitment");
  });
});
