import io
import uvicorn
import uuid
from fastapi import FastAPI
from PIL import Image
from fastapi import UploadFile, File
from yolov5 import *
from starlette.responses import Response

app = FastAPI(
    title="Serving Yolov5",
    description="visit port 8080/docs for the FastAPI documentation",
    version="0.01"
)


@app.get("/")
async def home():
    return {"message": "Hello world"}


# Endpoint to test using REST
@app.post("/yolo")
def process_yolo(file: UploadFile = File(...)):
    file_bytes = file.file.read()
    image = Image.open(io.BytesIO(file_bytes))

    name = f"/predicted/{str(uuid.uuid4())}.png"

    image.filename = name
    classes, converted = yolov5(image)

    bytes_io = io.BytesIO()

    converted.save(name)
    converted.save(bytes_io, format="png")

    return Response(bytes_io.getvalue(), media_type="image/png")
