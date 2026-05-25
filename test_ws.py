import asyncio
import websockets
import sys

async def test_ws():
    uri = "ws://127.0.0.1:8000/ws/tickets/1/"
    print(f"Connecting to {uri}...")
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected!")
            await websocket.send('{"message":"Hello", "sender_id":1}')
            print("Message sent.")
            response = await websocket.recv()
            print(f"Received: {response}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_ws())
