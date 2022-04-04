import React, {useEffect, useState, useRef} from 'react'
import './smallChatBox.css'
import ReactDOM  from 'react-dom'
import defaultAvatar from '../../img/defaultAvatar.png'
import Message from './Message'
import { useSelector } from 'react-redux'
import axios from 'axios'

const SmallChatBox = ({isOpen, avatar, name, userId}) => {
  const senderId = useSelector(state=> state.auth.user._id)
  const [convoExists,setConvoExists] = useState()
  const [messages, setMessages] = useState(null)
  const [newMessage,setNewMessage] = useState('')
  const [convo,setConvo] = useState(null)
  const scrollRef = useRef()


  useEffect(async ()=> {
    try {
    const res = await axios.get(`/api/conversations/${senderId}`) 
    const conversations = res.data 
    
    const convo = conversations.find(convo => convo.members[1]=== userId)
    setConvo(convo)
    setConvoExists( convo!=undefined)

    if(convoExists) {
      try {
        const res = await  axios.get(`/api/messages/${convo._id}`)
        setMessages(res.data)

    } catch (error) {
        console.log(error)
    }
    } 
    

    } catch (error) {
      console.log(error)
    }
   
  },[senderId, convoExists,convo])

  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior:"smooth"})
},[messages])

  const handleSubmit =async (e)=> {
      e.preventDefault()
      if(newMessage!=''){
        if(convoExists){
          const message = {
            sender: senderId,
            text: newMessage,
            conversationId: convo?._id
          }

          try {
            const res = await axios.post(`/api/messages/`,message)
            setMessages([...messages,res.data])
            setNewMessage('')
          } catch (error) {
            console.log(error)
          }

        }else{
          //post a new convo
          const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }
    
          const newConvo = {
            senderId: senderId,
            receiverId: userId
          }
          try {
            const res1 = await axios.post('/api/conversations',newConvo,config)
            setConvo(res1.data)
            setConvoExists(true)

            const message = {
              sender: senderId,
              text: newMessage,
              conversationId: convo?._id
            }
            const res2 = await axios.post(`/api/messages/`,message)
            setMessages([res2.data])
            setNewMessage('')
            
          } catch (error) {
            console.log(error)
          }

          

        }
        
  

      }
  }



    return  ReactDOM.createPortal(
    <div className='small-chat-box'>
       <div className="chat-head">
         <div style={{"display":"flex", "alignItems":"center"}}>
           <img src={avatar? avatar.url:defaultAvatar} alt="" />
           <span>{name}</span>
         </div>
         <i onClick={()=> isOpen(false)} className="fas fa-times"></i>
         
       
       </div>
       <div className="chat-body">
        <div className="messages-box">
          {convo? 
          <>

          {
                    messages?.map(message=>  
                    <div ref={scrollRef} key={message._id}>
                        <Message  message={message} avatar={avatar} own={message.sender === senderId}/> 
                    </div>
                     
                    )
          }
        </>: 
        <div className='chat-start'>
            <p>Start a conversation with <strong>{name}</strong> </p>
            <i className="fa-solid fa-comments"></i>
        </div> }
    

       </div>
        <div className="text-box">
         <textarea name="" id="" value={newMessage} onChange={(e)=>setNewMessage(e.target.value)} cols="30" rows="10"></textarea>
         <i onClick={(e)=>handleSubmit(e)} className="fas fa-paper-plane" ></i>
        </div>
        
       </div>
    </div>,document.getElementById('chat'))
  
}

export default SmallChatBox