# FastAPI Hello World Backend

A simple, beginner-friendly FastAPI backend with a single endpoint `GET /hello` that waits for exactly 10 seconds to simulate a long-running task before returning a JSON response.

This project is fully structured and documented for local development and direct deployment to an **AWS EC2 instance**.

## Features
- **Single Simple Endpoint**: `GET /hello` with a 10-second asynchronous wait time.
- **Asynchronous Execution**: Uses `asyncio.sleep` to ensure the server remains fully responsive to other requests during the simulated delay.
- **Ready for AWS EC2**: Pre-configured to bind to host `0.0.0.0` and port `8000`.

---

## Local Setup & Running

Follow these simple steps to run this server on your local machine:

### 1. Prerequisites
Make sure you have **Python 3.8 or higher** installed. You can check your version by running:
```bash
python --version # or python3 --version
```

### 2. Create a Virtual Environment (Recommended)
Creating a virtual environment keeps your project's dependencies isolated:
```bash
# Create the virtual environment named 'venv'
python -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows (Command Prompt):
venv\Scripts\activate
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
```

### 3. Install Dependencies
Install FastAPI and Uvicorn using the `requirements.txt` file:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Run the Server
Start the Uvicorn development server:
```bash
python main.py
# Or run via uvicorn directly:
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Your server will be running at **`http://localhost:8000`**.

### 5. Test the Endpoint
You can test the endpoint using your browser, `curl`, or an API client:
```bash
curl http://localhost:8000/hello
```
*Note: The request will take exactly 10 seconds to complete, then return:*
```json
{
  "message": "Hello"
}
```

---

## Deployment on an AWS EC2 Instance

This guide explains how to deploy this FastAPI application on an Amazon EC2 Linux instance.

### Step 1: Launch your AWS EC2 Instance
1. Log in to your AWS Management Console and open the EC2 Dashboard.
2. Click **Launch Instance**.
3. Choose an AMI (e.g., **Ubuntu Server 22.04 LTS** or **Amazon Linux 2023**).
4. Select an instance type (e.g., `t2.micro` which is free-tier eligible).
5. Create or select a **Key Pair (.pem)** for SSH access.
6. **Configure Security Group**:
   - Allow **SSH** (Port 22) from your IP.
   - Add a custom TCP rule to allow inbound traffic on **Port 8000** from **Anywhere (0.0.0.0/0)** so the FastAPI server can receive external traffic.
7. Click **Launch Instance**.

### Step 2: Connect to your EC2 Instance
Using your terminal, connect via SSH using your `.pem` key:
```bash
ssh -i /path/to/your-key.pem ubuntu@your-ec2-public-ip
```

### Step 3: Install Python and Pip
On your EC2 terminal, update package lists and install python:
```bash
sudo apt update
sudo apt install python3-pip python3-venv -y
```

### Step 4: Clone/Upload Project Files
You can clone your git repository containing these files, or upload them using `scp` / `sftp`:
```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### Step 5: Setup Virtual Environment and Install Dependencies
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 6: Run the Server in the Background (Systemd Service)
To keep your API running even after you close your SSH terminal, you should run it as a system service.

1. Create a service file:
   ```bash
   sudo nano /etc/systemd/system/fastapi.service
   ```

2. Paste the following configuration (replace `/home/ubuntu/your-repo-folder` with your actual path):
   ```ini
   [Unit]
   Description=FastAPI Hello World Application
   After=network.target

   [Service]
   User=ubuntu
   WorkingDirectory=/home/ubuntu/your-repo-folder
   ExecStart=/home/ubuntu/your-repo-folder/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

3. Save and close (Ctrl+O, Enter, Ctrl+X).

4. Start and enable the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start fastapi
   sudo systemctl enable fastapi
   ```

5. Check the status to ensure it is running successfully:
   ```bash
   sudo systemctl status fastapi
   ```

### Step 7: Test Your EC2 Endpoint
Access the endpoint from your local machine:
```bash
curl http://<your-ec2-public-ip>:8000/hello
```
Congratulations! Your simple FastAPI service is now securely deployed on AWS EC2!
