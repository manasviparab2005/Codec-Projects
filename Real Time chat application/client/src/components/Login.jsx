import React from 'react';

function Login({ username, setUsername, room, setRoom, joinRoom }) {
    return (
        <div className="joinChatContainer">
            <h3>Join Chat</h3>
            <input
                type="text"
                placeholder="Username..."
                onChange={(event) => {
                    setUsername(event.target.value);
                }}
                onKeyDown={(e) => { e.key === "Enter" && joinRoom() }}
            />
            <input
                type="text"
                placeholder="Room ID (e.g. general)..."
                onChange={(event) => {
                    setRoom(event.target.value);
                }}
                onKeyDown={(e) => { e.key === "Enter" && joinRoom() }}
            />
            <button className="btn-primary" onClick={joinRoom}>Join A Room</button>
        </div>
    );
}

export default Login;
