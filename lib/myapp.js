/**
 * this prototype app is for scanning and parsing a QR code
 */

//Define variables for all DOM elements
const videoElement = document.getElementById('video');
const scanButton = document.getElementById('scan');
const resultsElement = document.getElementById('results');
let debugLog = console.log;
// debugLog = () => 'noop';

let myNotification;

//Define all callbacks and helper functions
function showNotification(...args) {
  const [title, message] = args;
  myNotification = new Notification(title, {
    body: message
  });
  
  myNotification.onclick = () => {
    debugLog(`Notification clicked: title/message: ${title}/${message}`);
  }
}

function showScanSuccess(data) {
  const scannedData = `Scan Success: ${data}`;
  debugLog(scannedData);
  resultsElement.setAttribute('style', 'background-color: lightgreen;');
  resultsElement.innerHTML = `<em>${scannedData}</em>`;
  showNotification('Scan Success', data);
}

function showScanError(err) {
  // console.error(`***${err}`);
  resultsElement.setAttribute('style', 'background-color: yellow;');
  resultsElement.innerHTML = `<em>***Scan Failed: ${err} </em>`;
}

function scanQrCode(videoSelector) {
  //Enables the device's camera to start scanning
  //Returns a QrReader object as a resolved promise
  //See docs/samples at its Github: https://github.com/IagoLast/qrcodejs
  return QrReader.getBackCamera().then(device => {
    return new QrReader({
      sucessCallback: showScanSuccess,
      errorCallback: showScanError,
      videoSelector: videoSelector || '#video',
      stopOnRead: true,
      deviceId: device.deviceId
    });
  });
}

function toggleButtonStyle(isCameraScanning) {
  //When camera is on, then show red button; else show green
  const color = isCameraScanning? 'red': 'lightgreen';
  const newstyles = `background-color:${color}`;
  scanButton.setAttribute('style', newstyles);
  //Also, toggle Stop/Start text
  const text = isCameraScanning? '# Stop': '>> Start';
  scanButton.innerHTML = `${text} QR Scan`;
}

function toggleResultsStyle(isCameraScanning) {
  //When camera is on, then show red results; else show green
  const color = isCameraScanning? 'red': 'lightgreen';
  const newstyles = `background-color:${color}`;
  resultsElement.setAttribute('style', newstyles);
  //When camera is on, show that it is scanning; else show it stopped
  const text = isCameraScanning? "...Scanning": "Stopped";
  resultsElement.innerHTML = text;
}

function resetStyles(isCameraScanning) {
  if (isCameraScanning) {
    toggleButtonStyle(false);
    toggleResultsStyle(false);
    videoElement.removeAttribute('src');
  }
}

function resetReader(...args) {
  //Destruct args param
  const [isCameraScanning, reader, scanCounts] = args;
  debugLog(`...isCameraScanning===${isCameraScanning}`);
  //Stop camera if device is scanning; else starts the camera again
  if (scanCounts===0) {
    debugLog('...start camera if at initial state');
    return scanQrCode('#video');
  }
  else if (!isCameraScanning) {
    debugLog('...camera is off so restart it');
    return scanQrCode('#video');
  }
  else if (isCameraScanning) {
    debugLog('...stop camera when button clicked and camera is on');
    //Stop the camera and reset the videoElement
    reader.then(camera => camera.stop());
    //Return the original reader promise
    return reader;
  }
  else {
    const msg = '***FATAL: unknown value for isCameraScanning!';
    console.error(msg);
    //Return a rejected promise
    return Promise.reject(msg);
  }
}

function incrementScanCount(isCameraScanning, scanCounts) {
  if (scanCounts < 1) {
    return 1;
  }
  else {
    //Only increment when camera is on; keep same count if camera is off
    let newval = isCameraScanning? scanCounts+1: scanCounts;
    debugLog(`scanCounts new/old: ${newval}/${scanCounts}`);
    return newval;
  }
}

function documentonready() {
  let isCameraScanning = false;
  let scanCounts = 0;
  let reader = Promise.resolve(QrReader);

  //Add listeners for the video element and scan button
  videoElement.addEventListener('playing', () => {
    isCameraScanning = true;
    toggleButtonStyle(true);
    toggleResultsStyle(true);
  });
  videoElement.addEventListener('pause', () => {
    isCameraScanning = false;
    toggleButtonStyle(false);
  });
  scanButton.addEventListener('click', () => {
    resetStyles(isCameraScanning);
    //Modify the reader whether the camera is on or off
    reader = resetReader(isCameraScanning, reader, scanCounts);
    scanCounts = incrementScanCount(isCameraScanning, scanCounts);
  });
}

documentonready();
