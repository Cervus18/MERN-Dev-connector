import './App.css';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import Messenger from './components/messenger/Messenger';

// Redux
import { Provider } from 'react-redux';
import store from './store';

if(localStorage.token){
  setAuthToken(localStorage.token)
 }

const App = () => {

  useEffect(()=>{
    store.dispatch(loadUser())


 
  },[]) // will on ly run once bcz of []

  return (
  <Provider store={store}>
    <Router>
      <>
        <Navbar/>
        <Route exact path="/" component={Landing} />
        
         <PrivateRoute exact path="/messenger" component={Messenger} />
        <section className="container">
          <Alert/>
          {/*<div className="friends"></div>*/}
          <Switch>

            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profiles/:query" component={Profiles} />
            <Route exact path="/profile/:id" component={Profile} />

            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/create-profile" component={CreateProfile} />
            <PrivateRoute exact path="/edit-profile" component={EditProfile} />
            <PrivateRoute exact path="/add-experience" component={AddExperience} />
            <PrivateRoute exact path="/add-education" component={AddEducation} />
            <PrivateRoute exact path="/posts" component={Posts} />
            <PrivateRoute exact path="/posts/:id" component={Post} />


 

       


          </Switch>
        </section>
      </>
    </Router>
  </Provider>
  )

}
  


export default App;
