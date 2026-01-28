import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [typing, setTyping] = useState("");

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    const handleTyping = (e) => {
        setCurrentMessage(e.target.value);
        socket.emit("typing", { room, user: username });
    }

    useEffect(() => {
        const receiveMessageHandler = (data) => {
            setMessageList((list) => [...list, data]);
            setTyping(""); // Clear typing when message received
        };

        const typingHandler = (data) => {
            setTyping(`${data.user} is typing...`);
            // Clear typing indicator after 3 seconds
            setTimeout(() => setTyping(""), 3000);
        };

        socket.on("receive_message", receiveMessageHandler);
        socket.on("display_typing", typingHandler);

        return () => {
            socket.off("receive_message", receiveMessageHandler);
            socket.off("display_typing", typingHandler);
        };
    }, [socket]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live Chat - Room: {room}</p>
            </div>
            <div className="chat-body">
                {/* We can use ScrollToBottom for auto-scrolling if installed, strictly strictly strictly vanilla CSS scrolling is also fine but user asked for functionality */}
                {/* I'll use standard div scrolling for now to avoid extra dependencies, as ScrollToBottom is not installed. */}
                {messageList.map((messageContent, index) => {
                    return (
                        <div
                            className="message-container"
                            id={username === messageContent.author ? "you" : "other"}
                            key={index}
                        >
                            <div>
                                <div className="message-content">
                                    <p>{messageContent.message}</p>
                                </div>
                                <div className="message-meta">
                                    <p id="time">{messageContent.time}</p>
                                    <p id="author">{messageContent.author}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div style={{ float: "left", clear: "both" }} >
                </div>
            </div>
            <div className="chat-footer">
                <div className="typing-indicator">{typing}</div>
                <input
                    type="text"
                    value={currentMessage}
                    placeholder="Hey..."
                    onChange={handleTyping}
                    onKeyPress={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
}

export default Chat;
