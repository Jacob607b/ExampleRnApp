import React, { useState, useMemo } from "react";
import { DefaultTheme, PaperProvider, MD2LightTheme } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Welcome from "./components/Welcome";
import SubmitImage from "./components/SubmitImage";
import Confirmation from "./components/Confirmation";
import Login from "./components/Login";
import ModalToggleButton from "./components/partials/ModalToggleButton";
import NavbarLogo from "./assets/NavbarLogo";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "./context/AuthContext";
import { ImageContext } from "./context/ImageContext";
import { IDContext } from "./context/IDContext";
import { SelectedTaskContext } from "./context/SelectedTaskContext";
import { ReadContext } from "./context/ReadContext";
import { JWTContext } from "./context/JWTContext";
import { COLORS } from "./constants/theme";

export default function App() {
  const queryClient = new QueryClient();
  const Stack = createNativeStackNavigator();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ID, setID] = useState(false);
  const [readData, setReadData] = useState([]);
  const [Images, setImages] = useState([]);
  const [Jwt, setJwt] = useState(undefined);
  const [selectedTask, setSelectedTask] = useState({});

  const memoizedProviders = useMemo(
    () => ({
      isLoggedIn,
      setIsLoggedIn,
      ID,
      setID,
      readData,
      setReadData,
      Images,
      setImages,
      Jwt,
      setJwt,
      selectedTask,
      setSelectedTask,
    }),
    [
      isLoggedIn,
      setIsLoggedIn,
      ID,
      setID,
      readData,
      setReadData,
      Images,
      setImages,
      Jwt,
      setJwt,
      selectedTask,
      setSelectedTask,
    ]
  );

  const theme = useMemo(
    () => ({
      ...MD2LightTheme,
      roundess: 2,
      colors: {
        ...MD2LightTheme.colors,
        primary: COLORS.primary,
        accent: COLORS.secondary,
      },
    }),
    []
  );

  const stack = useMemo(() => {
    if (isLoggedIn) {
      return (
        <NavigationContainer>
          <StatusBar />
          <Stack.Navigator
            testID="stack1"
            screenOptions={{
              headerStyle: { backgroundColor: "#FFF" },
              headerTitle: () => <NavbarLogo style={{ height: 5 }} />,
              headerTitleAlign: "center",
              headerBackVisible: false,
            }}
          >
            <Stack.Screen
              name="Welcome"
              component={Welcome}
              options={{
                cardStyle: {
                  backgroundColor: "#74858C",
                },
                headerRight: () => <ModalToggleButton />,
              }}
            />
            <Stack.Screen
              name="SubmitImage"
              component={SubmitImage}
              options={{ headerBackVisible: false, orientation: "portrait" }}
            />
            <Stack.Screen name="Confirmation" component={Confirmation} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      return (
        <NavigationContainer>
          <StatusBar />
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: "#FFF" },
              headerTitle: () => <NavbarLogo style={{ height: 5 }} />,
              headerTitleAlign: "center",
            }}
          >
            <Stack.Screen name="Login" component={Login} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
  }, [isLoggedIn]);

  return (
    <SelectedTaskContext.Provider value={memoizedProviders}>
      <JWTContext.Provider value={memoizedProviders}>
        <IDContext.Provider value={memoizedProviders}>
          <AuthContext.Provider value={memoizedProviders}>
            <ReadContext.Provider value={memoizedProviders}>
              <ImageContext.Provider value={memoizedProviders}>
                <QueryClientProvider client={queryClient}>
                  <PaperProvider theme={theme}>{stack}</PaperProvider>
                </QueryClientProvider>
              </ImageContext.Provider>
            </ReadContext.Provider>
          </AuthContext.Provider>
        </IDContext.Provider>
      </JWTContext.Provider>
    </SelectedTaskContext.Provider>
  );
}
