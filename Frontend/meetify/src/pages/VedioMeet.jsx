import React from "react";
import styles from "../styles/vedioComponent.module.css"
const server_url = "http://localhost:8000";

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
  var socketId = useRef();
  var localVedioRef = useRef();
  let [vedioAvailable, setVedioAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);
  let [vedio, setVedio] = useState();
  let [audio, setAudio] = useState();
  let [screen, setScreen] = useState();
  let [showModel, setShowModell] = useState();
  let[screenAvailable, setScreenAvailable] = useState(true);
  let [ messages, setMessages] = useState([]);
  let [message, setMessage] = useState("");
  let [newMessages, setNewMessages] = useState(0);
  let [askForUsername, setAskForUsername] = useState(true);
  let [ username, setUsername] = useState("");
  const vedioRef = useRef([]);
  let [ videos, setVideos] = useState([]);

//   if(isChrome() === false){

//   }
let getPermissions = async ()=>{
  try{
    const vedioPermission = await navigator.mediaDevices.getUserMedia({video:true});
    if(vedioPermission){
      setVedioAvailable(true);
    } else{
      setVedioAvailable(false);
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

    if(vedioAvailable || audioAvailable){
      const userMediaStream = await navigator.mediaDevices.getUserMedia({video:vedioAvailable, audio:audioAvailable});
      if(userMediaStream){
        window.localStream = userMediaStream;
        if(localVedioRef.current){
          localVedioRef.current.srcObject = userMediaStream;
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
localVedioRef.current.srcObject = stream;

for(let id in connections){
  if(id == socketIdRef.current){
    continue;
  }
  connections[id].addStream(window.localStream);
  connections[id].createOffer().then((description) =>{
     connections[id].setLocalDescription(description).then(()=>{
      socketIdRef.current.emit("signal", id, JSON.stringify({'sdp': connections[id].localDescription}));
     }) .catch(err =>{console.log(err);})

  }) 
}
streams.getTracks().forEach(track => track.onended=()=>{
  setVedio(false);
  setAudio(false);
  try{    let tracks = localVedioRef.current.srcObject.getTracks();
    tracks.forEach(track => track.stop());
  }catch(err){
    console.log(err);
  }
  let blackSilenceStream = (...args) => new MediaStream([black(...args), silence(...args)]);
          window.localStream = blackSilenceStream();
          localVedioRef.current.srcObject = window.localStream;
        });
  for(let id in connections){
    connections[id].addstream(window.localStream);
    connections[id].createOffer().then((description) =>{
       connections[id].setLocalDescription(description).then(()=>{
        socketIdRef.current.emit("signal", id, JSON.stringify({'sdp': connections[id].localDescription}));
       }) .catch(err =>{console.log(err);})
  
    })
  }
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



let getuserMedia = ()=>{
  if(vedio && vedioAvailable || audio && audioAvailable){

    navigator.mediaDevices.getUserMedia({video:vedio, audio:audio})
   .then(getUserMediaSuccess)
    .then((stream)=>{}).
    catch((err)=>{
      console.log(err);
    } 
  )
  } else{
    try{
  let tracks = localVedioRef.current.srcObject.getTracks();
  tracks.forEach(track => track.stop());
    }catch(err){

    }
  }

}


  useEffect(() => {
    if(vedio!== undefined && audio !== undefined ){
        getMedia();
    }} ,[vedio, audio])


// todo
let gotMessageFromServer = (fromId, message)=>{
var signal = JSON.parse(message);
if(fromId !== socketIdRef.current){
  if(signal.sdp){
    connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(()=>{
      if(signal.sdp.type === "offer"){
        connections[fromId].createAnswer().then((description)=>{
          connections[fromId].setLocalDescription(description).then(()=>{
socketRef.current.emit("signal", fromId, JSON.stringify({'sdp': connections[fromId].localDescription}));  
          })
          .catch((err)=>{
            console.log(err);
          }) 
        })
      }
    }).catch((err)=>{
      console.log(err);
    })
  }
  if(signal.ice){
    connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch((err)=>{
      console.log(err);
    })

}
let addMessage = ()=>{

}

    let connectToSocketServer = ()=>{

    socketRef.current = io(server_url , {secure: false});

    socketRef.current.on("signal",gotMessageFromServer);

    socketId.current.on ("connect",()=>{
        socketId.current .emit = ("join-call", window.location.href);

        socketIdRef.current= socketId.current.id;

        socketRef.current.on ("chat-message", addMessage)

        socketRef.current.on("user-left", (id)=>{
          setVideos(vedios => vedios.filter(video => video.socketId !== id));
        } )

        socketRef.current.on ("user_joined", (id,clients)=>{
          clients.forEach((socketListId)=>{
            connections[socketListId] = new RTCPeerConnection(peerConnectionConfig);
            connections[socketListId].onicecandidate = (event)=>{
              if(event.candidate !== null){
                socketRef.current.emit("signal", socketListId, JSON.stringify({'ice': event.candidate}));
              }
            }
            connections[socketListId].onaddstream = (event)=>{
              let vedioExists = vedioRef.current.find(vedio => vedio.socketId === socketListId);
              if(vedioExists){
                setVedio(vedios =>{
                  const updatedVedios = vedios.map(vedio => 
                    vedio.socketId === socketListId ? { ...vedio, stream: event.stream } : vedio
                  );
                  vedioRef.current = updatedVedios;
                });
                    
                    
              }else {
                let newVedio = {socketId: socketListId, 
                                stream: event.stream , 
                                 autoPlay: true,
                                  playsInline: true};
              }
              setVideos(vedios => {
                const updatedVedios = [...vedios, newVedio];
                vedioRef.current = updatedVedios;
                return updatedVedios;
              
            })      }


          })

         if(window.localStream !== undefined &&window.localStream !== null){
          connections [socketListId].addStream(window.localStream);
        } else{
          let blackSilenceStream = (...args) => new MediaStream([black(...args), silence(...args)]);
          window.localStream = blackSilenceStream();
          connections [socketListId].addStream(window.localStream);
        }
       
      })
      if(id==socketIdRef.current){

        for(let id2 in connections){
          if(id2 == socketIdRef.current){
            continue;
          } try{
           connections[id2].addStream(window.localStream);

          } catch(err){
            console.log(err);
          }
          connections[id2].createOffer().then(description =>{
            connections[id2].setLocalDescription(description)
            .then(()=>{
              socketRef.current.emit("signal", id2, JSON.stringify({'sdp': connections[id2].localDescription}));
            }).catch((err)=>{
              console.log(err);
            })
          })
        }
      }

    })

    
  let getMedia =()=>{
    setVedio(vedioAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();

  }
    return (
    <div>
      {askForUsername==true ?
       <div>
      <h2> Enter your lobby</h2>
      <TextField id="outlined-basic" label="username " value={username} onChange={(e) => {setUsername(e.target.value)}} variant="outlined" />
      <Button variant="contained" onClick={connect}>Connect</Button>
       <div>
        <vedio ref={localVedioRef} autoPlay muted></vedio>
       </div>
      </div> :

        <div className={styles.meetvedioContainer}>
            
            <vedio className={styles.meetUserVedio} ref={localVedioRef} autoPlay muted ></vedio>
        
       {videos.map((vedio, index) => {

        <div key={vedio.socketId}>

          <h2>{vedio.socketId}</h2>

          <video data-socket={vedio.socketId}
                 ref={ ref =>{
                  if(ref && vedio.stream){
                    ref.srcObject = vedio.stream;
                  }
                 }}
                  autoPlay playsInline
                 ></video>

        </div>
       })}

        </div>}
    </div>
  );
}}}
