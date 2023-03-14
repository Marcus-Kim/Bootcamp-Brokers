from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
import openai
from app.models import Transaction
from ..models.db import db
from datetime import datetime
import os
openai.api_key = os.getenv("OPENAI_API_KEY")

message_routes = Blueprint('messages', __name__)

# Get Chat history of user
@message_routes.route('/<int:id>')
@login_required
def get_all_chats():
    pass


# Delete chat history of user

# Create chat history of user
@message_routes.route('/', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message')

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages = [
            {
                "role": "system",
                "content": "Sydney is a chatbot that is helpful, creative, clever, and very friendly and loves to assist people on the financial stock trading website Bootcamp Brokers:"
            },
            {
                "role": "user",
                "content": f"{user_message}"
            }
        ],
        temperature = 1,
        n = 2,
        max_tokens = 150,
        frequency_penalty = 0.0,
        presence_penalty = 0.6,
    )

    message = Message(
        user_id = data.get('user_id'),
        message = user_message,
        created_at = datetime.now(),
    )
    db.session.add(message)
    db.session.commit()

    chatGPTReply = response.choices[0].message.content

    return jsonify({
        'message': chatGPTReply
    })