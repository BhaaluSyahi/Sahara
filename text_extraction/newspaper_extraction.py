import cv2
import numpy as np

def get_boundary(image_path):
    image = cv2.imread(image_path)
    if image is None: return

    image_resized = cv2.resize(image, (500, 600))
    gray = cv2.cvtColor(image_resized, cv2.COLOR_BGR2GRAY)


    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                   cv2.THRESH_BINARY_INV, 11, 5)


    kernel_h = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 1))
    dilated = cv2.dilate(thresh, kernel_h, iterations=1)

    kernel_v = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 5))
    dilated = cv2.dilate(dilated, kernel_v, iterations=2)
    kernel_erode = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    dilated = cv2.erode(dilated, kernel_erode, iterations=1)

    # cv2.imshow('dilated', dilated)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

    # for c in contours:
    #     if cv2.contourArea(c) > 100:
    #         x, y, w, h = cv2.boundingRect(c)
    #         cv2.rectangle(image_resized, (x, y), (x + w, y + h), (0, 255, 0), 2)

    cv2.drawContours(image_resized, contours, -1, (0, 255, 0), 3)

    cv2.imshow('Resized Contours', image_resized)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

get_boundary("sample_image.jpeg")