import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import uuid from "react-native-uuid";
const ListItem = ({ item, handleSelectedTaks }) => {
  return (
    <TouchableOpacity onPress={() => handleSelectedTaks(item)} testID="selectTask">
      <View style={styles.container}>
        <Text key={uuid.v4()} style={styles.txt}>
          Unit: {item.Unit}
        </Text>
        <Text key={uuid.v4()} style={styles.txt}>
          Task: {item.Type} {item.Description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "grey",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginRight: 200,
    marginBottom: 10,
    paddingBottom: 50,
    backgroundColor: "#3ba1c5",
  },
  txt: {
    color: "#fbfdf6",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
  },
});

export default ListItem;
