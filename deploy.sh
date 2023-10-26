#!/bin/sh
docker build . -t tt-chat-fe-img

docker stop tt-chat-frontend > /dev/null 2>&1
docker rm tt-chat-frontend > /dev/null 2>&1

docker run --name tt-chat-frontend -d -p 80:80  tt-chat-fe-img