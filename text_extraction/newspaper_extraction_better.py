import cv2
import pytesseract
import numpy as np



def get_boundary(image_path):
    image = cv2.imread(image_path)
    if image is None: return

    image_resized = cv2.resize(image, (500, 600))
    gray_image = cv2.cvtColor(image_resized, cv2.COLOR_BGR2GRAY)
    cv2.imshow('Grayscale', gray_image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    gaussian_thresh = cv2.adaptiveThreshold(gray_image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                            cv2.THRESH_BINARY_INV, 11, 5)
    
    cv2.imshow('Gaussian threshold', gaussian_thresh)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


get_boundary("sample_image.jpeg")