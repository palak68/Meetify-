import React from "react";
import styles from "../styles/vedioComponent.module.css"
const server_url = "http://localhost:8000";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { Button, IconButton, TextField } from "@mui/material";
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import Badge from '@mui/material/Badge';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from "react-router-dom";

var connections ={};
const peerConnectionConfig = {
    'iceServers': [
        {
            'urls': 'stun:stun.l.google.com:19302'
        }
    ]
}

export default function VedioMeetComponent() {
  var socketRef = useRef();
  var socketIdRef = useRef();
  var localVideoRef = useRef();
  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);
  let [video, setVideo] = useState(false);
  let [audio, setAudio] = useState(false);
  let [screen, setScreen] = useState();
  let [showModal, setShowModal] = useState(true);
  let[screenAvailable, setScreenAvailable] = useState(true);
  let [ messages, setMessages] = useState([]);
  let [message, setMessage] = useState("");
  let [newMessages, setNewMessages] = useState(3);
  let [askForUsername, setAskForUsername] = useState(true);
  let [ username, setUsername] = useState("palak");
  const videoRef = useRef([]);
  let [ videos, setVideos] = useState([]);

//   if(isChrome() === false){

//   }
let getPermissions = async ()=>{
  try{
    const videoPermission = await navigator.mediaDevices.getUserMedia({video:true});
    if(videoPermission){
      setVideoAvailable(true);
    } else{
      setVideoAvailable(false);
    }

    const audioPermission = await navigator.mediaDevices.getUserMedia({audio:true});
    if(audioPermission){
      setAudioAvailable(true);
    } else{
      setAudioAvailable(false);
    }
    if(navigator.mediaDevices.getDisplayMedia){
      setScreenAvailable(true);
    } else{
      setScreenAvailable(false);
    }

    if(videoAvailable || audioAvailable){
      const userMediaStream = await navigator.mediaDevices.getUserMedia({video:videoAvailable, audio:audioAvailable});
      if(userMediaStream){
        window.localStream = userMediaStream;
        if(localVideoRef.current){
          localVideoRef.current.srcObject = userMediaStream;
        }
      }
    }
  }catch(err){
console.log( err);

  }
}
useEffect(() => 
  
  {

    getPermissions();
  },[])

 let userMediaSuccess = (stream)=>{

try{
  window.localStream .getTracks().forEach(track => track.stop());
  



}catch(err){
  console.log(err);
}
window.localStream = stream;
localVideoRef.current.srcObject = stream;

for(let id in connections){
  if(id == socketIdRef.current){
    continue;
  }
  connections[id].addStream(window.localStream);
  connections[id].createOffer().then((description) =>{
     connections[id].setLocalDescription(description).then(()=>{
      socketRef.current.emit("signal", id, JSON.stringify({'sdp': connections[id].localDescription}));
     }) .catch(err =>{console.log(err);})

  }) 
}
stream.getTracks().forEach(track => track.onended=()=>{
  setVideo(false);
  setAudio(false);
  try{    let tracks = localVideoRef.current.srcObject.getTracks();
    tracks.forEach(track => track.stop());
  }catch(err){
    console.log(err);
  }
  let blackSilenceStream = (...args) => new MediaStream([black(...args), silence(...args)]);
          window.localStream = blackSilenceStream();
          localVideoRef.current.srcObject = window.localStream;
        });
  for(let id in connections){
    connections[id].addStream(window.localStream);
    connections[id].createOffer().then((description) =>{
       connections[id].setLocalDescription(description).then(()=>{
        socketRef.current.emit("signal", id, JSON.stringify({'sdp': connections[id].localDescription}));
       }) .catch(err =>{console.log(err);})
  
    })
  }
}

 

 let silence=() => {
let ctx =  new AudioContext()
let oscillator = ctx.createOscillator();
let dst = oscillator.connect(ctx.createMediaStreamDestination());
oscillator.start();
ctx.resume();
return Object.assign(dst.stream.getAudioTracks()[0], {enabled: false});
 }

 let black = () => {
let canvas = Object.assign(document.createElement("canvas"), {width: 640, height: 480});
canvas.getContext("2d").fillRect(0, 0, canvas.width, canvas.height);
let stream = canvas.captureStream();
return Object.assign(stream.getVideoTracks()[0], {enabled: false});
 }



