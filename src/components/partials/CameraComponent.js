import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity, StyleSheet, Dimensions } from "react-native"; // Import Dimensions
import { Button } from "react-native-paper";
import {
  PinchGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Camera } from "expo-camera";
import { Icon } from "react-native-elements";

const CameraComponent = ({
  zoom,
  setCam,
  closeCamera,
  takePicture,
  flash,
  type,
  handleFlash,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PinchGestureHandler
            onGestureEvent={(event) => zoom(event)}
            testID="pinch"
          >
            <Camera
              ref={(ref) => setCam(ref)}
              testID="CamComponent"
              type={type}
              flashMode={flash}
              zoom={zoom}
            >
              {/* FLASH ICON TOGGLES FLASH WHEN PRESSED */}
              <TouchableOpacity
                onPress={handleFlash}
                style={styles.flash}
                testID="flash"
              >
                <Text>
                  {flash ? (
                    <Icon name="flash-on" size={40} color="#fff" />
                  ) : (
                    <Icon name="flash-off" size={40} />
                  )}
                </Text>
              </TouchableOpacity>
              {/* Capture Button */}
              <View
                style={{
                  paddingTop: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: "50%",
                }}
              >
                <TouchableOpacity
                  onPress={takePicture}
                  testID="takePicture"
                  style={{ backgroundColor: "#fff", borderRadius: 50 }}
                >
                  <Text>
                    <Icon name="camera" size={40} />
                  </Text>
                </TouchableOpacity>
                {/* Close Camera Button */}
                <Text style={styles.margin}>
                  <TouchableOpacity testID="closeCamera" onPress={closeCamera}>
                    <Text style={{ color: "#fff", fontSize: 20 }}>Close Camera</Text>
                  </TouchableOpacity>
                </Text>
              </View>
            </Camera>
          </PinchGestureHandler>
        </GestureHandlerRootView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%"
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },

  captureButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    borderRadius: 50,
    justifyContent: "center",
  },
  closeCamera: {
    marginTop: 10,
    marginBottom: 10,
  },
  flash: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  margin: {
    marginBottom: 10,
    marginTop: 20,
  },
});

export default CameraComponent;
