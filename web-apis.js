document.addEventListener("keypress", (e) => {
   if (e.keyCode === 13) {
      toggleFullScreenElement();
   }
}, false);

window.addEventListener('load', changeActualDate);

const shareScreenElement = document.querySelector('#compartilhar-tela');
const pictureInPictureElement = document.querySelector('#picture-in-picture');
const fullScreenElement = document.querySelector('#full-screen');
const fullScreenRemoveElement = document.querySelector('#full-screen-remove');
const camShareElement = document.querySelector('#camera-compartilhar');
const actualHourElement = document.querySelector('#horario-atual');

setInterval(changeActualDate, 1000);

shareScreenElement.addEventListener('click', toggleScreenCapture);
pictureInPictureElement.addEventListener('click', toggleFloatingVideo);
fullScreenElement.addEventListener('click', toggleFullScreenElement);
window.addEventListener("dblclick", toggleFullScreen);
fullScreenRemoveElement.addEventListener('click', toggleFullScreenElement);
camShareElement.addEventListener('click', startVideoFromCamera);

function changeActualDate() {
   const actualDate = new Date();
   const actualHour = actualDate.getHours();
   const actualMinutes = actualDate.getMinutes().toString();
   const minutesReady = actualMinutes.length === 1 ? `0${actualMinutes}` : actualMinutes;
   const actualSeconds = actualDate.getSeconds().toString();
   const secondsReady = actualSeconds.length === 1 ? `0${actualSeconds}` : actualSeconds;
   actualHourElement.innerHTML = `${actualHour}:${minutesReady} ${secondsReady}`;
}

//#region MediaStream Image Capture API

let imageCapture;

function startVideoFromCamera() {
   const videoElement = document.querySelector('#camera-video');
   if(videoElement.srcObject) {
      videoElement.srcObject = null;
   } else {
      const cameraSpecs = { video: true, video: { width: 150, height: 120 } }
      navigator.mediaDevices.getUserMedia(cameraSpecs)
         .then(camStream => {
            videoElement.srcObject = camStream;
            const track = camStream.getVideoTracks()[0];
            imageCapture = new ImageCapture(track);
         }).catch(error => console.log('error', error));
   }
}

//#endregion

//#region FullScreen API

function toggleFullScreen() {
   if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
   } else {
      if (document.exitFullscreen) {
         document.exitFullscreen();
      }
   }
}

function toggleFullScreenElement() {
   const videoCompartilhamento = document.querySelector("#video");
   if (!document.fullscreenElement) {
      videoCompartilhamento.requestFullscreen();
   } else {
      if (document.exitFullscreen) {
         document.exitFullscreen();
      }
   }
}

//#endregion

//#region Screen Capture API

const videoElemento = document.querySelector('#video');

const displayMediaOptions = {
   video: {
      cursor: "always"
   },
   audio: true
};

async function toggleScreenCapture() {
   if(videoElemento.srcObject) {
      await stopCapture();
      pictureInPictureElement.style.visibility ='hidden';
   } else {
      await startCapture();
      pictureInPictureElement.style.visibility ='visible';
   }
}

//#region Picture-in-Picture API

function toggleFloatingVideo() {
   if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
   } else {
      if (document.pictureInPictureEnabled) {
         videoElemento.requestPictureInPicture();
      }
   }
}

//#endregion

async function startCapture() {
   try {
      videoElemento.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      dumpOptionsInfo();
   } catch(err) {
      console.error("Error: " + err);
   }
}

function stopCapture() {
   const tracks = videoElemento.srcObject.getTracks();

   tracks.forEach(track => track.stop());
   videoElemento.srcObject = null;
}

function dumpOptionsInfo() {
   const videoTrack = videoElemento.srcObject.getVideoTracks()[0];

   console.info("Track settings:");
   console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
   console.info("Track constraints:");
   console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}

//#endregion
