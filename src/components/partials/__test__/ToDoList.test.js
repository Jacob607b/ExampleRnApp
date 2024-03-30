import React from "react";
import ToDoList from "../ToDoList";
import { render, act, screen, fireEvent } from "@testing-library/react-native";
import { IDContext } from "../../../context/IDContext";
import SelectedTaskContext from "../../../context/SelectedTaskContext";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQuery: jest.fn().mockReturnValue(),
}));

describe("ToDoList Tests", () => {
  jest.mock("../../../context/SelectedTaskContext", () => ({
    ...jest.requireActual("../../../context/SelectedTaskContext"),
    useContext: jest.fn(() => ({
      setSelectedTask: jest.fn(),
    })),
  }));


  it("No Task Assigned", async () => {
    const queryClient = new QueryClient();
    const mockData = [];
    await act(() => {
      useQuery.mockReturnValueOnce({
        data: mockData,
        isLoading: false,
        isError: false,
      });
    });

    const setSelectedTask = jest.fn();

    const data = [];
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(data),
    });
    render(
      <QueryClientProvider client={queryClient}>
        <IDContext.Provider value={{ ID: "1" }}>
          <SelectedTaskContext.Provider
            value={{ selectedTask: [], setSelectedTask }}
          >
            <ToDoList />
          </SelectedTaskContext.Provider>
        </IDContext.Provider>
      </QueryClientProvider>
    );
    expect(useQuery).toHaveBeenCalled();
    expect(screen.getByText("No Assigned Tasks")).toBeOnTheScreen();
  });
  it("Renders and fetches tasks", async () => {
    const data = [
      {
        Unit: "G",
        Type: "ELE",
        Description: "Read Needed",
        completed: false,
      },
    ];
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(data),
    });

    const queryClient = new QueryClient();
    const mockData = [
      {
        Unit: "G",
        Type: "ELE",
        Description: "Read Needed",
        completed: false,
      },
    ];
    await act(() => {
      useQuery.mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
      });
    });

    const setSelectedTask = jest.fn();

    const showToggleButton = jest.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <IDContext.Provider value={{ ID: "1" }}>
          <SelectedTaskContext.Provider
            value={{ selectedTask: [], setSelectedTask }}
          >
            <ToDoList showToggleButton={showToggleButton} />
          </SelectedTaskContext.Provider>
        </IDContext.Provider>
      </QueryClientProvider>
    );
    expect(useQuery).toHaveBeenCalled();
    expect(screen).toMatchSnapshot();
    await act(() => {
      const selectableTask = screen.getByTestId("selectTask");
      expect(selectableTask).toBeOnTheScreen();
      fireEvent.press(selectableTask);
    });
  });
  it("Renders Fetching Error", async () => {
    const queryClient = new QueryClient();
    const mockData = [
      {
        Unit: "G",
        Type: "ELE",
        Description: "Read Needed",
        completed: false,
      },
    ];
    await act(() => {
      useQuery.mockReturnValueOnce({
        data: mockData,
        isLoading: false,
        isError: true,
      });
    });

    const setSelectedTask = jest.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <IDContext.Provider value={{ ID: "1" }}>
          <SelectedTaskContext.Provider
            value={{ selectedTask: [], setSelectedTask }}
          >
            <ToDoList />
          </SelectedTaskContext.Provider>
        </IDContext.Provider>
      </QueryClientProvider>
    );
    expect(useQuery).toHaveBeenCalled();
    expect(screen.getByText("Error fetching data")).toBeOnTheScreen();
  });

  it("Renders Activity Indicator", async () => {
    const data = [
      {
        Unit: "G",
        Type: "ELE",
        Description: "Read Needed",
        completed: false,
      },
    ];
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(data),
    });

    const queryClient = new QueryClient();

    await act(() => {
      useQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      });
    });

    const setSelectedTask = jest.fn();

    const showToggleButton = jest.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <IDContext.Provider value={{ ID: "1" }}>
          <SelectedTaskContext.Provider
            value={{ selectedTask: [], setSelectedTask }}
          >
            <ToDoList showToggleButton={showToggleButton} />
          </SelectedTaskContext.Provider>
        </IDContext.Provider>
      </QueryClientProvider>
    );
    expect(useQuery).toHaveBeenCalled();
  });
});
