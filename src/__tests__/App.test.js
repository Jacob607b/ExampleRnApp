import App from "../App";
import React from "react";
import { cleanup, render } from "@testing-library/react-native";

afterEach(cleanup);
describe("<App />", () => {
  it("Stack changes when logged in", async () => {
    const setIsLoggedIn = jest.fn();

    jest.spyOn(React, "useState").mockReturnValueOnce([true, setIsLoggedIn]);
    render(<App />);
  });
  it("Stack changes when NOT logged in", async () => {
    const setIsLoggedIn = jest.fn();

    jest.spyOn(React, "useState").mockReturnValueOnce([false, setIsLoggedIn]);
    render(<App />);
  });
});
