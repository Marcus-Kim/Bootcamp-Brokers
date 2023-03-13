from .db import db, environment, SCHEMA, add_prefix_for_prod

class Chat_GPT(db.Model):
    __tablename__ = 'chat_gpt'

    id = db.Column(db.Integer, primary_key=True)
    last_message_id = db.Column(db.String(255), db.ForeignKey(add_prefix_for_prod('messages.id')))

    messages = db.relationship("Message", back_populates='chat_gpt_instance')

    def to_dict(self):
        return {
            'id': self.id,
            'last_message_id': self.last_message_id
        }
