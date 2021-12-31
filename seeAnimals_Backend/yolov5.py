from json import detect_encoding
import logging
from dotenv import load_dotenv, find_dotenv
import os
import torch
from PIL import Image


load_dotenv(find_dotenv())

yolo = os.getenv("Model", "model.pt")

model = torch.hub.load('ultralytics/yolov5', 'custom',
                       path='./model.pt', force_reload=True)


def yolov5(img):

    results = model(img)

    detected = []
    names = results.names
    if results.pred is not None:
        pred = results.pred[0]
        if pred is not None:
            for c in pred[:, -1].unique():
                n = (pred[:, -1] == c).sum()
                detected.append(f"{n} {names[int(c)]}{'s' * (n > 1)}")

    logging.info(f"Detected Class : {detected}")

    rendered_img = results.render()
    converted_img = Image.fromarray(rendered_img[0]).convert("RGB")

    return detected, converted_img
