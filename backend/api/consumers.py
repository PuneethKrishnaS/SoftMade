import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Ticket, TicketMessage

User = get_user_model()

class TicketChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.ticket_id = self.scope['url_route']['kwargs']['ticket_id']
        self.room_group_name = f'ticket_{self.ticket_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        sender_id = data.get('sender_id')

        if not message or not sender_id:
            return

        # Save message to database
        saved_msg = await self.save_message(sender_id, self.ticket_id, message)
        if not saved_msg:
            return

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'id': saved_msg.id,
                'message': saved_msg.message,
                'sender_id': sender_id,
                'sender_name': saved_msg.sender.get_full_name() or saved_msg.sender.username,
                'sender_role': saved_msg.sender.role,
                'created_at': saved_msg.created_at.isoformat()
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'id': event['id'],
            'message': event['message'],
            'sender_id': event['sender_id'],
            'sender_name': event['sender_name'],
            'sender_role': event['sender_role'],
            'created_at': event['created_at']
        }))

    async def status_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'status_update',
            'status': event['status']
        }))

    @database_sync_to_async
    def save_message(self, sender_id, ticket_id, message_text):
        try:
            sender = User.objects.get(id=sender_id)
            ticket = Ticket.objects.get(id=ticket_id)
            msg = TicketMessage.objects.create(
                ticket=ticket,
                sender=sender,
                message=message_text
            )
            return msg
        except (User.DoesNotExist, Ticket.DoesNotExist):
            return None
