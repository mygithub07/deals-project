
import requests
import numpy as np
import cv2
import base64
from PIL import Image
from io import BytesIO

def unsharp_mask(image, amount=1.2, radius=1, threshold=5):
    """
    Apply unsharp masking with controlled sharpening to prevent edge distortion.
    - Uses Gaussian Blur and thresholding to enhance details without halos.
    """
    blurred = cv2.GaussianBlur(image, (radius * 2 + 1, radius * 2 + 1), 0)
    sharpened = cv2.addWeighted(image, 1 + amount, blurred, -amount, 0)
    
    # Edge preservation: Prevent excessive sharpening in smooth areas
    if threshold > 0:
        low_contrast_mask = np.abs(image - blurred) < threshold
        sharpened = np.where(low_contrast_mask, image, sharpened)
    
    return sharpened.astype(np.uint8)

def validate_image(content):
    """Check if the downloaded content is a valid image using PIL before OpenCV."""
    try:
        img = Image.open(BytesIO(content))
        img.verify()  # Verify that this is a real image
        return True
    except Exception:
        return False



def resize_image_2(image_url, new_width):
    """
    Fetches an image from a URL, resizes it while maintaining aspect ratio, and returns a base64-encoded image.

    Args:
        image_url (str): URL of the image.
        new_width (int): The desired width of the resized image.

    Returns:
        str: Base64-encoded resized image.
    """
    try:
        # Fetch image with headers to prevent blocking
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": image_url  # Helps bypass some site restrictions
        }
        response = requests.get(image_url, headers=headers, timeout=10)

        if response.status_code == 200:
            # Open the image from response content
            image = Image.open(BytesIO(response.content))
            width, height = image.size

            # Calculate the new height based on aspect ratio
            new_height = int(new_width * height / width)

            # Resize the image while keeping aspect ratio
            resized_image = image.resize((new_width, new_height), Image.LANCZOS)

            # Convert to base64
            buffered = BytesIO()
            resized_image.save(buffered, format="JPEG")  # Save as JPEG for compatibility
            return base64.b64encode(buffered.getvalue()).decode('utf-8')

        else:
            print(f"⚠️ Failed to fetch image: {image_url} (Status {response.status_code})")
            return None

    except Exception as e:
        print(f"⚠️ Error resizing image: {e}")
        return None


'''
def resize_image(image_url, target_size=(220, 200)):
    """Fetch image, resize while maintaining aspect ratio, apply edge-preserving sharpening, and return base64 image."""
    try:
        response = requests.get(image_url, timeout=5)
        if response.status_code == 200:
            img_array = np.asarray(bytearray(response.content), dtype=np.uint8)
            img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

            if img is None:
                print("⚠️ Failed to decode image.")
                return None

            (h, w) = img.shape[:2]

            # Select interpolation method based on whether image is upscaled or downscaled
            if max(target_size) < max(h, w):
                interpolation = cv2.INTER_AREA  # Best for downscaling (avoids loss of quality)
            else:
                interpolation = cv2.INTER_LANCZOS4  # Best for upscaling (avoids jagged edges)

            # Maintain aspect ratio
            r = min(target_size[0] / float(w), target_size[1] / float(h))
            new_width = int(w * r)
            new_height = int(h * r)

            resized = cv2.resize(img, (new_width, new_height), interpolation=interpolation)

            # Create a white canvas and place the resized image (align at top)
            new_image = np.ones((target_size[1], target_size[0], 3), dtype=np.uint8) * 255
            x_offset = (target_size[0] - new_width) // 2
            new_image[0:new_height, x_offset:x_offset + new_width] = resized

            # Apply bilateral filtering instead of direct unsharp masking to preserve edges
            smooth_image = cv2.bilateralFilter(new_image, d=9, sigmaColor=75, sigmaSpace=75)

            # Apply unsharp mask with tuned parameters
            sharpened_image = unsharp_mask(smooth_image, amount=1.2, radius=1, threshold=5)

            # Encode the image as JPEG with high quality
            _, buffer = cv2.imencode('.jpg', sharpened_image, [cv2.IMWRITE_JPEG_QUALITY, 98])

            return base64.b64encode(buffer).decode('utf-8')

        else:
            print(f"⚠️ Failed to fetch image: {image_url}")
            return None

    except Exception as e:
        print(f"⚠️ Error resizing image: {e}")
        return None
'''

def fetch_image_with_headers(image_url):
    """Fetches an image with headers to bypass anti-bot protection."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.imagehandler.net",  # Important for some sites
        "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "Connection": "keep-alive"
    }

    try:
        response = requests.get(image_url, headers=headers, timeout=10, allow_redirects=True)

        if response.status_code == 200:
            return response.content  # Return raw image data
        elif response.status_code == 403:
            print(f"❌ 403 Forbidden – The server is blocking our request: {image_url}")
        else:
            print(f"⚠️ Failed to fetch image: {image_url} (Status {response.status_code})")
    
    except requests.exceptions.RequestException as e:
        print(f"⚠️ Request failed: {e}")

    return None

def resize_image(image_url, target_size=(220, 200)):
    """Fetch image, validate, resize, apply sharpening, and return base64 image."""
    try:
        image_data = fetch_image_with_headers(image_url)
        
        if not image_data:
            return None  # Return if image couldn't be fetched

        # Convert fetched data to an image
        img_array = np.asarray(bytearray(image_data), dtype=np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        if img is None:
            print("⚠️ OpenCV failed to decode image.")
            return None

        (h, w) = img.shape[:2]

        # Choose interpolation method (downscaling: INTER_AREA, upscaling: INTER_LANCZOS4)
        interpolation = cv2.INTER_AREA if max(target_size) < max(h, w) else cv2.INTER_LANCZOS4

        # Maintain aspect ratio
        r = min(target_size[0] / float(w), target_size[1] / float(h))
        new_width = int(w * r)
        new_height = int(h * r)

        resized = cv2.resize(img, (new_width, new_height), interpolation=interpolation)

        # Create a white canvas and center the image
        new_image = np.ones((target_size[1], target_size[0], 3), dtype=np.uint8) * 255
        x_offset = (target_size[0] - new_width) // 2
        new_image[0:new_height, x_offset:x_offset + new_width] = resized

        # Apply sharpening (bilateral filter + unsharp mask)
        smooth_image = cv2.bilateralFilter(new_image, d=9, sigmaColor=75, sigmaSpace=75)
        sharpened_image = unsharp_mask(smooth_image, amount=1.2, radius=1, threshold=5)

        # Encode as JPEG
        _, buffer = cv2.imencode('.jpg', sharpened_image, [cv2.IMWRITE_JPEG_QUALITY, 98])
        return base64.b64encode(buffer).decode('utf-8')

    except Exception as e:
        print(f"⚠️ Error resizing image: {e}")
        return None
    
    
from PIL import Image
import io
import base64
import os

def nourl_image(image_path):
    """Resizes the image to 220x200 px and returns the image data in base64 format."""
    try:
        # Ensure the image path exists
        if os.path.exists(image_path):
            # Open the image file and resize it
            with Image.open(image_path) as img:
                resized_img = img.resize((220, 200))
                
                # Save the image in a byte stream
                img_byte_arr = io.BytesIO()
                resized_img.save(img_byte_arr, format='PNG')
                img_byte_arr = img_byte_arr.getvalue()
                
                # Convert the image data to base64 string
                img_base64 = base64.b64encode(img_byte_arr).decode('utf-8')
                
                return img_base64
        else:
            print(f"❌ Image path does not exist: {image_path}")
            return None
    except Exception as e:
        print(f"Error resizing image: {e}")
        return None
