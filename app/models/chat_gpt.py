from .db import db, environment, SCHEMA, add_prefix_for_prod

class Chat_GPT(db.Model):
    __tablename__ = 'chat_gpt'

    id = db.Column(db.Integer, primary_key=True)
    last_message = db.Column(db.String(255))

    messages = db.relationship("Message", back_populates='chat_gpt')
