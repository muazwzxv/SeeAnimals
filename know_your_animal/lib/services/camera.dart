import 'package:flutter/material.dart';

import 'package:camera/camera.dart';

List<CameraDescription> cameras = [];

class Camera extends StatefulWidget {
  @override
  _CameraAppState createState() => _CameraAppState();
}

class _CameraAppState extends State<Camera> {
  CameraController? controller;
  CameraImage? cameraImage;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
    );
  }
}
