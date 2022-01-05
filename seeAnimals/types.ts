import { LayoutRectangle } from "react-native";

export interface ICameraPermissions {
  allowed: boolean;
  status: string;
}

export interface ICameraDims {
  event: LayoutRectangle;
}

export interface SocketResponse {
  prediction: string[];
}
