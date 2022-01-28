import base64
import io
import uvicorn
import uuid
from fastapi import FastAPI
import json
from fastapi import UploadFile, File, WebSocketDisconnect, WebSocket
from yolov5 import *
from connection import *
from starlette.responses import Response
import requests

app = FastAPI(
    title="Serving Yolo V5",
    description="visit port 8080/docs for the FastAPI documentation",
    version="0.01"
)

connection = ConnectionManager()


def postToStore(result):
    payload = {
        "class": result.get("class"),
        "accuracy": result.get("prediction")
    }
    res = requests.post("http://localhost:4444/api/record", data=payload)
    if res.ok == True:
        print("Request is okay")
    pritn("Request is faulty")


@app.websocket("/ws/{id}")
async def process_yolo_ws(websocket: WebSocket, id: int):
    await connection.connect(websocket)
    print(f"New Client connected: {websocket}")
    try:
        while True:
            data = await websocket.receive_text()

            # convert to PIL image
            find = data.find(",") + 1
            image = data[find:]
            dec = base64.b64decode(image + "===")
            image = Image.open(io.BytesIO(dec)).convert("RGB")

            # Process the image
            name = f"/{str(uuid.uuid4())}.png"

            image.filename = name
            classes, converted_img = yolov5(image)

            result = {
                "prediction": json.dumps(classes),
                # "output": base64_encode_img(converted_img),
            }

            print(result)

            # Post to store
            # postToStore(result)

            # Send back the result
            await connection.send_message(json.dumps(result), websocket)
    except WebSocketDisconnect:
        connection.disconnect(websocket)
        await connection.broadcast(f"Client #{id} has left the server")


@app.get("/")
async def home():
    return {"message": "Hello world"}


# Endpoint to test using REST
@app.post("/yolo")
def process_yolo(file: UploadFile = File(...)):
    file_bytes = file.file.read()
    image = Image.open(io.BytesIO(file_bytes))

    name = f"{str(uuid.uuid4())}.png"

    image.filename = name
    classes, converted = yolov5(image)

    bytes_io = io.BytesIO()

    converted.save(name)
    converted.save(bytes_io, format="png")

    return Response(bytes_io.getvalue(), media_type="image/png")
    # return {"classes": classes}


def base64_encode_img(img):
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    buffered.seek(0)
    img_byte = buffered.getvalue()
    encoded_img = "data:image/png;base64," + \
        base64.b64encode(img_byte).decode()
    return encoded_img


if __name__ == '__main__':
    uvicorn.run(app, port=8080, host='0.0.0.0')
