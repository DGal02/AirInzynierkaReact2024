# Project setup
You have to install Node.js https://nodejs.org/en/download/package-manager
and optionally git https://git-scm.com/downloads

``` git clone https://github.com/DGal02/AirInzynierkaReact2024.git ``` or download .zip
### `npm ci`
### `npm install`
Set your IP to similar network as STM's (192.168.1.10) eg. 192.168.1.11.
# How to run project
### `node server.js`
To run websocket on  localhost:8080, to communicate with STM32 (192.168.1.10:5001).
### `npm start`
To run the app in the development mode.
Open http://localhost:3000 to view it in your browser. If port is already taken terminal will show you available port.
# How to build project
### `npm run build`
To download package for running http server
### `npm install -g serve`
To run a http server after building application
### `serve -s build`
# Run project with Docker
In `.docker` folder you can run docker commands.
### `docker compose up`
To turn on container

You can add `-d` parameter to run container in the background also you can add `--build` to rebuild container
### `docker compose up -d --build`
To run rebuild container and run it in the background
### `docker compose down`
To turn off container