let getUserMedia = ()=>{
  if((video && videoAvailable || audio && audioAvailable)){

    navigator.mediaDevices.getUserMedia({video:video, audio:audio})
   .then(userMediaSuccess)
    .then((stream)=>{}).
    catch((err)=>{
      console.log(err);
    } 
  )
  } else{
    try{
  let tracks = localVideoRef.current.srcObject.getTracks();
  tracks.forEach(track => track.stop());
    }catch(err){

    }
  }

}



  const connect = () => {
  if (username.trim() !== "") {
    setAskForUsername(false);
    setVideo(videoAvailable);
    setAudio(audioAvailable);
  }
};


  


// todo


let gotMessageFromServer = (fromId, message) => {
  var signal = JSON.parse(message);

  if (fromId !== socketIdRef.current) {

    if (signal.sdp) {
      connections[fromId]
        .setRemoteDescription(new RTCSessionDescription(signal.sdp))
        .then(() => {

          if (signal.sdp.type === "offer") {
            connections[fromId]
              .createAnswer()
              .then((description) => {
                connections[fromId]
                  .setLocalDescription(description)
                  .then(() => {
                    socketRef.current.emit(
                      "signal",
                      fromId,
                      JSON.stringify({
                        sdp: connections[fromId].localDescription
                      })
                    );
                  })
                  .catch((err) => console.log(err));
              });
          }

        })
        .catch((err) => console.log(err));
    }

    if (signal.ice) {
      connections[fromId]
        .addIceCandidate(new RTCIceCandidate(signal.ice))
        .catch((err) => console.log(err));
    }

  }  

}; 
let addMessage = (data,sender,socketIdSender)=>{
  
  setMessages(prevMessages => [...prevMessages, { sender: sender, data: data }]);
  if(socketIdSender !== socketIdRef.current){
  setNewMessages((prevMessages) => prevMessages + 1);

}

    let connectToSocketServer = () => {

  socketRef.current = io(server_url, { secure: false });

  socketRef.current.on("signal", gotMessageFromServer);

  socketRef.current.on("connect", () => {

    socketRef.current.emit("join-call", window.location.pathname);
    socketIdRef.current = socketRef.current.id;

    socketRef.current.on("chat-message", addMessage);

    socketRef.current.on("user-left", (id) => {
      setVideos(videos => videos.filter(video => video.socketId !== id));
      delete connections[id];
    });

    socketRef.current.on("user_joined", (id, clients) => {
  
      clients.forEach((socketListId) => {
if (socketListId === socketIdRef.current) return;
        connections[socketListId] = new RTCPeerConnection(peerConnectionConfig);

        // ICE
        connections[socketListId].onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current.emit(
              "signal",
              socketListId,
              JSON.stringify({ ice: event.candidate })
            );
          }
        };

        // When stream received
        connections[socketListId].onaddstream = (event) => {

          let videoExists = videoRef.current.find(
            video => video.socketId === socketListId
          );

          if (videoExists) {

            setVideos(videos =>
              videos.map(video =>
                video.socketId === socketListId
                  ? { ...video, stream: event.stream }
                  : video
              )
            );

          } else {

            let newVideo = {
              socketId: socketListId,
              stream: event.stream,
              autoPlay: true,
              playsInline: true
            };

            setVideos(videos => {
              const updatedVideos = [...videos, newVideo];
              videoRef.current = updatedVideos;
              return updatedVideos;
            });
          }
        };

        // ADD LOCAL STREAM
        if (window.localStream) {
          connections[socketListId].addStream(window.localStream);
        } else {
          let blackSilenceStream = new MediaStream([black(), silence()]);
          window.localStream = blackSilenceStream;
          connections[socketListId].addStream(window.localStream);
        }

      });

      // If I joined
      if (id === socketIdRef.current) {
        for (let id2 in connections) {

          if (id2 === socketIdRef.current) continue;

          connections[id2].addStream(window.localStream);

          connections[id2]
            .createOffer()
            .then(description => {
              connections[id2].setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({
                      sdp: connections[id2].localDescription
                    })
                  );
                });
            });
        }
      }

    });

  });

};



let getMedia =()=>{
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();



  }

let routerTO = useNavigate();


useEffect(() => {
    if(video!== undefined && audio !== undefined ){
        getMedia();
    }} ,[video, audio])
