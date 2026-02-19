import React from "react";
import "../styles/vedioComponent.css"
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
          // black silence stream
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
      </div> : <div></div>}
    </div>
  );
}}
