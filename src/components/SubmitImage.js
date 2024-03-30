import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Snackbar } from "react-native-paper";
import ModalInstructions from "./partials/ModalInstructions";
import ImageConfirmation from "./partials/ImageConfirmation";
import SuccessModal from "./partials/SuccessModal";
import { IconButton, Button } from "react-native-paper";
import { ReadContext } from "../context/ReadContext";
import { ImageContext } from "../context/ImageContext";
import { IDContext } from "../context/IDContext";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { getStorage } from "firebase/storage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { requestBlob } from "./functions/requestBlob";
import { Icon } from "react-native-elements";
import CameraComponent from "./partials/CameraComponent";
import uuid from "react-native-uuid";
import { useMutation, useQuery } from "@tanstack/react-query";

const SubmitImage = ({ navigation }) => {
  const { ID } = useContext(IDContext);
  const { readData } = useContext(ReadContext);
  const { setImages } = useContext(ImageContext);
  const [cameraPermission, setCameraPermission] = Camera.useCameraPermissions();
  const [galleryPermission, setGalleryPermission] = React.useState(false);
  const [camera, setCamera] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const [type] = useState(Camera.Constants.Type.back);
  const [zoom, setZoom] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmUri, setConfrimUri] = useState();
  const [flash, setFlash] = useState(false);
  const [image, setImage] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);
  const [uploadingToFirebase, setUploadingToFirebase] = React.useState(false);
  const [needstoConfirm, setNeedsToConfirm] = React.useState(false);

  const permissionFunction = async () => {
    const imagePermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    setGalleryPermission(imagePermission.granted);
  };

  const permissionFunction2 = async () => {
    setCameraPermission();
  };

  useEffect(() => {
    permissionFunction();
    permissionFunction2();
    setNeedsToConfirm(false);
  }, []);

  const imagePermissionQuery = useQuery({
    queryKey: ["imagePermission"],
    queryFn: () => ImagePicker.requestMediaLibraryPermissionsAsync,
  });
  const cameraPermissionQuery = useQuery({
    queryKey: ["cameraPermission"],
    queryFn: () => Camera.useCameraPermissions,
  });

  useEffect(() => {
    if (imagePermissionQuery.isSuccess) {
      const granted = imagePermissionQuery.data.granted;
      setGalleryPermission(granted);
    }

    if (cameraPermissionQuery.isSuccess) {
      const granted = cameraPermissionQuery.data.status === "granted";
      setCameraPermission(granted);
    }
  }, [imagePermissionQuery.isSuccess, cameraPermissionQuery.isSuccess]);

  const pickImage = async () => {
    if (!galleryPermission) {
      setVisible(true);
      setErrorMsg("Gallery Permission is needed");
      setTimeout(() => {
        setVisible(false);
      }, 2000);
      return;
    } else {
      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          base64: true,
          aspect: [16, 9],
          quality: 1,
        });
        const source = result.assets[0].uri;
        setImage([...image, source]);
        setUploading(true);
      } catch (error) {
        setVisible(true);
        setErrorMsg("Select or take an image to continue");
        setTimeout(() => {
          setVisible(false);
        }, 2000);
        return;
      }
    }
  };

  const openCamera = async () => {
    if (cameraPermission && cameraPermission.granted === true) {
      setIsCameraOpen(true);
    } else {
      setVisible(true);
      setErrorMsg("Camera Permission is needed");
      setTimeout(() => {
        setVisible(false);
      }, 2000);
    }
  };

  const closeCamera = async () => {
    setIsCameraOpen(false);
  };

  const takePicture = async () => {
    setNeedsToConfirm(false);
    const data = await camera.takePictureAsync(null);
    const source = await data.uri;
    setImage([...image, source]);
    setConfrimUri(source);
    setUploading(true);
    setIsCameraOpen(false);
    setZoom(0);
    setNeedsToConfirm(true);
  };

  const handleFirebaseURI = async () => {
    setHideButton(true);
    const ImageURL = [];
    image.map(async (images) => {
      var metadata = {
        contentType: "image/jpeg",
      };
      const response = await requestBlob(images);
      try {
        const filename = await images.substring(images.lastIndexOf("/") + 1);
        const imageRef = ref(getStorage(), `${ID}/${filename}`);
        const uploadTask = await uploadBytes(imageRef, response, metadata);
        const url = await getDownloadURL(uploadTask.ref);
        ImageURL.push(url);
        setImages({ ImageURL });
        setHideButton(false);
        setUploadingToFirebase(true);
      } catch (error) {}
    });
    if (image.length === 0) {
      setVisible(true);
      setErrorMsg("Select or take an image to continue");
      setHideButton(true);
      setTimeout(() => {
        setVisible(false);
        setHideButton(false);
      }, 2000);
    }
  };

  const deleteImage = (value) => {
    setImage((selected) => {
      return selected.filter((image) => image !== value);
    });
  };

  const deleteImageFromModal = (value) => {
    setImage((selected) => {
      return selected.filter((image) => image !== value);
    });
    setNeedsToConfirm(false);
    setIsCameraOpen(true);
  };

  const handleFlash = () => {
    if (flash === false) {
      setFlash(true);
    } else {
      setFlash(false);
    }
  };

  const changeZoom = (event) => {
    if (event.nativeEvent.scale > 1 && zoom < 1) {
      setZoom(zoom + 0.001);
    }
    if (event.nativeEvent.scale < 1 && zoom > 0) {
      setZoom(zoom - 0.001);
    }
  };

  const goBack = () => {
    navigation.navigate("Welcome");
  };

  const navigateToConfirmation2 = () => {
    navigation.navigate("Confirmation");
    setVisible(false);
  };

  return (
    <>
      <>
        <ModalInstructions />
        {needstoConfirm ? (
          <ImageConfirmation
            testID="imageConfirmation"
            image={confirmUri}
            deleteFunction={deleteImageFromModal}
          />
        ) : null}
        <ScrollView>
          {isCameraOpen ? (
            <View style={styles.container}>
              <CameraComponent
                zoom={changeZoom}
                setCam={setCamera}
                closeCamera={closeCamera}
                takePicture={takePicture}
                type={type}
                flash={flash}
                testID="CamComponent"
                handleFlash={handleFlash}
              />
            </View>
          ) : (
            <View style={styles.container}>
             
              {uploadingToFirebase ? (
                <SuccessModal
                  navigationFunction={navigateToConfirmation2}
                  testID="SuccessModal"
                />
              ) : (
                <Text style={styles.textInput}>
                  Please select or take all necessary photos before you press
                  "Submit Photos"{" "}
                </Text>
              )}
              <TouchableOpacity testID="Gallery" onPress={pickImage}>
                <Text style={styles.txt}>
                  {" "}
                  <IconButton icon="image" size={100} />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity testID="Camera" onPress={openCamera}>
                <Text style={styles.txt}>
                  {" "}
                  <IconButton icon="camera" size={100} />
                </Text>
              </TouchableOpacity>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                testID="imageScrollView"
              >
                {uploading
                  ? image.map((images, index) => {
                      return (
                        <View
                          key={index}
                          style={{ flexDirection: "row" }}
                          testID="imageArray"
                        >
                          {!uploadingToFirebase ? (
                            <Pressable
                              testID="delete"
                              key={uuid.v4()}
                              onPress={() => deleteImage(images)}
                            >
                              <Icon key={uuid.v4()} name="cancel" />
                            </Pressable>
                          ) : null}

                          <View style={styles.imgContainer}>
                            <Pressable testID="imageSmall">
                              <Image
                                key={uuid.v4()}
                                source={{ uri: images }}
                                style={styles.image}
                                resizeMode="center"
                              />
                            </Pressable>
                          </View>

                          {uploadingToFirebase ? (
                            <Icon key={uuid.v4()} name="check" />
                          ) : null}
                        </View>
                      );
                    })
                  : null}
              </ScrollView>

              <Text style={styles.txt}>
                {!hideButton ? (
                  <Button
                    mode="elevated"
                    onPress={handleFirebaseURI}
                    testID="Submit"
                    className="Submit"
                    id="Submit"
                  >
                    Submit Photos
                  </Button>
                ) : (
                  <ActivityIndicator size="large" color="#8fc33b" />
                )}
              </Text>

              <TouchableOpacity onPress={goBack} testID="goBack">
                <Text style={styles.txt}>
                  <Button mode="elevated">Go Back</Button>
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <Snackbar visible={visible}>
            <Text style={styles.errorMsg}>{errorMsg}</Text>
          </Snackbar>
        </ScrollView>
      </>
    </>
  );
};
// Style-sheet object
const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    textAlign: "center",

    width: "80%",
    marginRight: 8,
    padding: 3,
    fontSize: 20,
  },
  captureButton: {
    alignItems: "center",

    height: 50,
    width: 50,
    borderRadius: 50,
    justifyContent: "center",
  },
  txt: {
    color: "white",
    marginBottom: 10,
    marginTop: 10,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  errorMsg: {
    textAlign: "center",
    color: "#fff",
  },
  smallImg: {
    width: 100,
    height: 400,
  },
  bigImg: {
    flex: 1,
    height: 300,
    width: 200,
  },
  imgContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    height: 300,
    width: 200,
  },
});
export default SubmitImage;
