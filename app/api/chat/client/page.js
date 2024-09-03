"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { io } from "socket.io-client"

export default function chatComponent() {
  const [socket, setSocket] = useState<any>(undefined)
  const [inbox, setInbox] = useState<any>([])
  const [message, setMessage] = useState("")
  const [roomName, setRoomName] = useState("")

  const handleSendMessage = () => {
    socket.emit("message", message, roomName)
  }
  
  const handleJoinRoom = () =>{
    socket.emit("joinRoom", roomName)
  }
  
  useEffect(() => {
    const socket = io("http://localhost:3001");
  
    socket.on('message', (message) => {
      setInbox(prevInbox => [...prevInbox, message]);
    });
  
    setSocket(socket);
  
    // Cleanup to avoid memory leaks when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);
  
  return(
    <div><div className = "flex flex-col gap-5 mt-20 px-10 lg:px-48">

      <div className="flex flex-col gap-2 border rounded-lg p-10">
        {inbox.map((message, index) => (
          <div key={index} className = "border rounded px-4 py-2">{message}</div>
        ))}
      </div>
  
      <div className="flex gap-2 align-center justify-center">
        <input onChange={(e) => {
          setMessage(e.target.value)
        }} type = "text" name = "message" className="flex-1 bg-black border rounded px-2 py-1"/>
        <button className = "w-40" onClick={handleSendMessage}>Send message</button>
      </div>

      <div className="flex gap-2 align-center justify-center">
        <input onChange = {(e) => {
          setRoomName(e.target.value)
        }} type = "text" name = "room" className="flex-1 bg-black border rounded px-2 py-1"/>
        <button onClick={handleJoinRoom} className = "w-40" >Join Room</button>
      </div>
    </div>
    </div>
  )
}
