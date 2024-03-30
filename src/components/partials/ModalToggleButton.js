import React, { useContext, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ToDoList from "./ToDoList";
import { IDContext } from "../../context/IDContext";
export default function ModalToggleButton() {
  const [showModal, setShowModal] = useState(false);
  const { ID } = useContext(IDContext) || {}; // Use default empty object to avoid destructuring undefined
  return (
    <View>
      {showModal ? (
        <ToDoList ID={ID} showToggleButton={() => setShowModal(false)} testID="toDoList" />
      ) : (
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Text style={{ color: "#8fc33b", fontWeight: "bold" }}>
            Show Tasks
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
//008dc9
//8fc33b
//ed3b49
