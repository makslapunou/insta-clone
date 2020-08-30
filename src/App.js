import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase'
import { Modal, makeStyles, Button, Input } from '@material-ui/core';
import ImageUpload from './imageUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
const [posts, setPosts] = useState([]);
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [openModal, setOpenModal] = useState(false);
const [user, setUser] = useState(null)
const [openSignIn, setOpenSignIn] = useState(false)

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((authUser) => {
    if (authUser) {
      console.log(authUser);
      setUser(authUser);
    } else {
      setUser(null)
    }
  })

  return () => {
    unsubscribe();
  }
}, [user, username])

useEffect(() => {
  db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
    setPosts(snapshot.docs.map(doc => ({
      id: doc.id,
      post: doc.data()
    })))
  })
}, []);

const signUp = (event) => {
  event.preventDefault();

  auth.createUserWithEmailAndPassword(email, password)
  .then((authUser) => {
    setOpenModal(false)
    return authUser.user.updateProfile({
      displayName: username
    })
  })
  .catch((err) => alert(err.message))
}

const signIn = (event) => {
  event.preventDefault();

  auth.signInWithEmailAndPassword(email, password)
  .then((user) => {
    setOpenModal(false)
    setOpenSignIn(false)
  })
  .catch((err) => alert(err.message));
}

  return (
    <div className="App">

        <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false)
        }
      }
      >
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
            <img className="app__imageHeader" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />
            { !openSignIn && (
              <Input 
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            )
            }
            <Input 
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={openSignIn ? signIn : signUp}>{openSignIn ? 'Sign In' : 'Sign Up'}</Button>
            </form>
          </div>
      </Modal>
      <div className="app__header">
        <img className="app__imageHeader" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />
        <div className="app__actionHeader">

        {user && (<div><u>{user.displayName || username}</u></div>)}
        {user ? <Button onClick={() => auth.signOut()}>Log out</Button> : (
          <div className="app__loginContainer">
            <Button onClick={() => {
              setOpenModal(true)
              setOpenSignIn(true)
            }}>Sign In</Button>
            <Button onClick={() => {
              setOpenModal(true)              
              setOpenSignIn(false)
            }}>Sign Up</Button>
          </div>
        )}
        </div>
      </div>
      <div class="app__posts">
        {
          posts.map(({id, post}) => {
            return <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          })
        }
      </div>      
      {user && <ImageUpload username={user.displayName}/> }
    </div>
  );
}

export default App;
