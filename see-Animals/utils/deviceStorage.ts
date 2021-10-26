import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

const deviceStorage = {
  async saveItem(key: string, val: string) {
    try {
      await AsyncStorage.setItem(key, val);
    } catch (err) {
      alert("AsyncStorage Error: " + err);
    }
  },

  async loadJWT() {
    const [temp, setTemp] = useState("");
    try {
      const value: string | null = await AsyncStorage.getItem("token");

      if (value !== null) {
        setTemp(value);
        return;
      }
    } catch (err) {
      alert(err);
    }
  },

  async deleteJwt() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
    } catch (err) {
      alert(err);
    }
  },
};

export default deviceStorage;
