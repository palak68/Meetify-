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
    return (
    <div>
      {askForUsername==true ? <div></div> : <div></div>}
    </div>
  );
}
