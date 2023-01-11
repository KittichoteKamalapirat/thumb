import React from "react";
import { render, screen } from "@testing-library/react";
import Tabs from "..";
import Tab from "../Tab";

jest.mock("next/dist/client/router", () => {
  return {
    __esModule: true,
    useRouter: jest.fn(),
  };
});

describe("Tabs", () => {
  test("renders the tabs component correctly", () => {
    render(
      <Tabs>
        <Tab isActive={false} label="Tab 1" href="/tab-1" />
        <Tab isActive={true} label="Tab 2" href="/tab-2" />
      </Tabs>
    );

    // tabs
    const tab1 = screen.getByRole("link", { name: "Tab 1" });
    const tab2 = screen.getByRole("link", { name: "Tab 2" });
    expect(tab1).toBeInTheDocument();
    expect(tab2).toBeInTheDocument();

    // selected tab
    expect(tab1).toHaveClass("text-grey-420");
    expect(tab2).toHaveClass("text-blurple-link bg-grey-100");
  });

  test("renders the tabs with badges", () => {
    render(
      <Tabs>
        <Tab isActive={false} label="Tab 1" href="/tab-1" badgeContent="123" />
        <Tab isActive={true} label="Tab 2" href="/tab-2" badgeContent="0" />
      </Tabs>
    );

    // badges
    const badge1 = screen.getByRole("badge", { name: "badge-123" });
    const badge2 = screen.getByRole("badge", { name: "badge-0" });

    expect(badge1).toBeInTheDocument();
    expect(badge2).toBeInTheDocument();

    expect(badge1).toHaveTextContent("123");
    expect(badge2).toHaveTextContent("0");

    expect(badge1).toHaveClass("bg-blurple-link");
    expect(badge2).toHaveClass("bg-grey-325");
  });
});
