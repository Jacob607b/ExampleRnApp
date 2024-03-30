jest.useFakeTimers();
import React from "react";
import SuccessModal from "../SuccessModal";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import { shallow } from "enzyme";
import "jest-enzyme";
import "@testing-library/jest-dom";
import ModalInstructions from "../ModalInstructions";

import NavbarLogo from "../../../assets/NavbarLogo";
import { fireEvent, render, screen } from "@testing-library/react-native";

describe("/partial components", () => {
  
  test("Success modal", () => {
    const navigationFunction = jest.fn();
    render(<SuccessModal navigationFunction={navigationFunction} />);
    expect(screen).toMatchSnapshot()
    const navBtn = screen.getByTestId("navBtn");
    expect(navBtn).toBeOnTheScreen();
    fireEvent.press(navBtn);
  })

  test("NavBar Logo Snapshot", () => {
    const wrapper = renderer.create(<NavbarLogo />).toJSON();
    expect(wrapper).toMatchSnapshot();
  });
 
});
