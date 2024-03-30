jest.useFakeTimers();
import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react-native";
import SubmitImage from "../SubmitImage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReadContext } from "../../context/ReadContext";
import { ImageContext } from "../../context/ImageContext";
import * as ImagePicker from "expo-image-picker";

jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ granted: true }),
}));
jest.mock("expo-camera", () => ({
  ...jest.requireActual("expo-camera"),
  useCameraPermissions: jest.fn().mockReturnValue({ granted: true }),
}));
describe("Submit Image test for Image confirmation", () => {

  const setImages = jest.fn();
  const setReadData = jest.fn();
  const readData = {
    address: "Unit 1",
    addedField: [{ field: "Electric", read: "100" }],
  };

  const queryClient = new QueryClient();

  test("Submit Image Confirmation Modal", async () => {
    const mockedResult = {
      assets: [{ uri: "test_image_uri" }],
    };

    // Mocking ImagePicker permission request
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
      status: "granted",
    });

    const navigate = jest.fn();
    render(
      <ImageContext.Provider value={{ Images: mockedResult, setImages }}>
        <ReadContext.Provider value={{ readData, setReadData }}>
          <QueryClientProvider client={queryClient}>
            <SubmitImage navigation={{ navigate }} />
          </QueryClientProvider>
        </ReadContext.Provider>
      </ImageContext.Provider>
    );
    // Assert that the ScrollView with testID "imageScrollView" is present
    const scrollView = screen.getByTestId("imageScrollView");
    expect(scrollView).toBeTruthy();
    const submit = screen.getByTestId("Submit");
    await act(() => {
      fireEvent.press(submit);
    });
    const errorMsg = screen.getByText("Select or take an image to continue");
    expect(errorMsg).toBeOnTheScreen()
    jest.runAllTimers();
  });
});
