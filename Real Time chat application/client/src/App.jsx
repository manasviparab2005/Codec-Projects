import { useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import Chat from './components/Chat';
import Login from './components/Login';

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <Login
          username={username}
          setUsername={setUsername}
          room={room}
          setRoom={setRoom}
          joinRoom={joinRoom}
        />
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
