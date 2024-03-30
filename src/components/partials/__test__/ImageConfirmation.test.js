import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import ImageConfirmation from "../ImageConfirmation";
describe("Image Confirmation", () => {
  test("Image Confirmation Buttons (Yes)", () => {
    const deleteFunction = jest.fn();

    render(<ImageConfirmation deleteFunction={deleteFunction} />);

    const yesButton = screen.getByTestId("Yes");
    expect(yesButton).toBeTruthy();
    fireEvent.press(yesButton);
  });
  test("Image Confirmation Buttons (No)", () => {
    const deleteFunction = jest.fn();

    render(<ImageConfirmation deleteFunction={deleteFunction} />);

    const noButton = screen.getByTestId("No");
    expect(noButton).toBeOnTheScreen();
    fireEvent.press(noButton);
  });

  test("Image Confirmation Snapshot", async () => {
    render(<ImageConfirmation />);
    expect(screen).toMatchSnapshot();
  });
  test("Modal close action", () => {
    const deleteFunction = jest.fn();

    render(<ImageConfirmation deleteFunction={deleteFunction} />);

    // Simulate modal close action
    const modal = screen.getByTestId("modal");
    fireEvent(modal, "onRequestClose");
  });
});
