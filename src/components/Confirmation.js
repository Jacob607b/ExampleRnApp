import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  BackHandler,
  Alert,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import Image from "react-native-image-progress";
import { ReadContext } from "../context/ReadContext";
import { IDContext } from "../context/IDContext";
import { ImageContext } from "../context/ImageContext";
import { SelectedTaskContext } from "../context/SelectedTaskContext";
import { getAuth } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { Button, ActivityIndicator } from "react-native-paper";
import uuid from "react-native-uuid";
import * as Location from "expo-location";
import { getUnixTime } from "date-fns";
import { getFirestore } from "firebase/firestore";
import { ref, getStorage } from "firebase/storage";
// DO NOT REMOVE storage import
import { storage } from "../firebase";

const Confirmation = React.memo(({ navigation }) => {
  const { readData } = useContext(ReadContext);
  const { ID } = useContext(IDContext);
  const { Images } = useContext(ImageContext);
  const { selectedTask } = useContext(SelectedTaskContext);
  const storage = getStorage();

  // Hook to set location, error message if found, and isLoaded to lazy load map comonent if needed
  const [local, setLocation] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  const [submitIndicator, setSubmitIndicator] = useState(false);
  //Device location is set if User allows it
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      alert(errorMsg);
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };
  useEffect(() => {
    getLocation();
  }, []);

  const auth = getAuth();
  const user = auth.currentUser;
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dt = date.getDate();
  const UnixTime = getUnixTime(date);
  // Array of month abbreviations
  const monthAbbreviations = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  // Determine the cycle based on the date
  const cycle = `${monthAbbreviations[month - 1]}${year.toString().slice(2)}`;
  const handleSubmit = async () => {
    setSubmitIndicator(true);
    let FireStoreData;
    if (selectedTask != null) {
      FireStoreData = {
        Data: { addedField: readData.addedField },
        Unit: readData.address,
        Images,
        local,
        Date: `${year}-${month < 10 ? "0" : ""}${month}-${
          dt < 10 ? "0" : ""
        }${dt}`,
        ID: ID,
        UnixTime,
        Cycle: selectedTask.Cycle,
      };
    } else {
      FireStoreData = {
        Data: { addedField: readData.addedField },
        Unit: readData.address,
        Images,
        local,
        Date: `${year}-${month < 10 ? "0" : ""}${month}-${
          dt < 10 ? "0" : ""
        }${dt}`,
        ID: ID,
        UnixTime,
        Cycle: cycle,
      };
    }

    const docRef = collection(getFirestore(), `Reads/${ID}/reads`);
    await addDoc(docRef, FireStoreData);
    try {
      const token = user && (await user.getIdToken());
      await fetch(
        "http://10.0.2.2:5001/vcs-reads-dev2/us-central1/app/updateTask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ID: ID,
            taskString: selectedTask.Description,
            completed: true,
            Unit: selectedTask.Unit,
            Cycle: selectedTask.Cycle,
          }),
        }
      );
    } catch (error) {
      console.log(error);
    }
    setSubmitIndicator(false);
    navigateToWelcome();
  };

  const cancelSubmission = async () => {
    const token = user && (await user.getIdToken());
    await Images.ImageURL.map(async (image) => {
      const fileName = ref(storage, image);
      const name = fileName.name;
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ID: ID, URL: name }),
      };
      await fetch(
        "http://10.0.2.2:5001/vcs-reads-dev2/us-central1/app/delete",
        requestOptions
      );
    });
    await navigation.navigate("Welcome");
  };

  const navigateToWelcome = async () => {
    await navigation.navigate("Welcome");
  };
  const alertFunciton = async () => {
    Alert.alert("Hold on!", "Are you sure you want to go back?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "YES",
        onPress: async () => {
          await cancelSubmission(), await navigateToWelcome();
        },
      },
    ]);
  };
  const onBackPress = async () => {
    alertFunciton();
  };
  BackHandler.addEventListener("hardwareBackPress", onBackPress);

  const showIndicator = () => {
    return <ActivityIndicator size="large" color={"#8fc33b"} />;
  };
  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.largFont}>UNIT: {readData.address}</Text>
          <>
            {readData.addedField.map((added) => {
              return (
                <>
                  <View style={styles.inputContainer} key={uuid.v4()}>
                    <Text key={uuid.v4()} style={styles.largFont}>
                      Type: {added.type}
                    </Text>
                  </View>

                  <Text style={styles.largFont} key={uuid.v4()}>
                    Read: {added.read}
                  </Text>
                </>
              );
            })}
          </>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.scrollView}
          >
            {Images.ImageURL.map((url) => {
              return (
                <View style={styles.imageContainer} key={uuid.v4()}>
                  <Image
                    key={url}
                    source={{ uri: url }}
                    style={styles.image}
                    indicator={showIndicator}
                  />
                </View>
              );
            })}
          </ScrollView>
          {submitIndicator ? (
            <ActivityIndicator color="#8fc33b" />
          ) : (
            <TouchableOpacity
              onPress={handleSubmit}
              testID="Confirm-Submission"
            >
              <Text>
                <Button mode="elevated" testID="Submit">
                  Submit
                </Button>
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={cancelSubmission} testID="cancel">
            <Button mode="elevated" style={styles.cancelButton}>
              Cancel
            </Button>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
});
// Style-sheet object
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "column",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  txt: {
    color: "white",
  },
  largFont: {
    fontSize: 20,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  image: {
    flex: 1,
    height: 500,
    width: 200,
  },
  cancelButton: {
    marginTop: 10,
    marginBottom: 10,
  },
});
export default Confirmation;
