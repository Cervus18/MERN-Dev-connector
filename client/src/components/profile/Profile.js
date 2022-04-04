import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getProfileById } from "../../actions/profile";
import { Link } from "react-router-dom";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import { useHistory } from "react-router-dom";

const Profile = ({
  getProfileById,
  auth,
  match,
  profile: { profile, loading },
}) => {
  

  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id]);

  let history = useHistory();
    const goToPreviousPath = () => {
        history.goBack()
    }

  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link  onClick={goToPreviousPath} className="btn btn-light"  style={{"background":"#70b5f933" , "border":"1px solid #0a66c2", "color":"#0a66c2"}}>
            Go Back 
          </Link>
          {auth.isAuthenticated &&
            !auth.loading &&
            auth.user._id === profile.user._id && (
              <Link to="/edit-profile" className="btn btn-dark">
                Edit My Profile
              </Link>
            )}
            <div className="profile-grid my-1">
                <ProfileTop profile={profile}/>
                <ProfileAbout profile={profile}/>
                <div className="profile-exp bg-white p-2" style={{"borderRadius":"8px","boxShadow":"rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"}}>
                    <h2 className="text-primary">Experience</h2>
                    {profile.experience.length > 0 ? (
                    <Fragment>
                        {profile.experience.map(experience =>(
                            <ProfileExperience key={experience._id} experience={experience}/>
                        ))}
                    </Fragment>
                    ):(<h4>No experiences mentioned</h4>)}
                </div>
                <div className="profile-edu bg-white p-2"  style={{"borderRadius":"8px","boxShadow":"rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"}}>
                    <h2 className="text-primary">Education</h2>
                    {profile.education.length > 0 ? (
                    <Fragment>
                        {profile.education.map(education =>(
                            <ProfileEducation key={education._id} education={education}/>
                        ))}
                    </Fragment>
                    ):(<h4>No education mentioned</h4>)}
                </div>
             
            </div>
            
        </Fragment>
      )}
 
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
