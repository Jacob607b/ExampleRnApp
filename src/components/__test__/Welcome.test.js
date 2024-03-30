jest.useFakeTimers();
import React from "react";
import Welcome from "../Welcome";
import { IDContext } from "../../context/IDContext";
import { ReadContext } from "../../context/ReadContext";
import { SelectedTaskContext } from "../../context/SelectedTaskContext";
import { JWTContext } from "../../context/JWTContext";
import { AuthContext } from "../../context/AuthContext";
import { fireEvent, render, screen, act } from "@testing-library/react-native";

describe("Welcome Page", () => {
  let useEffect;
  // mockImplemntation to mock useEffect
  const mockUseEffect = () => {
    useEffect.mockImplementation((f) => f());
  };
  useEffect = jest.spyOn(React, "useEffect");
  beforeEach(() => {
    mockUseEffect();
    mockUseEffect();
  });
  it("Renders Inputs from selected task", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        data: [
          {
            Unit: "G",
            Type: "ELE",
            Description: "Read Needed",
            completed: false,
          },
        ],
      })
    );
    const setNeededInput = jest.fn();
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [setNeededInput, () => []]);
    const navigate = jest.fn();
    const setReadData = jest.fn();
    const setSelectedTask = jest.fn();
    const needsAnotherInput = true;
    const setJwt = jest.fn();
    const setIsLoggedIn = jest.fn();
    const mockSelectedTask = {
      Unit: "123",
      Type: "Electric",
    };
    const { getByTestId } = render(
      <AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn }}>
        <JWTContext.Provider value={{ Jwt: "1", setJwt }}>
          <IDContext.Provider value={{ ID: "1" }}>
            <ReadContext.Provider value={{ readData: ["1"], setReadData }}>
              <SelectedTaskContext.Provider
                value={{ selectedTask: mockSelectedTask, setSelectedTask }}
              >
                <Welcome
                  navigation={{ navigate }}
                  needsAnotherInput={needsAnotherInput}
                />
              </SelectedTaskContext.Provider>
            </ReadContext.Provider>
          </IDContext.Provider>
        </JWTContext.Provider>
      </AuthContext.Provider>
    );
    const needInput = screen.getByTestId("neededInput");
    expect(needInput).toBeOnTheScreen();
    fireEvent.changeText(needInput, "123");
    const streetAddress = screen.getByTestId("StreetAddress");
    expect(streetAddress).toBeOnTheScreen();
    fireEvent.changeText(streetAddress, "A");
    const resetBtn = getByTestId("reset");
    fireEvent.press(resetBtn);
    const signOut = getByTestId("signOut");
    expect(signOut).toBeOnTheScreen();
    fireEvent.press(signOut);
    await act(() => {
      const nextBtn = getByTestId("Next");
      expect(nextBtn).toBeOnTheScreen();
      fireEvent.press(nextBtn);
    });
    expect(screen).toMatchSnapshot();
  });
  it("Signs out when AuthContext is false", async () => {
    const navigate = jest.fn();
    const setReadData = jest.fn();
    const setSelectedTask = jest.fn();
    const mockSelectedTask = {
      Unit: "123",
      Type: undefined,
    };
    const setJwt = jest.fn();
    const setIsLoggedIn = jest.fn();
    render(
      <AuthContext.Provider value={{ isLoggedIn: false, setIsLoggedIn }}>
        <JWTContext.Provider value={{ setJwt }}>
          <IDContext.Provider value={{ ID: "1" }}>
            <ReadContext.Provider value={{ readData: ["1"], setReadData }}>
              <SelectedTaskContext.Provider
                value={{ selectedTask: mockSelectedTask, setSelectedTask }}
              >
                <Welcome navigation={{ navigate }} />
              </SelectedTaskContext.Provider>
            </ReadContext.Provider>
          </IDContext.Provider>
        </JWTContext.Provider>
      </AuthContext.Provider>
    );
    const needInput = screen.queryByTestId("neededInput");
    expect(needInput).not.toBeOnTheScreen();
  });
  it("Renders with no selected task", async () => {
    const navigate = jest.fn();
    const setReadData = jest.fn();
    const setSelectedTask = jest.fn();
    const mockSelectedTask = {
      Unit: "123",
      Type: undefined,
    };
    const setJwt = jest.fn();
    const setIsLoggedIn = jest.fn();
    render(
      <AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn }}>
        <JWTContext.Provider value={{ Jwt: "1", setJwt }}>
          <IDContext.Provider value={{ ID: "1" }}>
            <ReadContext.Provider value={{ readData: ["1"], setReadData }}>
              <SelectedTaskContext.Provider
                value={{ selectedTask: mockSelectedTask, setSelectedTask }}
              >
                <Welcome navigation={{ navigate }} />
              </SelectedTaskContext.Provider>
            </ReadContext.Provider>
          </IDContext.Provider>
        </JWTContext.Provider>
      </AuthContext.Provider>
    );
    const needInput = screen.queryByTestId("neededInput");
    expect(needInput).not.toBeOnTheScreen();
  });
});
