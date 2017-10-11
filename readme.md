# ag-qrcode-scanner
This repo contains a desktop app (using electron and electron-cli) to scan a QRCode.

### Features
* Scans QR Code (and automatically stops scanning upon success)
* Shows results of the scan in green

### Usage
* For standalon app, use the dist folder and execute the batch file `start.bat`.

* You can also `git clone` this repo and use electron to start:
```
git clone https://github.com/antimo2001/ag2-qrcode-scanner.git
cd ag2-qrcode-scanner
npm install
## use npm start or electron .
npm start
```

* Note the above method assumes git and Node 6.11+ is installed on your machine.