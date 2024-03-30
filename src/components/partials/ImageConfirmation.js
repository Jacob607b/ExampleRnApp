import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";

export default function ImageConfirmation({ image, deleteFunction }) {
  const [visible, setVisible] = React.useState(true);

  return (
    <View>
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={() => setVisible(false)}
      testID="modal"
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
          fontSize: 20,
        }}
      >
        <Text style={{ fontSize: 20 }}>Does this look okay?</Text>

        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="center"
        />

        <TouchableOpacity onPress={() => setVisible(false)} testID="Yes">
          <Text style={{ fontSize: 20 }}>
            <Button mode="elevated" className="SuccessModal">
              Yes
            </Button>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteFunction(image)} testID="No">
          <Text style={{ fontSize: 20 }}>
            <Button mode="elevated" className="SuccessModal">
              No
            </Button>
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "70%",
  },
  button: {
    marginTop: 10,
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontWeight: "bold",
    height: "70%",
    flex: 1,
  },
});
