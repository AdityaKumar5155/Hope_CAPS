const socket = io('/');
let myVideoStream;
const myVideo = document.getElementById('video1');
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
    myVideo.srcObject = stream;
    myVideo.setAttribute('style', 'width : 100%; height : 80vh;');
    myVideo.addEventListener('loadedmetadata', () => {
        myVideo.play();
    })

    peer.on('call', call => {
        call.answer(stream);
        myVideo.setAttribute('style', "width : 70%;");
        const video = document.getElementById('video2');
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
    const video = document.getElementById('video2');
    const video1 = document.getElementById('video1');
    video1.setAttribute('style', "width : 70%;");
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.style.display = 'block';
    video.setAttribute('style', ' position:relative; top : 0 ; right : 0;width : 70%; object-fit: cover;');
    video.addEventListener('loadedmetadata', () => {
        video.play(); 
    })
    // myVideo.append(video);
}