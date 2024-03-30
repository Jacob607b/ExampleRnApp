//Jest mock setup file
import fetchMock from "jest-fetch-mock";

import '@testing-library/jest-native/extend-expect';
import "react-native-gesture-handler/jestSetup";
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);
// import Adapter from "enzyme-adapter-react-16";
// Enzyme.configure({ adapter: new Adapter() });

module.exports = {
  testEnvironment: 'node'
}

jest.mock("jwt-decode", () => ({
  ...jest.requireActual("jwt-decode"),
  jwt_decode: () => ({ jwt_decode: jest.fn().mockReturnValue(()=> new Error()),
})}));

jest.mock("react-navigation", () => {
  return {
    createAppContainer: jest
      .fn()
      .mockReturnValue(function NavigationContainer(props) {
        return null;
      }),
    createDrawerNavigator: jest.fn(),
    createMaterialTopTabNavigator: jest.fn(),
    createStackNavigator: jest.fn().mockImplementation(()=>({
      screenOptions: jest.fn().mockImplementation(()=>({
        headerTitle: jest.fn()
      }))
    })),
    StackActions: {
      push: jest
        .fn()
        .mockImplementation((x) => ({ ...x, type: "Navigation/PUSH" })),
      replace: jest
        .fn()
        .mockImplementation((x) => ({ ...x, type: "Navigation/REPLACE" })),
    },
    NavigationActions: {
      navigate: jest.fn().mockImplementation((x) => x),
    },
  };
});
 // ignores hook warning in test, issue with expo-camera and jest compatibility
 // ignores act warning 
 jest.spyOn(console, "error").mockImplementation(jest.fn());
//Mock firebase
jest.mock("firebase/auth", () => {
  return {
    getAuth: () => jest.fn(),
    signInAnonymously: () => jest.fn().mockResolvedValue({}),
    signOut: () => jest.fn().mockResolvedValue({}),
    user: () => jest.fn(),
    getUserIdToken: () => jest.fn(),
  };
});

fetchMock.enableMocks();
// Silence the warning https://github.com/facebook/react-native/issues/11094#issuecomment-263240420
// Use with React Native >= 0.63
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
require('react-native-reanimated').setUpTests();
global.alert = jest.fn();

