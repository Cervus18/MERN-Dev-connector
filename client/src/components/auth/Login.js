import React , {useState} from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { login } from '../../actions/auth'

const Login = ({ login, isAuthenticated }) => {

    const [formData,setFormData] = useState({
        email: "",
        password: "",
    })

    const {email,password} = formData
    const onChange = e => setFormData({...formData, [e.target.name]:e.target.value})

    const onSubmit = e => {
        e.preventDefault()
        login(email,password)
    }
  
    // Redirect if logged in
    if(isAuthenticated){
      return <Redirect to="/dashboard" />
    }

  return (
    <>
      <h1 className="large text-primary">Sign In</h1>
      
      <form style={{"padding":"16px","borderRadius":"16px","background":"#fff","boxShadow":"rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"}} className="form" onSubmit={e=>onSubmit(e)}>
        <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
        <div className="form-group">
            
          <input style={{"background":"#f7f7f7"}}  type="email" placeholder="Email Address" value={email} onChange={e=> onChange(e)} name="email" required />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password} onChange={e=> onChange(e)}
            style={{"background":"#f7f7f7"}}
          />
        </div>
       
        <input type="submit" className="btn btn-primary" value="Sign in" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/Register">Sign Up</Link>
      </p>
    </>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps,{ login })(Login)