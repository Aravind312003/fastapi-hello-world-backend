# main.py
"""
FastAPI Hello World Backend

A simple FastAPI application with a single endpoint GET /hello that simulates
a 10-second long-running task and returns {"message": "Hello"}.

Ready for deployment on an AWS EC2 instance.
"""

import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize the FastAPI application
app = FastAPI(
    title="FastAPI Hello World API",
    description="A simple, beginner-friendly FastAPI server simulating a long-running task.",
    version="1.0.0"
)

# Add CORS middleware to allow testing the API from local frontends or web browsers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to specific domains if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the GET /hello endpoint
@app.get("/hello")
async def get_hello():
    """
    Simulates a long-running task by waiting for exactly 10 seconds.
    After 10 seconds, returns the message 'Hello'.
    """
    print("GET /hello called. Starting 10-second processing task...")
    
    # Wait for exactly 10 seconds.
    # asyncio.sleep is non-blocking, allowing the server to handle other requests
    # during this wait time, unlike time.sleep which blocks the entire thread.
    await asyncio.sleep(10)
    
    print("10 seconds completed. Returning response.")
    
    # Return a dictionary, which FastAPI automatically converts to a JSON response
    return {"message": "Hello"}

# Entry point for running the server directly
if __name__ == "__main__":
    import uvicorn
    
    # Run the Uvicorn server
    # - "main:app" refers to this file (main.py) and the FastAPI instance (app)
    # - host="0.0.0.0" binds the server to all network interfaces, making it accessible externally
    # - port=8000 is the port on which the server will listen for incoming requests
    # - reload=True enables hot-reloading for local development (updates on file save)
    print("Starting server on http://0.0.0.0:8000")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
