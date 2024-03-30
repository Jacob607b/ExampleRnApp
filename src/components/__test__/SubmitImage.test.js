import React from "react";
import {
  render,
  act,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react-native";
import SubmitImage from "../SubmitImage";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQuery: jest.fn(),
}));
jest.mock("expo-camera", () => ({
  ...jest.requireActual("expo-camera"),
  useCameraPermissions: jest.fn(),
}));

jest.useFakeTimers();

describe("Submit Image Component Test", () => {
  // Mock useEffect INIT
  let useEffect;

  // mockImplemntation to mock useEffect
  const mockUseEffect = () => {
    useEffect.mockImplementation((f) => f());
  };
  afterEach(() => {
    jest.runAllTimers();
  });
  afterAll(cleanup);
  useEffect = jest.spyOn(React, "useEffect");
  // mockUseEffect must be called twice before each test
  beforeEach(async () => {

    mockUseEffect();
    mockUseEffect();
    await act(() => {
      useQuery.mockReturnValue({
        isSuccess: true,
        data: {
          granted: "success",
        },
      });
    });
  });
  // Mocking the permission response
  const mockedPermissionResponse = {
    status: "granted",
    granted: true,
    canAskAgain: true,
    isSuccess: true,
  };

  jest
    .spyOn(ImagePicker, "requestMediaLibraryPermissionsAsync")
    .mockResolvedValue(mockedPermissionResponse);
  jest
    .spyOn(Camera, "requestCameraPermissionsAsync")
    .mockResolvedValue(mockedPermissionResponse);

  const queryClient = new QueryClient();

  it("Renders", async () => {
    const navigation = { navigate: jest.fn() };
    render(
      <QueryClientProvider client={queryClient}>
        <SubmitImage navigation={navigation} />
      </QueryClientProvider>
    );

    expect(screen).toMatchSnapshot();
    const goBack = screen.getByTestId("goBack");
    fireEvent.press(goBack);
    expect(navigation.navigate).toHaveBeenCalled();
  });

  it("picks an image successfully", async () => {
    // Render the component
    render(
      <QueryClientProvider client={queryClient}>
        <SubmitImage />
      </QueryClientProvider>
    );

    // Trigger the pickImage function
    const pickImageButton = await screen.findByTestId("Camera");
    fireEvent.press(pickImageButton);
  });
  it("picks an image successfully", async () => {
    const mockedResult = {
      assets: [{ uri: "test_image_uri" }],
    };
    jest
      .spyOn(ImagePicker, "launchImageLibraryAsync")
      .mockResolvedValueOnce(mockedResult);
    // Mock useState hooks
    const setImage = jest.fn();
    const setCameraPermission = jest.fn();
    jest.spyOn(React, "useState").mockReturnValueOnce([[], setImage]);

    jest
      .spyOn(Camera, "useCameraPermissions")
      .mockReturnValueOnce([{ status: "granted" }, setCameraPermission]);
    // Render the component
    render(
      <QueryClientProvider client={queryClient}>
        <SubmitImage />
      </QueryClientProvider>
    );

    // Trigger the pickImage function
    const pickImageButton = await screen.findByTestId("Gallery");
    fireEvent.press(pickImageButton);

    // Wait for the image to be added
    await waitFor(() => {
      expect(setImage).toHaveBeenCalledWith(true);
    });
  });

  it("displays error message when gallery permission is denied", async () => {
    // Mock useState hooks
    const setVisible = jest.fn();
    const setErrorMsg = jest.fn();

    jest
      .spyOn(React, "useState")
      .mockReturnValueOnce([false, setVisible]) // Initial state for visible
      .mockReturnValueOnce(["", setErrorMsg]); // Initial state for errorMsg

    // Mock ImagePicker.launchImageLibraryAsync
    jest
      .spyOn(ImagePicker, "launchImageLibraryAsync")
      .mockRejectedValueOnce(new Error("Permission denied"));

    // Render the component
    render(
      <QueryClientProvider client={queryClient}>
        <SubmitImage />
      </QueryClientProvider>
    );

    // Assert that error message is displayed
    await waitFor(() => {
      expect(setVisible).toHaveBeenCalled();
      expect(setErrorMsg).toHaveBeenCalledWith(true);
    });
  });

  it("displays error message when user does not select an image", async () => {
    // Mock useState hooks
    const setVisible = jest.fn();
    const setErrorMsg = jest.fn();

    jest
      .spyOn(React, "useState")
      .mockReturnValueOnce([false, setVisible]) // Initial state for visible
      .mockReturnValueOnce(["", setErrorMsg]); // Initial state for errorMsg

    // Mock ImagePicker.launchImageLibraryAsync
    jest
      .spyOn(ImagePicker, "launchImageLibraryAsync")
      .mockResolvedValueOnce({ assets: [] });

    // Render the component
    render(
      <QueryClientProvider client={queryClient}>
        <SubmitImage />
      </QueryClientProvider>
    );

    // Assert that error message is displayed
    await waitFor(() => {
      expect(setVisible).toHaveBeenCalledTimes(3);
      expect(setErrorMsg).toHaveBeenCalledWith(true);
    });
  });

  it("Opens Camera Component and Sets Image", async () => {
    jest.mock("expo-camera");
    const setImage = jest.fn();
    const navigate = jest.fn();

    // Mock the takePictureAsync function of the Camera
    Camera.prototype.takePictureAsync = jest.fn().mockResolvedValue({
      uri: "mocked_image_uri",
    });

    // Mock the useState hook
    jest
      .spyOn(React, "useState")
      .mockReturnValue([[{ uri: "image.uri" }], setImage]);

    // Render the component
    render(
      <QueryClientProvider client={queryClient}>
        <SubmitImage navigation={navigate} />
      </QueryClientProvider>
    );

    // Interact with the flash camera
    const flashIcon = await screen.findByTestId("flash");
    fireEvent.press(flashIcon);
    expect(flashIcon).toBeOnTheScreen();
    fireEvent.press(flashIcon);
    const cameraIcon = await screen.findByTestId("takePicture");
    expect(cameraIcon).toBeOnTheScreen();
    fireEvent.press(cameraIcon);

    // Make sure to wait for the state update to reflect
    await waitFor(() => {
      expect(setImage).toHaveBeenCalledWith([
        { uri: "image.uri" },
        "mocked_image_uri",
      ]);
    });
    expect(screen).toMatchSnapshot();
    await act(async () => {
      const closeCamera = screen.getByTestId("closeCamera");
      fireEvent.press(closeCamera);
    });
  });
});