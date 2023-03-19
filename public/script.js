const socket = io('/');
let myVideoStream;
const myVideo = document.getElementById('video2');
// myVideo.muted = false;
var doctor;
var patient;
let theme = "light";
// let peer;
// let doc_pat = prompt('doctor or patient?');
let id ;
let i = 0;
// if (doc_pat == "patient") {
//     id = "patient";
// }
// else if (doc_pat == "doctor"){
//     id = "doctor";
// }
var peer = new Peer(undefined, {path : '/peerjs',
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
        answerPlease(call,stream);
        console.log("Answered call")
        const video = document.getElementById('video1');
        myVideo.setAttribute('style', 'width:25% !important; height :auto;');
        call.on('stream', userVideoStream => {
            // myVideo.setAttribute('style', 'width:25%; height :auto;');
            addVideoStream(video, userVideoStream);
        })
    })

    socket.on('user-connected', (userId) => {
        connecToNewUser(userId, stream);
    })
    socket.on('user-disconnected', (userId) => {
        const target = document.getElementById('video1');
        socket.emit('stop-stream');
        target.setAttribute('style', 'background-color:red !important; opacity: 0.5');
    });

})
peer.on('open', (idt) => {
    id = idt;
    socket.emit('join-room', ROOM_ID , idt);
    console.log(idt);
})




async function connecToNewUser(userId, stream) {
    console.log("Calling");
    const call = await peer.call(userId,stream);
    const video = document.getElementById('video1');
    const video2 = document.getElementById('video2');
    video.setAttribute('style', "opacity : 1;");
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
        socket.emit('message', msg.val(),id);
        console.log(msg.val(),id)
        msg.val('');
    }
})

socket.on('createMessage', (message,senderId) => {
    console.log('this is coming from server',  message);
    if (senderId == id && theme == 'light'){
        $('#messages').append(`<div class='message me' id='${i}' ><span>You</span><hr><p>${message}</p></div>`)
    }
    else if (senderId !== id && theme == 'light'){
        $('#messages').append(`<div class='message you' id='${i}' ><span class="senderTitle" style="text-align:left">${senderId}</span><hr><p class="senderMsg" style="text-align:left">${message}</p></div>`)
        // document.getElementById(`${i}`).setAttribute('style', 'opacity:1; border-radius:40px 40px 40px 0px;');
    }
    else if (senderId == id && theme == 'dark'){
        $('#messages').append(`<div class='message me' style="background-color: #222; color:#ddd; opacity:1" id='${i}' ><span>You</span><hr><p>${message}</p></div>`)
    }
    else{
        $('#messages').append(`<div class='message you' id='${i}' style="background-color: lightblue; color:white; opacity:1"><span class="senderTitle" style="text-align:left">${senderId}</span><hr><p class="senderMsg" style="text-align:left">${message}</p></div>`)
    }
    i++; 
})

const disconnect = () => {
    // peer.close();
    console.log(`disconnect ${id}`)
    // socket.emit('unconnect', id);
}
async function answerPlease(call,stream){
    // alert("answering")
    await call.answer(stream)
    // alert("connected")
}

const setEnableVideo = () =>{
    const target = document.getElementById('videoImg');
    target.setAttribute('class', 'fa-solid fa-video-slash');
}
const setDisableVideo = () =>{
    const target = document.getElementById('videoImg');
    target.setAttribute('class', 'fa-solid fa-video');
}
const setEnableAudio = () =>{
    const target = document.getElementById('audioImg');
    target.setAttribute('class', "fa-solid fa-microphone-slash");
}
const setDisableAudio = () =>{
    const target = document.getElementById('audioImg');
    target.setAttribute('class', 'fa-solid fa-microphone');
}

const toggleVideo = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        console.log("Video is Disabled");
        setEnableVideo();
    }
    else{
        myVideoStream.getVideoTracks()[0].enabled = true;
        console.log("Video is Enabled");
        setDisableVideo();
    }
}

const toggleAudio = () => {
    let enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        console.log("Audio is Disabled");
        setEnableAudio();

    }
    else{
        myVideoStream.getAudioTracks()[0].enabled = true;
        console.log("Audio is Enabled");
        setDisableAudio();
    }
}

// const hangUpBtn = document.querySelector(".hangup-btn");
// hangUpBtn.addEventListener("click", () => {
  
//   showCallContent();
// });
const setMoonIcon = () => {
    document.getElementById("themeImg").setAttribute("class","fa-solid fa-moon");
    // document.getElementById("themeImg").setAttribute("class","fa-solid fa-moon");
}
const setSunIcon = () => {
    document.getElementById("themeImg").setAttribute("class","fa-solid fa-sun");
}

const toggleTheme = () => {
    if (theme == "light"){
        document.getElementsByTagName("body")[0].setAttribute("style","background-image: url('https://wallpapertag.com/wallpaper/full/a/f/1/447078-medical-desktop-backgrounds-1920x1200-free-download.jpg')");
        if (document.getElementById("chatdiv").style.width !== "25%")
        document.getElementById("chatdiv").setAttribute("style","background-color: black; width:0%");
        else
        document.getElementById("chatdiv").setAttribute("style","background-color: black; width:25%");
        document.getElementById("chatTitle").setAttribute("style","background-color: #222; color: #ddd");
        document.getElementById("message").setAttribute("style", "background-color: #222; color:#ddd");
        document.getElementById('waiting').setAttribute("src", "https://i.giphy.com/media/l0HlA96OHn6pgUaQw/giphy.webp")
        document.getElementsByTagName('header')[0].setAttribute("style","background-color: #222");
        for (let i = 0; i < document.getElementsByClassName('message').length; i++){
            document.getElementsByClassName('message')[i].setAttribute("style","background-color: #222; color:#ddd; opacity:1")
        }
        setMoonIcon();
        theme = "dark";
    }
    else{
        document.getElementsByTagName("body")[0].setAttribute("style","background-image: url('https://wallpapercave.com/wp/wp2595609.jpg')");
        if (document.getElementById("chatdiv").style.width !== "25%")
        document.getElementById("chatdiv").setAttribute("style","background-color: white; width:0%");
        else
        document.getElementById("chatdiv").setAttribute("style","background-color: white; width:25%");
        document.getElementById("chatTitle").setAttribute("style","background-color: lightblue; color: white");
        document.getElementById("message").setAttribute("style", "background-color: #fff;");
        document.getElementById('waiting').setAttribute("src", "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/129d4371043491.5bb79229cf4cb.gif")
        document.getElementsByTagName('header')[0].setAttribute("style","background-color: #fff");
        for (let i = 0; i < document.getElementsByClassName('message').length; i++){
            document.getElementsByClassName('message')[i].setAttribute("style","background-color: lightblue; color:white; opacity:1")
        }
        setSunIcon();
        theme = "light";
    }
}