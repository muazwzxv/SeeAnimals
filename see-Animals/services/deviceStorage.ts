import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";

exports.storeJWt = async (token: string) => {
  try {
    await AsyncStorage.setItem("jwt", token);
  } catch (e) {
    // just throw the error for now
    throw e;
  }
};

exports.readJwt = async (): Promise<string | null> => {
  try {
    const val: string | null = await AsyncStorage.getItem("jwt");
    if (val !== null) throw Error("jwt is null");

    return val;
  } catch (e) {
    throw e;
  }
};
