import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react-native";
import ModalToggleButton from "../ModalToggleButton";
import { IDContext } from "../../../context/IDContext";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

describe("ModalToggleButton", () => {
  const queryClient = new QueryClient();

  it("renders correctly and toggles modal", async () => {
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <IDContext.Provider value={{ ID: "mockedID" }}>
          <ModalToggleButton />
        </IDContext.Provider>
      </QueryClientProvider>
    );

    // Check if the "Show Tasks" button is initially present
    const showTasksButton = getByText("Show Tasks");
    expect(showTasksButton).toBeTruthy();
    await waitFor(() => {
      fireEvent.press(showTasksButton);
    });
  });
});
