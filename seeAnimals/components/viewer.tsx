import React, { useEffect, useRef, useState } from "react";
import { ICameraDims, ICameraPermissions, SocketResponse } from "../types";
import { Camera, CameraCapturedPicture } from "expo-camera";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { FlatGrid } from "react-native-super-grid";
import Colors from "../constants/colors";
import { API } from "../constants/api";

let cameraref: Camera | null;

const captureHandler = async () => {
  if (cameraref) {
    const image = await cameraref.takePictureAsync({
      base64: true,
      quality: 0,
    });
    return image;
  }
};

export const Viewer = () => {
  const [hasPermission, setHasPermission] = useState<ICameraPermissions | null>(
    null
  );

  const [type, setType] = useState(Camera.Constants.Type.back);
  const [cameraDims, setCameraDims] = useState<ICameraDims | null>();
  const [capturedImage, setCapturedImage] =
    useState<CameraCapturedPicture | null>();
  const [isPaused, setPaused] = useState<boolean>(false);
  const [predicted, setPredicted] = useState<string[]>([]);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    fetch("http://192.168.1.103:8080")
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status == "granted") setHasPermission({ allowed: true, status });
    })();
  }, []);

  useEffect(() => {
    const client = Date.now();
    const url = `${API.WS_SERVER}${client}`;
    console.log("To connect here", url);

    ws.current = new WebSocket(url);

    ws.current.onopen = () => console.log("Websocket open");
    ws.current.onerror = (err) => console.log("websocket error", err);
    ws.current.close = () => console.log("Websocket closed");

    return () => {
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!ws.current) return;

    ws.current.onmessage = (event) => {
      if (isPaused) return;
      const msg = JSON.parse(event.data);
      setPredicted(msg["prediction"]);

      console.log("predicted", msg["prediction"]);
      console.log("state", predicted);

      // setCapturedImage(msg.output);
    };
  }, [isPaused]);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission.allowed === false) {
    return <Text> No Access to Camera </Text>;
  }

  const sendMessage = (msg: CameraCapturedPicture | undefined) => {
    if (!ws.current) return;
    let stringified = JSON.stringify(msg?.base64);

    ws.current.send(stringified);
  };

  const resetHandler = () => {
    setCapturedImage(null);
  };

  const imageHandler = () => {
    captureHandler()
      .then((image) => {
        setCapturedImage(image); // check for the uri

        sendMessage(image);

        // getBoundingBoxes(image.base64.trim().replace(/\s/g, "+"));
      })
      .catch((err) => {
        console.log("error from image handler", err);
      });
  };

  return (
    <View style={styles.screen}>
      <View
        style={styles.camera}
        onLayout={(event) => {
          setCameraDims({ event: event.nativeEvent.layout });
        }}
      >
        {capturedImage ? (
          <TouchableWithoutFeedback
            onPress={() => {
              console.log("event is triggered here");
            }}
          >
            <Image source={{ uri: capturedImage.uri }} style={styles.camera} />
          </TouchableWithoutFeedback>
        ) : (
          <Camera
            style={styles.camera}
            type={type}
            ref={(r) => {
              cameraref = r;
            }}
          ></Camera>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.4}
            onPress={() => {
              console.log("attempt to flip camera");
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            // On press snap image action
            onPress={imageHandler}
            activeOpacity={0.4}
          >
            <Text style={styles.text}> Capture </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            // On press reset action
            onPress={resetHandler}
            activeOpacity={0.4}
          >
            <Text style={styles.text}> Reset </Text>
          </TouchableOpacity>
        </View>

        <Text>{"\n"}</Text>
        {predicted && (
          <FlatGrid
            staticDimension={80}
            data={[predicted]}
            // style={styles.predictions}
            spacing={30}
            itemDimension={250}
            horizontal={true}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.itemContainer,
                  { backgroundColor: "#7f8c8d", elevation: 3 },
                ]}
              >
                <Text style={styles.itemName}>{item}</Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

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
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    padding: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "rgb(250,250,250)",
    width: 100,
    height: 60,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 3,
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
