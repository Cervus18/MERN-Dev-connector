import React, {useState} from "react";
import {useSelector, useDispatch} from 'react-redux'
import { followOrUnfollow } from '../../actions/profile'
import defaultAvatar from '../../img/defaultAvatar.png'
import SmallChatBox from "../messenger/SmallChatBox";


const  ProfileTop = ({profile:{
    status,
    company,
    location,
    website,
    social,
    user: {name, avatar, _id}
}}) => {
  
  const [openChatBox,setOpenChatBox] = useState(false)
  const followings = useSelector(state => state.profile.followings)
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  const loggedUserId = useSelector(state => state.auth.user._id)
  const dispatch = useDispatch()

  const isFollowed = followings.some((userObject)=> userObject.user === _id)

  return (
    <div className="profile-top p-2" style={{"background":"#6b5fc6","color":"#fff","borderRadius":"8px","boxShadow":"rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"}}>
      
      <img
        className="round-img my-1"
        style={{"border":"7px solid #fff", "width":"110px","height":"110px"}}
        src={avatar? avatar.url: defaultAvatar}
        alt=""
      />
     
      <h1 className="large">{name}</h1>
      <p className="lead">{status} {company && <span>at {company}</span>}</p>
      <p>{location && <span><i  className="fa-solid fa-location-dot"></i>{' '}{location}</span>}</p>
      <br/>
      {(isAuthenticated && loggedUserId !== _id ) && <button onClick={()=>{dispatch(followOrUnfollow(_id))}} style={{"border":"1px solid #fff"}} className={`btn ${!isFollowed? 'btn-success': 'btn-danger'}`}>{isFollowed? 'Unfollow': 'Follow'}</button>}
      {(isAuthenticated && loggedUserId !== _id ) && <button onClick={()=>{setOpenChatBox(true)}} className="btn" style={{"borderRadius":"18px","marginTop":"10px"}}><i className='fas fa-comment-alt'></i></button>  }
      <div className="icons my-1">
      
        { website && (
            <a href={website} target="_blank" rel="noopener noreferrer">
              <i className="fas fa-globe fa-2x"></i>
            </a>
        )}
        {social && social.twitter && (
            <a href={social.twitter} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter fa-2x"></i>
            </a>
        )} 

        {social && social.facebook && (
            <a href={social.facebook} target="_blank" rel="noopener noreferrer">
             <i className="fab fa-facebook fa-2x"></i>
           </a>
        )}
        {social && social.linkedin && (
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
             <i className="fab fa-linkedin fa-2x"></i>
           </a>
        )}
        {social && social.youtube && (
            <a href={social.youtube} target="_blank" rel="noopener noreferrer">
             <i className="fab fa-youtube fa-2x"></i>
           </a>
        )}
        {social && social.instagram && (
         <a href={social.instagram} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram fa-2x"></i>
          </a>
        )}

      
      {openChatBox && <SmallChatBox name={name} userId={_id} avatar={avatar} isOpen={setOpenChatBox}/>}   
       
       
        
      </div>
    </div>
  );
};

export default ProfileTop;
