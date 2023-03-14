from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Message(db.Model):
    __tablename__ = 'messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    chat_gpt_instance = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('chat_gpt.id'), ondelete='CASCADE'))
    message = db.Column(db.Text())
    created_at = db.Column(db.Date, default=datetime.now(tz=None), nullable=False)

    user = db.relationship("User", back_populates='messages')
    chat_gpt_instance = db.relationship("Chat_GPT", back_populates='messages')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'chat_gpt_instance': self.chat_gpt_instance,
            'message': self.message,
            'created_at': self.created_at
        }
