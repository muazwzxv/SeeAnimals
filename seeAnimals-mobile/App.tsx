import { StyleSheet, View } from "react-native";

import React from "react";
import { Header } from "./components/header";
import Colors from "./constants/colors";
import { Viewer } from "./components/viewer";

export default function App() {
  return (
    <View style={styles.container}>
      <Header title="SeeAnimals" />
      <Viewer />
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
