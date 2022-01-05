import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const Card = (props: any) => {
  return (
    <View style={{ ...styles.card, ...props.style }}>{props.children}</View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    elevation: 5,
    backgroundColor: "white",
    borderRadius: 10,
  },
});