let handleVideo =()=>{
  setVideo(!video);
}
let handleAudio =()=>{
  setAudio(!audio);
}
let getDisplayMediaSuccess = (stream) => {
  try{
    window.localStream.getTracks().forEach(track => track.stop());
  } catch(err){
    console.log(err);
  }
  window.localStream = stream;
  localVideoRef.current.srcObject = stream;

  for(let id in connections){
    if(id == socketIdRef.current){
      continue;
    }
    connections[id].addStream(window.localStream);
    connections[id].createOffer().then((description) =>{
       connections[id].setLocalDescription(description).then(()=>{
        socketRef.current.emit("signal", id, JSON.stringify({'sdp': connections[id].localDescription}));
       }) .catch(err =>{console.log(err);})
    })
  }
stream.getTracks().forEach(track => track.onended=()=>{
  setScreen(false);
  try{    let tracks = localVideoRef.current.srcObject.getTracks();
    tracks.forEach(track => track.stop());
  }catch(err){
    console.log(err);
  }
  let blackSilenceStream = (...args) => new MediaStream([black(...args), silence(...args)]);
          window.localStream = blackSilenceStream();
          localVideoRef.current.srcObject = window.localStream;
        });
  getUserMedia();

}

const getDisplayMedia = () => {
if(screen){
  if(navigator.mediaDevices.getDisplayMedia){
    navigator.mediaDevices.getDisplayMedia({video:true, audio:true})
    .then(getDisplayMediaSuccess).then((stream)=>{

    }).catch((err)=>{
      console.log(err);
    })
  }
}

}
useEffect(() => {
  if (screen !== undefined) {
    getDisplayMedia();
  }
}, [screen]);
let handleScreen =()=>{
setScreen(!screen);
}

let sendMessage =()=>{
  SocketRef.current.emit("chat-message", message, username);
  setMessage("");
}

let handleEndCall = ()=>{
  try{
let tracks = localVideoRef.current.srcObject.getTracks();
tracks.forEach(track => track.stop());
  } catch (err){

  } routerTO("/home");
}



    return (
    <div>
      {askForUsername==true ?
       <div>
      <h2> Enter your lobby</h2>
      <TextField id="outlined-basic" label="username " value={username} onChange={(e) => {setUsername(e.target.value)}} variant="outlined" />
      <Button variant="contained" onClick={connect}>Connect</Button>
       <div>
        <video ref={localVideoRef} autoPlay muted></video>
       </div>
      </div> :

        <div className={styles.meetvideoContainer}>
          {showModal ?<div className={styles.chatRoom}>
           <div className={styles.chatContainer}>
            <h1>Chat</h1>
            <div className={styles.chattingDisplay}>
            {messages.length > 0 ? messages.map((item , index) => {
              return <div key={index}><p style={{fontWeight: "bold"}}>{item.sender}</p>:<p>{item.data}</p> </div>;
            }):<> <p>No messages yet</p></>}
            </div>


           <div className={styles.chattingArea}></div>
            <TextField  value={message} onChange={(e) => {setMessage(e.target.value)}} id="outlined-basic" label="Enter your message" variant="outlined" />
            <button variant="contained" >Send</button>
                          
                          </div>
          </div> :<></>}
          

            <div className={styles.buttonContainer}>
            <IconButton onClick={handleVideo} style ={{color:"white", transform:"scale(1.2)" }}>
              {(video == true ) ? <VideocamIcon/> : <VideocamOffIcon/>}
            </IconButton>

             <IconButton   onClick={handleEndCall} sx={{
    backgroundColor: "red",
    color: "white",
    "&:hover": {
      backgroundColor: "darkred"
    },
    width: 50,
    height: 50

  }}>
              <CallEndIcon/>
            </IconButton>
             <IconButton onClick={handleAudio} style ={{color:"white", transform:"scale(1.2)" }}>
              {(audio == true ) ? <MicIcon/> : <MicOffIcon/>}
            </IconButton>

            {screenAvailable && <IconButton onClick={handleScreen} style ={{color:"white", transform:"scale(1.2)" }}>
              {screen == true ? <StopScreenShareIcon/> : <ScreenShareIcon/>}
            </IconButton>}
            <Badge badgeContent={newMessages} max={999} color="secondary" >
              <IconButton  onClick={()=>setModal(!showModal)} style ={{color:"white", transform:"scale(1.2)" }}>
                <ChatIcon/>
              </IconButton>
            </Badge>

            </div>
           <video className={styles.meetUserVideo} ref={localVideoRef} autoPlay muted ></video>
         

 
<div className={styles.conferenceView} >
       {videos.map((video, index) => {
  return (
    <div  key={video.socketId}>
      <h2>{video.socketId}</h2>

      <video
      
        data-socket={video.socketId}
        ref={(ref) => {
          if (ref && video.stream) {
            ref.srcObject = video.stream;
          }
        }}
        autoPlay
        playsInline
      />
    </div>
  );
}
)}  </div>

        </div>}
    </div>
  );


}}