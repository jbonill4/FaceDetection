
const video = document.getElementById('video');

// load the models for face detection, face expression, and face landmarks
async function load() 
{  
  await faceapi.nets.faceExpressionNet.loadFromUri('./models');
  await faceapi.nets.ssdMobilenetv1.loadFromUri('./models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('./models');
  start();
}

// get and set video stream
// catch any errors
function start() 
{
  if (navigator.mediaDevices.getUserMedia) 
  {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) { video.srcObject = stream; })
    .then(scan).catch(function(error){ console.log(error); });
  }
}

// scans uses faceapi.draw to display detections, expressions, and landmarks
function scan() 
{
  const picture = document.getElementById('canvas');
  // resize picture
  const size = { width: video.width, height: video.height };
  faceapi.matchDimensions(picture, size);

  /* sets action to happen every 50 milliseconds */
  setInterval(async function() 
  {
    const interval = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceExpressions();
    const resizeResults = faceapi.resizeResults(interval, size);
    // clear canvas 
    picture.getContext('2d').clearRect(0, 0, picture.width, picture.height);

    // draws detections expressions and landmarks
    faceapi.draw.drawFaceLandmarks(picture, resizeResults);
    faceapi.draw.drawFaceExpressions(picture, resizeResults);
    faceapi.draw.drawDetections(picture, resizeResults);
  }, 50);
}

load()