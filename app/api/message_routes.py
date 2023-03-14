from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
import openai
from app.models import Transaction
from ..models.db import db
from datetime import datetime
import os
import requests
import json
from flask_cors import cross_origin

openai.organization = 'org-XR2r7wnA6AEOn3Wru82vYium'
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.Model.list()

message_routes = Blueprint('messages', __name__)

# Get Chat history of user
@message_routes.route('/<int:id>')
@login_required
def get_all_chats():
    pass


# Delete chat history of user

# Create chat history of user
@message_routes.route('/', methods=['POST'])
@cross_origin()
def chat():
    data = request.get_json()
    user_message = data['message']

    url = 'https://api.openai.com/v1/chat/completions'
    headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {openai.api_key}' # Replace with your API key
    }

    bot_response = {
        "model":"gpt-3.5-turbo",
        "messages": [
            {
                "role": "system",
                "content": "Sydney is a chatbot that is helpful, creative, clever, and very friendly and loves to assist people on the financial stock trading website Bootcamp Brokers:"
            },
            {
                "role": "user",
                "content": f"{user_message}"
            }
        ],
        "temperature": 1,
        "n": 2,
        "max_tokens": 150,
        "frequency_penalty": 0.0,
        "presence_penalty": 0.6
    }

    # This part assumes you have already imported the `requests` library
    response = requests.post(url, json=bot_response, headers=headers)
    response_data = response.json()

    message = Message(
        user_id = data['user_id'],
        message = user_message,
        created_at = datetime.now(),
    )
    db.session.add(message)
    db.session.commit()

    chatGPTReply = response_data['choices'][0]['message']['content']

    return jsonify({
        'message': chatGPTReply
    })
