import React, { useEffect } from 'react'
import './messenger.css'
import Conversation from './Conversation'
import Message from './Message'
import ChatOnline from './ChatOnline'
import {io} from "socket.io-client"
import { useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import ConvoLoader from './ConvoLoader'
import { useRef } from 'react'

const Messenger = () => {

  const [conversations,setConversations] = useState(null)
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState(null)
  const [newMessage,setNewMessage] = useState('')
  const [arrivalMessage,setArrivalMessage] = useState(null)
  const [onlineUsers,setOnlineUsers] = useState([])
  const  socket = useRef()
  const user = useSelector(state => state.auth.user)
  const scrollRef = useRef()
  

  useEffect(()=>{
    socket.current = io("ws://localhost:7000")
    socket.current.on("getMessage", data => {
        setArrivalMessage({
            sender: data.senderId,
            text:data.text,
            createdAt: Date.now()
        })
    })

  },[])


  useEffect(()=>{
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
    setMessages(prev => [...prev, arrivalMessage])
  },[arrivalMessage,currentChat])


  useEffect(()=>{
    if(user){
        socket.current.emit("addUser", user._id)
        socket.current.on("getUsers", users=> {
            setOnlineUsers(users)
        })
    }
  },[user])

  useEffect(async ()=>{
     
    try {
        if(user!==null){
            const res = await axios.get(`/api/conversations/${user._id}`) 
           setConversations(res.data) 
        }
           
     
      
         
       
    } catch (error) {
        console.log(error)
    }
  }
,[user])

useEffect(()=>{
    const getMessages = async ()=>{
        try {
            const res = await  axios.get(`/api/messages/${currentChat?._id}`)
            setMessages(res.data)

        } catch (error) {
            console.log(error)
        }
    }
    getMessages()
},[currentChat])




useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior:"smooth"})
},[messages])

const handleSubmit =  async (e) => {
    e.preventDefault()
    const message ={
        sender: user._id,
        text: newMessage,
        conversationId: currentChat._id
    }

    const receiverId = currentChat.members.find(member => member !== user._id)
    
    socket.current.emit("sendMessage",{
        senderId: user._id,
        receiverId,
        text: newMessage
    })

    try {
        const res = await axios.post(`/api/messages/`,message)
        setMessages([...messages,res.data])
        setNewMessage('')
    } catch (error) {
        console.log(error)
    }
}


  return (
    <div className="messenger">
        <div className="chatMenu">
            <div className="chatMenuWrapper">
                <input type="text" placeholder="Search for friends" className="chatMenuInput" />
               {(conversations && user) ?  ( conversations.map(convo=> 
               <div key={convo._id} onClick={()=> setCurrentChat(convo)}>
                   <Conversation  conversation={convo} currentUser={user}/>
                </div>
        
               )): <ConvoLoader/>}
                
            </div>
        </div>
        <div className="chatBox">
            <div className="chatBoxWrapper">
                {currentChat? 
                <>
                <div className="chatBoxTop">
                {
                    messages.map(message=>  
                    <div ref={scrollRef} key={message._id}>
                        <Message  message={message} avatar={user.avatar} own={message.sender === user._id}/> 
                    </div>
                    
                    )
                }
                  
                

                </div>
                <div className="chatBoxBottom">
                    <textarea onChange={(e)=> setNewMessage(e.target.value)} value={newMessage} name="" className='chatMessageInput' id="" cols="30" rows="10"></textarea>
                    <button className='btn-primary-v2-msg' onClick={newMessage!='' ? handleSubmit: undefined}>Send</button>
                </div>
                </>: 
                <div className='no-chat'>
                    <p>Open a conversation to start the Chat!</p>
                    <i className="fa-solid fa-comments"></i>
                </div>    }
                
            </div>
        </div>
        <div className="chatOnline">
            <div className="chatOnlineWRapper">
               {/*<ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat}/>*/} 

            </div>
        </div>
    </div>
        
    
   
  )
}

export default Messenger