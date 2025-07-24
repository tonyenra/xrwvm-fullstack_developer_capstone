# Uncomment the imports below before you add the function code
import requests
import os
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv(
    "backend_url")
sentiment_analyzer_url = os.getenv(
    "sentiment_analyzer_url")

def get_request(endpoint, **kwargs):
    # Asegura que backend_url no termina con '/'
    base = backend_url.rstrip("/")
    # Asegura que endpoint empieza con '/'
    if not endpoint.startswith("/"):
        endpoint = "/" + endpoint

    request_url = base + endpoint
    print("GET from:", request_url, "params:", kwargs)

    try:
        response = requests.get(request_url, params=kwargs)
        response.raise_for_status()  # lanza excepción si status != 200
        return response.json()
    except Exception as e:
        print("Network exception occurred:", e)
        return None

def analyze_review_sentiments(text):
    base = sentiment_analyzer_url.rstrip("/")
    request_url = f"{base}/analyze/{text}"
    try:
        response = requests.get(request_url)
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")
        return None

def post_review(data_dict):
    request_url = backend_url+"/insert_review"
    try:
        response = requests.post(request_url,json=data_dict)
        print(response.json())
        return response.json()
    except:
        print("Network exception occurred")

# Add code for posting review
