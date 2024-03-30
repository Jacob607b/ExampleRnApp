import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
function SuccessModal({ navigationFunction }) {
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontWeight: "bold",
    width: "100%"
  };
  const [visible, setVisible] = React.useState(true);

  const hideModal = () => setVisible(false);

  return (
    <Modal
      visible={visible}
      onRequestClose={hideModal}
      transparent={true}
      animationType="slide"
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={containerStyle}>
          <Text>
            Success! Please go to the next page and confirm all the information
            you provided.
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigationFunction();
              hideModal();
            }}
            testID="navBtn"
          >
            <Text>
              <Button mode="elevated" className="SuccessModal">
                NEXT
              </Button>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
export default SuccessModal;
