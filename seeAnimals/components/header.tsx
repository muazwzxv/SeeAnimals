import React from "react";
import { View, Text, StyleSheet } from "react-native";

import Colors from "../constants/colors";

interface IHeader {
  title: string;
}

export const Header = (props: IHeader) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}> {props.title} </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 90,
    paddingTop: 40,
    paddingBottom: 0,
    paddingLeft: 10,
    backgroundColor: Colors.primary,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#cae7df",
    fontSize: 25,
    fontWeight: "bold",
  },
});

export default Header;
