const app = require("express")();
const http = require("http").createServer(app);

const cv = require("opencv4nodejs");
const io = require("socket.io")(http, { origins: "*:*" });
//https://github.com/justadudewhohacks/opencv4nodejs/blob/master/examples/faceDetect/faceAndEyeDetection.js
const FPS = 10;
const videoCapture = new cv.VideoCapture(0);

videoCapture.set(cv.CAP_PROP_FRAME_WIDTH, 300);
videoCapture.set(cv.CAP_PROP_FRAME_HEIGHT, 300);

const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

setInterval(() => {
  const frame = videoCapture.read();

  const { objects, numDetections } = classifier.detectMultiScale(
    frame.bgrToGray()
  );

  frame.putText(
    "VEOX MASK DETECTOR v0.1",
    new cv.Point(10, 15),
    2,
    0.3,
    new cv.Vec(181, 81, 63),
    1
  );

  objects.forEach((object) => {
    frame.drawRectangle(
      new cv.Point(object.x, object.y),
      new cv.Point(object.x + object.width, object.y + object.height),
      {
        color: new cv.Vec(0, 255, 0),
        thickness: 1,
      }
    );
  });

  const image = cv.imencode(".jpeg", frame).toString("base64");
  io.emit("image", image);
}, 1000 / FPS);

http.listen(4000, () => {
  console.log("Listening on 4000");
});
