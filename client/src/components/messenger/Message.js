import React from 'react'
import './message.css'
import defaultAvatar from '../../img/defaultAvatar.png'
import { format } from 'timeago.js'
import { useSelector } from 'react-redux'

const Message = ({message,own,avatar}) => {
  
  const user = useSelector(state=>state.auth.user)

  return (
    <div className={own? "message own" : "message "}>
        <div className="messageTop">
            {own ? <img src={user.avatar? user.avatar.url : defaultAvatar} alt="" className="messageImg" />:
                <img src={ avatar? avatar.url:defaultAvatar} alt="" className="messageImg" />
            } 
            <p className='messageText'>{message.text}</p>
        </div>
        <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  )
}

export default Message  