jest.useFakeTimers();
import React from "react";
import { ReadContext } from "../../context/ReadContext";
import { ImageContext } from "../../context/ImageContext";
import { SelectedTaskContext } from "../../context/SelectedTaskContext";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  act,
} from "@testing-library/react-native";
import Confirmation from "../Confirmation";
import * as Location from "expo-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BackHandler } from "react-native";

jest.mock("react-native/Libraries/Utilities/BackHandler", () => {
  return jest.requireActual(
    "react-native/Libraries/Utilities/__mocks__/BackHandler.js"
  );
});
const queryClient = new QueryClient();
let useEffect;
const mockUseEffect = () => {
  useEffect.mockImplementation((f) => f());
};
beforeEach(() => {
  useEffect = jest.spyOn(React, "useEffect");
  mockUseEffect();
  mockUseEffect();
});

afterEach(cleanup);
// Location Permission spyOn
const locationPermSpy = jest.spyOn(
  Location,
  "requestForegroundPermissionsAsync"
);

const locationSpy = jest.spyOn(Location, "getCurrentPositionAsync");

test("Renders, snapshot, state updates", async () => {
  global.fetch = jest.fn().mockResolvedValueOnce({
    status: 200,
  });
  // Location Permission status is mocked
  locationPermSpy.mockResolvedValueOnce({ status: "granted" });

  // readData is needed for Confirmation component to render, maps through the value of Context in component
  const readData = {
    address: "Unit 1",
    addedField: [{ field: "Electric", read: "100" }],
  };
  const Images = { ImageURL: ["image.source"] };
  const navigate = jest.fn();
  const date = jest.fn();
  dt = jest.fn();
  const requestOptions = jest.fn();
  const setSelectedTask = jest.fn();

  const task = { selectedTask: ["March24"] };

  render(
    <QueryClientProvider client={queryClient}>
      <SelectedTaskContext.Provider value={{ task, setSelectedTask }}>
        <ReadContext.Provider value={{ readData, requestOptions }}>
          <ImageContext.Provider value={{ Images }}>
            <Confirmation
              navigation={{ navigate }}
              date={{ date }}
              dt={dt}
              location={locationSpy}
            />
          </ImageContext.Provider>
        </ReadContext.Provider>
      </SelectedTaskContext.Provider>
    </QueryClientProvider>
  );
  expect(locationPermSpy).toHaveBeenCalled();

  expect(screen).toMatchSnapshot();

  const confirm = screen.getByTestId("Confirm-Submission");
  expect(confirm).toBeOnTheScreen();

  fireEvent.press(confirm);

  const cancel = screen.getByTestId("cancel");
  expect(cancel).toBeOnTheScreen();
  fireEvent.press(cancel);
  BackHandler.mockPressBack();
});
test("Location permission not granted", async () => {
  global.fetch = jest.fn().mockResolvedValueOnce({
    status: 200,
  });
  await act(() => {
    // Location Permission status is mocked
    locationPermSpy.mockResolvedValueOnce({ status: "NOPE" });
  });

  // readData is needed for Confirmation component to render, maps through the value of Context in component
  const readData = {
    address: "Unit 1",
    addedField: [{ field: "Electric", read: "100" }],
  };
  const Images = { ImageURL: ["image.source"] };
  const navigate = jest.fn();
  const date = jest.fn();
  dt = jest.fn();
  const requestOptions = jest.fn();
  const setSelectedTask = jest.fn();

  const task = { selectedTask: ["March24"] };

  render(
    <QueryClientProvider client={queryClient}>
      <SelectedTaskContext.Provider value={{ task, setSelectedTask }}>
        <ReadContext.Provider value={{ readData, requestOptions }}>
          <ImageContext.Provider value={{ Images }}>
            <Confirmation
              navigation={{ navigate }}
              date={{ date }}
              dt={dt}
              location={locationSpy}
            />
          </ImageContext.Provider>
        </ReadContext.Provider>
      </SelectedTaskContext.Provider>
    </QueryClientProvider>
  );
  expect(locationPermSpy).toHaveBeenCalled();
});
