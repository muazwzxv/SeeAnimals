import io
from fastapi import FastAPI
from PIL import Image
from fastapi.datastructures import UploadFile, File

app = FastAPI(
    title="Serving Yolov5",
    description="visit port 8080/docs for the FastAPI documentation",
    version="0.01"
)


@app.get("/")
async def home():
    return {"message": "Hello world"}


@app.post("/yolo")
def process_yolo(file: UploadFile = File(...)):
    file_bytes = file.file.read()
    image = Image.open(io.BytesIO(file_bytes))
