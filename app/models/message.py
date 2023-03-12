from .db import db, environment, SCHEMA, add_prefix_for_prod

class Message(db.Model):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)

    user = db.relationship("User", back_populates='messages')
    chat_gpt = db.relationship("Chat_GPT", back_populates='messages')
