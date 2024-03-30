import ModalInstructions from "../ModalInstructions";
import { fireEvent, render, screen } from "@testing-library/react-native";

describe('Modal Instructions', () => {
    test("Modal Instructions Snapshot", async () => {
 
        render(<ModalInstructions />)
    
        expect(screen).toMatchSnapshot();
      });
      test("Modal Instructions Dismiss", () => {
        render(<ModalInstructions />)
        const dismissButton = screen.getByTestId("dismiss");
        expect(dismissButton).toBeOnTheScreen()
        fireEvent.press(dismissButton)
        
      });
   
 })

