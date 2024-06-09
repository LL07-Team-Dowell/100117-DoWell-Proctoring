# 🚀 DoWell Proctoring

---

## 🛠️ Setup Instructions

Follow these steps to set up the DoWell Proctoring application on your local machine:

---

### 🌐 Environment Configuration

1. **Clone the `DoWell-Proctoring` Repo for the Application**

    At the root directory of the project, clone the projects repo:
    ```run
    git clone https://github.com/LL07-Team-Dowell/100117-DoWell-Proctoring.git
    ```

---

### 🖥️ Variables Setup

**Open `run_docker.sh` in an editor**

2. **Edit `mongodb_uri`**

    Change your mongodb_uri value to the `your-mongodb_uri-db-link` folder:
    ```run_docker.sh
    #mongodburi------------------------
    mongodb_uri= 'mongodb+srv://...'   
    ```

3. **Edit `kafka_topics`**

    Set the `n number of topics` for you kafkatopics and update accordingly:
    ```run_docker.sh
    topic1=NAME-OF-TOPIC
    topic2=NAME-OF-TOPIC 
    topic3=NAME-OF-TOPIC
    topicn=NAME-OF-TOPIC
    kafka_topics="[\"$topic1\"]"  ##kafka_topics="[\"$topic1\", \"$topic2\", \"$topic3\",\"$topicn\"]"

    ```
4. **Edit `frontendurls`**
    Set your `ipaddresses` for the end:
    ```run_docker.sh
    front_url1='http://localhost:4173'
    front_url2='http://localhost:5173'
    front_url3='http://ip_address:4173'

    ```
5. **Buil the docker containers**

    Execute the following command in the terminal to start the application using Docker Compose:
    ```bash
    chmod +x run_docker.sh
    ./run_docker.sh dev     ## for development server
    ./run_docker.sh prod    ## for production server

    ```

---

### 🛑 Additional Commands

- **Stop the Containers**
    ```bash
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.prod.yml down
    ```

- **Check Container Logs**
    ```bash
    docker ps
    docker logs <container_name> -f
    ```

---

### 🌟 Accessing the Application

Once the Docker containers are up and running, you can access the DoWell Proctoring application by opening your web browser and navigating to:

```browser
    https://your-ip-address:4173   ##frontend

```