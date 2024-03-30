import { fireEvent, render, screen } from "@testing-library/react-native";
import ListItem from "../ListItem";

describe("List Item", () => {
  test("User can select item",async  () => {
    const mockItem = {
      Unit: "A",
      Type: "ELE",
      Description: "Read Needed",
    };
    render(<ListItem item={mockItem} handleSelectedTaks={jest.fn()} />);
    const taskToSelect = await screen.findByTestId("selectTask");
    expect(taskToSelect).toBeTruthy();
    fireEvent.press(taskToSelect);
  });
});
