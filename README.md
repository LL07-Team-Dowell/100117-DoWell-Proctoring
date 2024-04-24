# 🚀 DoWell Proctoring

---

## 🛠️ Setup Instructions

Follow these steps to set up the DoWell Proctoring application on your local machine:

---

### 🌐 Environment Configuration

1. **Create a `.env` File for Application**

    At the root directory of the project, create a `.env` file with the following content:
    ```env
    ZOOKEEPER_HOST=<YOUR_PRIVATE_IP>
    KAFKA_HOST=<YOUR_PRIVATE_IP>
    ```

---

### 🖥️ Backend Setup

1. **Navigate to Backend Directory**

    Change your directory to the `backend` folder:
    ```bash
    cd backend
    ```

2. **Create a `.env` File for Backend**

    Inside the `backend` directory, create a `.env` file with the following content:
    ```env
    PORT=8005
    IP = <YOUR_PRIVATE_IP>:9092
    MONGO_DB_URI=mongodb://mongo:27017/<YOUR_DATABASE_NAME>
    FRONTEND_URLS=["http://localhost:4173", "http://localhost:5173", "http://192.64.86.227:4173"]
    ```

5. **Run Docker Compose**

    Execute the following command in the terminal to start the application using Docker Compose:
    ```bash
    docker compose up 
    ```

---

### 🛑 Additional Commands

- **Stop the Containers**
    ```bash
    docker compose down
    ```

- **Check Container Logs**
    ```bash
    docker logs <container_name> -f
    ```

---

### 🌟 Accessing the Application

Once the Docker containers are up and running, you can access the DoWell Proctoring application by opening your web browser and navigating to:

```http
http://localhost:9000
