jest.useFakeTimers();
import jwt_decode from "jwt-decode";
import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import Login from "../Login";
import { JWTContext } from "../../context/JWTContext";
import { AuthContext } from "../../context/AuthContext";
import { IDContext } from "../../context/IDContext";
import { ReadContext } from "../../context/ReadContext";
import { ImageContext } from "../../context/ImageContext";
import { SelectedTaskContext } from "../../context/SelectedTaskContext";
global.fetch = jest.fn();
jest.mock("jwt-decode", () => jest.fn());
const mockGetAuth = jest.fn();
// HERE IS THE CHANGE MADE FROM Login.test.js (1), promise is rejected
jest.mock("firebase/auth", () => {
  return {
    getAuth: () => mockGetAuth,
    signInAnonymously: jest.fn(() => Promise.reject()),
  };
});
describe("Login Page", () => {
  beforeEach(() => {
    jwt_decode.mockReturnValue({ exp: Date.now() + 10000 });
    
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.runAllTimers();
  });

  it("should reject anon sign in", async () => {
    const mockResponse = { token: "dummy_token" };
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const navigation = { navigate: jest.fn() };

    const { getByTestId } = render(
      <JWTContext.Provider value={{ setJwt: jest.fn() }}>
        <AuthContext.Provider value={{ setIsLoggedIn: jest.fn() }}>
          <IDContext.Provider value={{ setID: jest.fn() }}>
            <ReadContext.Provider value={{ setReadData: jest.fn() }}>
              <ImageContext.Provider value={{ setImages: jest.fn() }}>
                <SelectedTaskContext.Provider
                  value={{ setSelectedTask: jest.fn() }}
                >
                  <Login navigation={navigation} />
                </SelectedTaskContext.Provider>
              </ImageContext.Provider>
            </ReadContext.Provider>
          </IDContext.Provider>
        </AuthContext.Provider>
      </JWTContext.Provider>
    );

    fireEvent.changeText(getByTestId("Account"), "mock_account");
    fireEvent.changeText(getByTestId("key"), "mock_key");
    await act(() => {
      fireEvent.press(getByTestId("Submit"));
    });
    expect(global.fetch).toHaveBeenCalled();
    jest.runAllTimers();
  });
});
