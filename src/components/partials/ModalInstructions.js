import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";

const ModalInstructions = () => {
  const [visible, setVisible] = React.useState(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    boderRadius: 10,
    width: "100%"
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={hideModal}
      transparent={true}
      animationType="slide"
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={containerStyle}>
          <Text style={{ fontWeight: "bold" }}>
            Please select or take all necessary photos before you press "Submit
            Image"
          </Text>
          <TouchableOpacity onPress={hideModal} testID="dismiss">
            <Text>
              <Button mode="elevated">Dismiss</Button>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalInstructions;
