import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import CameraComponent from "../CameraComponent";

describe("Cam Component", () => {
 
  test("Cam Component RTL", ()=>{
    const setCam = jest.fn()
    const zoom = jest.fn();
    render(<CameraComponent zoom={zoom} setCam={setCam}/>)
    expect(screen).toMatchSnapshot();
    const pinchToZoom = screen.getByTestId("pinch");
    fireEvent(pinchToZoom, "onGestureEvent", {
      nativeEvent: {
        pointerCount: 2, // Simulate two fingers for pinch
        eventType: "pinch", // Specify the pinch event type
        scale: 2, // Simulate zooming in by scaling the gesture
      },
    })
  })
});
