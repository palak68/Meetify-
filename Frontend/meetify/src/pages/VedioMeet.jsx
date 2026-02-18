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
}
