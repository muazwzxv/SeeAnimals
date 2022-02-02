
# SeeAnimals

## Final Year Project 2022

- This is my final year project for my Bachelor's Degree in Computer Science
- Basically its just a cnn model to detect animals

### seeAnimals Websocket
- Model created is YOLO V5 model in Pytorch
- Service to expose a websocket server for the client to connect
- Serve the model through websockets
- Model are loaded up in this service
- Created with Python + FastAPI (Pretty decent documentation, not a huge fan of Python but a lovely experience)

### seeAnimals Mobile
- Serves as the client application for users to interact
- Websocket listener, establishes connection to server
- The UI is shit af, but idc tbh. Function over form HAHAHAH
- Written in React Native Expo
- Uses Typescript language (Gotto have my type safety stuff)

### SeeAnimals Store
- Basically a CRUD Rest API keeping tabs of the model's prediction
- The database column is still not finalised, still trying to figure out what data is relevant to store
- Future plan to create a dashboard to monitor model's performance
- Uses Mysql as of now for persistent store
- Written in Go + Fiber with Gorm as an ORM and migration tools

### Disclaimer
- Using Go for the websocket server is much faster? 

Muaz: Yes it is, but the server is also the place I load my model, I use Python just for the sake of continuity since the model itself is a pytorch object

- The UI is so bad?

Muaz: Yes i know, HAHAHHAHA. Submit a pull request then, i would love to see new design

- Where is the model file?

Muaz: Not in the repo unfortunately, do lemme know if you want it
