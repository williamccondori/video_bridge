const app = require("express")();
const http = require("http").createServer(app);

const cv = require("opencv4nodejs");
const io = require("socket.io")(http);
//https://github.com/justadudewhohacks/opencv4nodejs/blob/master/examples/faceDetect/faceAndEyeDetection.js
const FPS = 30;
const videoCapture = new cv.VideoCapture(0);
videoCapture.set(cv.CAP_PROP_FRAME_WIDTH, 300);
videoCapture.set(cv.CAP_PROP_FRAME_HEIGHT, 300);

setInterval(() => {
  const frame = videoCapture.read();
  const image = cv.imencode(".jpg", frame).toString("base64");
  io.emit("image", image);
}, 1000 / FPS);

http.listen(4000, () => {
  console.log("listening on *:4000");
});
