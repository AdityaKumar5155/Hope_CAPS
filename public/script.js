const socket = io('/');
let myVideoStream;
const myVideo = document.getElementById('video2');
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
    // addVideoStream(myVideo, stream);
    // myVideo.setAttribute('style', 'width:25%; height :auto;');
    myVideo.srcObject = stream;
    myVideo.addEventListener('loadedmetadata', () => {
        myVideo.play();
    })

    peer.on('call', call => {
        call.answer(stream);
        const video = document.getElementById('video1');
        myVideo.setAttribute('style', 'width:25%; height :auto;');
        call.on('stream', userVideoStream => {
            // myVideo.setAttribute('style', 'width:25%; height :auto;');
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
    const video = document.getElementById('video1');
    const video2 = document.getElementById('video2');
    // video1.setAttribute('style', "width : 100%;");
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.style.display = 'block';
    //video.setAttribute('style', ' position:absolute; bottom : 0 ; right : 0;width : 25%; object-fit: cover;');
    video.addEventListener('loadedmetadata', () => {
        video.play(); 
    })
    // myVideo.append(video);
}

let msg = $("#message");
console.log(msg);

$('html').keydown((e) => {
    if (e.which==13 && msg.val().length!==0 ){
        socket.emit('message', msg.val());
        console.log(msg.val())
        msg.val('');
    }
})

socket.on('createMessage', message => {
    console.log('this is coming from server',  message);
    $('#messages').append(`<li class='message' > chat : ${message} </li>`)
})