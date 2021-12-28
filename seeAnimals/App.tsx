import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
} from "react-native";

import { Camera } from "expo-camera";
import { useEffect, useState } from "react";
import { Header } from "./components/header";
import Colors from "./constants/colors";
import { ICameraDims, ICameraPermissions } from "./types";

let cameraref: any;

const captureHandler = async () => {
  if (cameraref !== null) {
    const image = await cameraref;
  }
};

export default function App() {
  const [hasPermission, setHasPermission] = useState<ICameraPermissions | null>(
    null
  );
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [cameraDims, setCameraDims] = useState<ICameraDims | null>();
  const [capturedImage, setCaptureImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") setHasPermission({ allowed: true, status });
    })();
  }, []);

  if (hasPermission === null) return <View />;
  if (hasPermission.allowed === false) return <Text> No Access to Camera</Text>;

  return (
    <View style={styles.container}>
      <Header title="SeeAnimals" />
      <View style={styles.screen}>
        <View
          style={styles.camera}
          onLayout={(event) => {
            setCameraDims({ event: event.nativeEvent.layout });
          }}
        >
          {/* {capturedImage ? (
          <TouchableWithoutFeedback
              onPress={() => {
                // trigger event
                console.log("event is triggered here")
                
              }}
          >
              <Image
                  source={{ uri: capturedImage }}
                  style={styles.camera}
              />
          </TouchableWithoutFeedback>
        ) : (
            <Camera
                style={styles.camera}
                type={type}
                ref={(r) => {
                    cameraref = r;
                }}
            ></Camera>
        )}  */}
          <View></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    borderBottomColor: "#eee",
    borderLeftColor: "white",
    borderRightColor: "white",
    borderTopColor: "white",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    textAlign: "center",
  },

  // container
  screen: {
    flex: 6,
    maxHeight: "70%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  predictions: {
    flex: 1,
    maxHeight: "10%",
    alignContent: "center",
    marginLeft: "2%",
  },

  // camera screen
  camera: {
    flex: 14,
    marginTop: 0,
    height: "66%",
    width: "100%",
  },
  rectangle: {
    height: 128,
    width: 128,
    position: "absolute",
    zIndex: 99,
    top: 0,
    left: 0,
    borderWidth: 1,
  },

  buttonContainer: {
    flex: 1,
    width: "90%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    padding: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "rgb(250,250,250)",
    width: 95,
    height: 45,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.button,
    elevation: 4,
  },
  text: {
    fontWeight: "bold",
    color: Colors.button,
  },

  // new
  itemContainer: {
    justifyContent: "flex-end",
    borderRadius: 5,
    padding: 10,
    height: 50,
  },
  itemName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  itemCode: {
    fontWeight: "600",
    fontSize: 12,
    color: "#fff",
  },
});
