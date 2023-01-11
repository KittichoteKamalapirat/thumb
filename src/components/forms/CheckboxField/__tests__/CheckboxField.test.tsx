import { render, screen } from "@testing-library/react";
import React from "react";
import CheckboxField from "..";
import { SelectOption } from "../../SelectField";

const option: SelectOption = { value: "1", label: "Option 1" };

describe("CheckboxField", () => {
  test("renders an enabled checkbox", () => {
    render(<CheckboxField extraClass="w-full" isDisabled={false} option={option} />);

    // option
    const option1 = screen.getByText("Option 1");
    expect(option1).toBeInTheDocument();
  });

  test("renders a disabled checkbox", () => {
    render(<CheckboxField extraClass="w-full" isDisabled option={option} />);

    // option
    const option1 = screen.getByText("Option 1");
    expect(option1).toBeInTheDocument();

    //option is disabled
    const checkbox1 = screen.getByRole("checkbox");
    expect(checkbox1).toHaveAttribute("disabled");
  });
});
