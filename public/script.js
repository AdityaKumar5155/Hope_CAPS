const socket = io('/');
let myVideoStream;
const video_grid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
// myVideo.muted = false;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
})
socket.emit('join-room');
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    video_grid.appendChild(video);
}