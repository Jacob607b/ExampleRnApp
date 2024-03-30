import { View, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { getAuth, signInAnonymously } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { IDContext } from "../context/IDContext";
import { JWTContext } from "../context/JWTContext";
import { ReadContext } from "../context/ReadContext";
import { ImageContext } from "../context/ImageContext";
import { SelectedTaskContext } from "../context/SelectedTaskContext";
import jwt_decode from "jwt-decode";
import {
  Button,
  Text,
  Snackbar,
  ActivityIndicator,
  TextInput,
} from "react-native-paper";
import { COLORS, SIZES } from "../constants/theme";
// import Svg from "../assets/Svg";
const Login = ({ navigation }) => {
  const auth = getAuth();
  const [id, setId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [key, setKey] = useState("");
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { ID, setID } = useContext(IDContext);
  const { Jwt, setJwt } = useContext(JWTContext);
  const { setReadData } = useContext(ReadContext);
  const { setImages } = useContext(ImageContext);
  const { setSelectedTask } = useContext(SelectedTaskContext);
  useEffect(() => {
    setReadData([]);
    setImages([]);
    setSelectedTask([]);
  }, []);
  //Sets value for Account # input
  const handleAccountId = async (e) => {
    setId(e);
  };
  //Sets value for the access key / password
  const handleKey = (e) => {
    setKey(e);
  };
  //API call to firebase server /login enpoint
  const contactServer = async () => {
    setIsLoading(true);
    if (id === "") {
      setVisible(true);
      setIsLoading(false);
      setErrorMsg("Please Enter Your Account #");
      setTimeout(() => {
        setVisible(false);
      }, 5000);
      return;
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Id: id, Key: key }),
    };
    //Endpoint is currently a firbase cloud funtion using the firebase emulator
    await fetch(
      "http://10.0.2.2:5001/vcs-reads-dev2/us-central1/app/login",
      requestOptions
    )
      .then((res) => {
        return res.json();
      })
      .then(async (res) => {
        if (res.token === undefined) {
          setVisible(true);
          setIsLoading(false);
          setErrorMsg("The information you entered did not match our records.");
          setTimeout(() => {
            setVisible(false);
          }, 5000);
          return;
        } else {
          // JWT context is set
          await setJwt(res.token);
          // JWT is decoded to check expiration
          const decodedToken = jwt_decode(res.token);

          let currentDate = new Date();

          if (decodedToken.exp * 1000 > currentDate.getTime()) {
            signInAnonymously(auth)
              .then(() => {
                setErrorMsg("");
                setIsLoggedIn(true);
                setID(id);
                navigation.navigate("Welcome");
              })
              .catch((error) => {
                setVisible(true);
                setErrorMsg(error);
                setTimeout(() => {
                  setVisible(false);
                }, 5000);
              });
          }
        }
      });
  };
  return (
    <>
      <View style={styles.root}>
        <View style={styles.upperBox}>{/* <Svg /> */}</View>
        <View style={styles.card}>
          <View style={styles.container}>
            <TextInput
              label="Enter your Account ID"
              accessibilityLabel="input"
              testID={`${"Account"}`}
              alt="act"
              style={styles.textInput}
              onChangeText={handleAccountId}
            />

            <TextInput
              testID="key"
              style={styles.textInput}
              onChangeText={handleKey}
              label="Access Key"
            />
            <TouchableOpacity
              id="Submit"
              testID="Submit"
              onPress={contactServer}
            >
              <Text style={styles.txt}>
                <Button icon="account">Login</Button>
              </Text>
            </TouchableOpacity>
            <View>
              {isLoading ? <ActivityIndicator color="#8fc33b" /> : null}
            </View>
          </View>
        </View>

        <View style={styles.bottomBox}>
          <Snackbar visible={visible}>
            <Text style={styles.errorMsg}>{errorMsg}</Text>
          </Snackbar>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    marginLeft: 10,
    borderRadius: SIZES.extraLarge,
    marginRight: 10,
    height: "50%",
    position: "relative",
    bottom: 20,
    opacity: 0.9,
    justifyContent: "center",
    textAlign: "center",
    flexDirection: "column",
    zIndex: 1,
  },
  txt: {
    marginTop: 10,
    color: COLORS.secondary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    width: "80%",
    marginRight: 8,
    padding: 3,
    marginTop: 5,
  },
  upperBox: {
    borderColor: "rgba(0,0,0,0.2)",
    flex: 0.5,
    height: "100%",
    borderRadius: 8,
    borderRadius: SIZES.small,
    marginBottom: "-50%",
    backgroundColor: COLORS.primary,
    flexDirection: "column",
  },
  bottomBox: {
    borderColor: "rgba(0,0,0,0.2)",
    flex: 0.5,
    marginTop: "-50%",
    borderRadius: 8,
    borderRadius: SIZES.small,
    height: "100%",
    backgroundColor: COLORS.secondary,
    flexDirection: "column",
  },
  errorMsg: {
    textAlign: "center",
    color: "#fff",
  },
});

export default Login;
