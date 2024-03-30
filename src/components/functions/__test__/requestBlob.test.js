import { renderHook } from "@testing-library/react-hooks";
import { requestBlob } from "../requestBlob"; // Update the path accordingly
describe("requestBlob", () => {
  it("fetches blob data from the given URI", async () => {
    // Mock XMLHttpRequest
    const xhrMock = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      responseType: "",
      response: "mockBlobData", // You can customize this mock data
      onload: jest.fn(),
      onerror: jest.fn(),
    };
    global.XMLHttpRequest = jest.fn(() => xhrMock);

    // Define URI to test
    const uri = "https://example.com/image.jpg"; // Provide a valid URI for testing

    // Call the custom hook
    const { result } = renderHook(() => requestBlob(uri));

    // Ensure that XMLHttpRequest is initialized correctly
    expect(xhrMock.open).toHaveBeenCalledWith("GET", uri, true);
    expect(xhrMock.send).toHaveBeenCalledWith(null);
    expect(xhrMock.responseType).toBe("blob");

    // Resolve the mock onload function
    xhrMock.onload();

    expect(result.current).toBeTruthy();

    xhrMock.onerror();
  });
});
