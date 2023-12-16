# Fliki Chat

## Description

Fliki Chat is a web application designed to provide users the capability to create and join and communicate on their respective group chats. Frontend was built using **React + TS + Vite** and the Backend is an API server created using **NodeJS + Express + MongoDB**.

## Running the App

Codebase was dockerized to ease staring the whole app. Below is the command for running the app using docker.

```bash
docker-compose up --build
```

You can still run the app without docker by follwing the commands below:

```bash
# Staring Server
$ cd be
$ npm install
$ npm run build
$ npm run start

# Staring Server
$ cd ../fe
$ npm install
$ npm run build
$ npm run preview
```

Regardless of the path taken above, you can now open the Web App at [http://localhost:3000](http://localhost:3000). To access the server API directly, go to [http://localhost:4000](http://localhost:4000).
