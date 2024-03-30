import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { TextInput, Card, Button } from "react-native-paper";
import { getAuth, signOut } from "firebase/auth";
// import useFetch from "./functions/useFetch";
import { AuthContext } from "../context/AuthContext";
import { ReadContext } from "../context/ReadContext";
import { IDContext } from "../context/IDContext";
import { JWTContext } from "../context/JWTContext";
import { SelectedTaskContext } from "../context/SelectedTaskContext";
import SelectDropdown from "react-native-select-dropdown";
import { SHADOWS } from "../constants/theme";
const types = ["Electric", "Gas", "Water"];
export default function Welcome({ navigation }) {
  const { readData, setReadData } = useContext(ReadContext);
  const { ID, setID } = useContext(IDContext);
  const { Jwt, setJwt } = useContext(JWTContext);
  const { selectedTask, setSelectedTask } = useContext(SelectedTaskContext);
  // AUTH Firebase User
  const auth = getAuth();
  const user = auth.currentUser;
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [address, setAddress] = useState(selectedTask?.Unit || "");
  const [needsAnotherInput, setNeedsAnotherInput] = useState(false);
  const [neededInput, setNeededInput] = useState([]);
  const [addedField, setAddedField] = useState([]);

  // runs when user selects a task and when user intially signs in
  useEffect(() => {
    if (selectedTask) {
      setNeedsAnotherInput(true);
      setNeededInput([selectedTask.Type]);
      setAddress(selectedTask.Unit);
      setAddedField([{ type: selectedTask.Type, read: null }]);
      setReadData({
        address: selectedTask.Unit,
        addedField: [{ type: selectedTask.Type, read: null }],
      });
    }
    if (selectedTask.Type == undefined) {
      setNeedsAnotherInput(false);
      setReadData({});
      setAddress("");
    }
  }, [ID, selectedTask]);

  // User Sign out function
  const handleSignOut = async () => {
    try {
      await signOut(auth, user);
      setIsLoggedIn(false);
      // ID context is set to null
      setID(null);
      // JWT is set to undefined
      setJwt(undefined);
      navigation.navigate("Login");
    } catch (error) {
      alert(error.message);
    }
  };
  if (!isLoggedIn) {
    handleSignOut();
  }
  const nagivateToSelectImage = async () => {
    await setReadData({
      ...readData,
      address: address,
      addedField,
    });
    await navigation.navigate("SubmitImage");
    setNeededInput([]);
    setAddedField([]);
    setNeedsAnotherInput(false);
    setAddress("");
  };

  // Called when user manually selects utility to read
  // const handleSelect = (type) => {
  //   setNeedsAnotherInput(true);
  //   setNeededInput([type]);
  //   setAddedField([{ type, read: null }]);
  // };
  // Sets value for Utility field
  const handleAddedFields = (read, index) => {
    setAddedField((prev) => {
      const updatedFields = [...prev];
      updatedFields[index] = { ...updatedFields[index], read };
      setReadData({
        ...readData,
        addedField: updatedFields,
      });
      return updatedFields;
    });
  };
  // resets entire page state and context
  const resetForm = () => {
    setAddedField([]);
    setNeededInput([]);
    setNeedsAnotherInput(false);
    setAddress("");
    setSelectedTask({});
    setReadData({});
  };

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <TextInput
            testID="StreetAddress"
            label="Street Address / Unit"
            value={address}
            style={styles.textInput}
            onChangeText={(e) => setAddress(e)}
          />
          {needsAnotherInput
            ? neededInput.map((needed, i) => {
                return (
                  <React.Fragment key={i}>
                    <View key={i} style={styles.inputContainer}>
                      <Card.Title title={needed} style={styles.type} />
                      <TextInput
                        key={i}
                        name={needed}
                        testID="neededInput"
                        onChangeText={(val) => handleAddedFields(val, i)}
                        style={styles.textInput}
                        keyboardType="numeric"
                        label={`${needed} Read`}
                      />
                    </View>
                  </React.Fragment>
                );
              })
            : null}

          {/* <SelectDropdown
            data={types}
            onSelect={handleSelect}
            testID="SelectUtilty"
            defaultButtonText="Select Utility"
            buttonTextAfterSelection={() => {
              return "Select Utility";
            }}
            style={styles.margin}
          /> */}
          <Text>
            <TouchableOpacity
              testID="reset"
              onPress={resetForm}
              style={styles.margin}
            >
              <Button icon="refresh" compact={true} style={styles.margin}>
                Reset
              </Button>
            </TouchableOpacity>
          </Text>
          <Text>
            <TouchableOpacity
              testID="Next"
              onPress={nagivateToSelectImage}
              style={styles.margin}
            >
              <Button
                icon="arrow-right-bold"
                title="Next"
                compact={true}
                style={styles.margin}
              >
                Next
              </Button>
            </TouchableOpacity>
          </Text>
          <Text>
            <TouchableOpacity
              testID="signOut"
              onPress={handleSignOut}
              style={styles.margin}
            >
              <Button
                icon="account"
                compact={true}
                title="Sign Out"
                style={styles.margin}
              >
                Sign Out
              </Button>
            </TouchableOpacity>
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    marginTop: 50,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: SHADOWS.dark,
    shadowRadius: 16.0,
    elevation: 24,
  },
  inputContainer: {
    width: "100%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "black",
    width: "80%",
    marginRight: 8,
    padding: 3,
    shadowColor: SHADOWS.dark,
    elevation: 3,
    marginBottom: 5,
  },
  type: {
    borderWidth: 1,
    borderColor: "black",
    width: "80%",
    marginRight: 8,
    padding: 3,
    marginTop: 10,
  },
  margin: {
    marginBottom: 2,
    marginTop: 2,
  },
});
