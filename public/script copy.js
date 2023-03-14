const socket = io('/');
let myVideoStream;
const video_grid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.setAttribute("id", "myVideo");
// myVideo.muted = false;
var peer = new Peer(undefined, {
    path : '/peerjs',
    host : '/',
    port : '4444'
});

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream);
        myVideo.setAttribute('style', "border-radius: 10% 0% 0% 10%;");
        const video = document.createElement('video');
        video.setAttribute('id', 'yourVideo');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    })

    socket.on('user-connected', (userId) => {
        connecToNewUser(userId, stream);
    })
})
peer.on('open', (id) => {
    socket.emit('join-room', ROOM_ID , id);
    console.log(id);
})




const connecToNewUser = (userId, stream) => {
    const call = peer.call(userId,stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play(); 
    })
    video_grid.appendChild(video);
}