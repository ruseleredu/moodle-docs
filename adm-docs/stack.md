---
title: STACK
description: STACK is the world-leading open-source (GPL) automatic assessment system for mathematics, science and related disciplines.
---

The main community website for STACK is https://stack-assessment.org/

## Testing Installation

It is important to confirm that STACK has been installed correctly, and that it is connecting to the CAS.
https://docs.stack-assessment.org/en/Installation/Testing_installation/

### maxima version

```bash
docker ps
docker exec -it goemaxima_container bash
maxima --list-avail
```

## Docker

```bash
# Create a directory for goemaxima
sudo mkdir -p /opt/goemaxima
cd /opt/goemaxima

# Save the compose file (copy from the artifact above)
sudo nano docker-compose.yml

# Create and start goemaxima
sudo docker compose up -d

sudo docker compose pull
```

### Update

```bash

# Create and start goemaxima
sudo docker compose down

sudo docker compose pull

sudo docker compose up -d


```

image: mathinstitut/goemaxima:2025073100-latest

docker-compose.yml

```yml
services:
  goemaxima:
    image: mathinstitut/goemaxima:2025040100-latest
    container_name: goemaxima_container
    ports:
      - "8081:8080"
    restart: unless-stopped
    environment:
      - MAXIMA_OPTION=default # replace or extend with actual options if needed
    volumes:
      - ./data:/app/data # mount a volume if the container needs local storage
```
