import React, { useContext, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Button } from "react-native-paper";
import { getAuth } from "firebase/auth";
import { useQuery } from "@tanstack/react-query";
import ListItem from "./children/ListItem";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { IDContext } from "../../context/IDContext";
import { SelectedTaskContext } from "../../context/SelectedTaskContext";

export default function ToDoList({ showToggleButton }) {
  const { ID } = useContext(IDContext);
  const { setSelectedTask } = useContext(SelectedTaskContext);
  const [visible, setVisible] = useState(true);

  const containerStyle = {
    backgroundColor: "#f2f2f2",
    padding: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center", // Change alignItems to stretch
    textAlign: "center",
    height: "60%",
    width: "100%"
  };
  

  const fetchToDo = useCallback(
    async (ID) => {
      const auth = getAuth();
      const user = auth.currentUser;
      const token = await user.getIdToken();
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ID }),
      };

      const res = await fetch(
        "http://10.0.2.2:5001/vcs-reads-dev2/us-central1/app/toDo",
        requestOptions
      );
      const data = await res.json();
      return data;
    },
    [ID]
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["todos", ID],
    queryFn: () => fetchToDo(ID),
    staleTime: Infinity,
  });

  const hideModal = useCallback(() => {
    setVisible(false);
    showToggleButton();
  }, [showToggleButton]);

  const handleSelectedTask = async (item) => {
    await setSelectedTask(item);
    hideModal();
  };

  if (isLoading) return <ActivityIndicator size="large" color={"#ed3b49"} testID="spinner"/>;
  if (isError) return <Text>Error fetching data</Text>;
  if (data.length === 0) return <Text>No Assigned Tasks</Text>;

  return (
    <Animated.View exiting={FadeOut} style={styles.backgroundColor} testID="toDoList">
      <Modal
        visible={visible}
        transparent={true}
        onRequestClose={hideModal}
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalBackground}>
          <View style={containerStyle}>
            <View style={styles.modalHeader}>
              <Text style={styles.headerText}>Please Select A Task</Text>
            </View>

            <Animated.FlatList
              entering={FadeInDown.springify().mass(1)}
              style={{ flex: 1 }}
              data={data.filter((task) => !task.completed)}
              keyExtractor={(item) =>
                `${item.Unit}_${item.Type}_${item.Description}`
              }
              renderItem={({ item }) => (
                <ScrollView>
                  <ListItem
                    item={item}
                    handleSelectedTaks={() => handleSelectedTask(item)}
                  />
                </ScrollView>
              )}
            />
            <TouchableOpacity
              onPress={hideModal}
              testID="Dismiss"
              style={{ marginBottom: 5, marginTop: 10 }}
            >
              <Button mode="elevated" compact={true}>
                Close
              </Button>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "black",
    width: "80%",
    marginRight: 8,
    padding: 3,
    elevation: 3,
    marginBottom: 5,
  },
  backgroundColor: {
    color: "#4D626C",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeader: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 5,
    backgroundColor: "#008dc9",
    height: "10%",
    width: "100%",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 15,
    color: "white",

  },
});
