# Pomodoro Time Tracker
> This is a web app of the pomodoro time tracker.


## Architecture
The front end is devloped by React, redux, axios and bootstrap.

The back end is implemented by Node.js and hapi.js.

The front end and back end communicate with each other on REST APIs.

I use the automated testing based on selenium and unittest in python.

## Installation and Development


### Prerequisite:

- npm or yarn

### Installation

Clone the repository to you local or download the repository.

#### Backend

In the root directory, go to the 'dummy\_node\_server' directory, run the command to install the dependencies.

```sh
npm install
```

Then run the backend on the local server.

```sh
npm start
```
You can change the configuration like port number of the back end in 'app.js'.

#### Frontend

In the root directory, go to the 'PTTWeb' directory, run the command to install the dependencies.

```sh
npm install
```

Then run the application on the local server.

```sh
npm start
```

### Testing
For automated testing, go into the 'PTTWeb/test' directory, run the command to install the packages:

```sh
pip3 install requirements.txt
```

Then run the command to do the automated testing:

```sh
python3 runtests.py
```

After the automated testing, it will generate the log file and testing reports.

## Usage example

The demo of this web app is shown in the video.

[![cover](screenshots/cover.jpg)](https://www.youtube.com/embed/JO7ZQrm9zBQ)


## Meta
Xu Liu

## Acknowledge
- react
- redux
- axios
- bootstrap
- momoent
- lodash
- hapi.js
