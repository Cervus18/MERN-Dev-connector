import React, { useEffect, useState } from 'react'
import './chatonline.css'
import defaultAvatar from '../../img/defaultAvatar.png'
import axios from 'axios'

const ChatOnline = ({onlineUsers,currentId, setCurrentChat}) => {

  const  [followings, setFollowings] = useState([])
  const [onlineFollowings, setOnlineFollowings] = useState([])

  useEffect(()=>{
    const getFollowings = async () =>{
      const res = await axios.get('/api/profile/followings')
      setFollowings(res.data)
    }

    getFollowings()
  },[currentId])

  useEffect(()=>{
      setOnlineFollowings(followings.filter((f)=> onlineFollowings.includes(f._id)))
  },[followings, onlineUsers])
  
  return (

      <div  >
        {
          onlineUsers.map(o=>(
          <div className="chatOnlineFriend">
              <div className="chatOnlineImgContainer">
                <img
                  className="chatOnlineImg"
                  src={defaultAvatar}
                  alt=""
                />
                <div className="chatOnlineBadge"></div>
              </div>
            <span className="chatOnlineName">{o.userId}</span>
        </div>
          ))
        }   
  </div>
  )
}

export default ChatOnline