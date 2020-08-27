import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Conponents/Post";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";

import { TextField } from "@material-ui/core";

import { db } from "./Conponents/firebase";
import { auth } from "firebase";
import ImageUpload from "./Conponents/ImageUpload";
import InstagramEmbed from "react-instagram-embed";

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [signin, setSignin] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [passward, setPassward] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authUser) => {
      console.log(username);
      if (authUser) {
        //user has login
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          //dont update userName
        } else {
          //if we just created user
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        //user has not login
        setUser(null);
      }
    });

    return () => {
      //prefrom some cleanup action
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);

  //Authentication method
  const submitHandle = (event) => {
    event.preventDefault();

    auth()
      .createUserWithEmailAndPassword(email, passward)
      .catch((error) => alert(error.message));
    setEmail("");
    setPassward("");
  };

  const signupSiginIn = () => {
    return (
      <Dialog className="dialog" open={open} onClose={() => setOpen(false)}>
        <form onSubmit={submitHandle}>
          <div className="login">
            <img
              className="app__loginLogo"
              src="https://www.freepnglogos.com/uploads/pics-photos-instagram-logo-png-4.png"
              alt="logo"
            />
            <TextField
              className="dialog__input"
              type="text"
              label="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              className="dialog__input"
              type="email"
              label="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              className="dialog__input"
              type="password"
              label="password"
              value={passward}
              onChange={(e) => setPassward(e.target.value)}
            />
            <DialogActions>
              <Button
                type="submit"
                variant="contained"
                onClick={() => setOpen(false)}
                color="primary"
              >
                Signup
              </Button>
            </DialogActions>
          </div>
        </form>
      </Dialog>
    );
  };

  const dialog = () => {
    const signin = (e) => {
      e.preventDefault();
      console.log("signin");
      auth()
        .signInWithEmailAndPassword(email, passward)
        .catch((error) => alert(error.message));
      setSignin(false);
      setEmail("");
      setPassward("");
    };
    return (
      <Dialog className="dialog" open={true} onClose={() => setSignin(false)}>
        <form onSubmit={signin}>
          <div className="login">
            <img
              className="app__loginLogo"
              src="https://www.freepnglogos.com/uploads/pics-photos-instagram-logo-png-4.png"
              alt="logo"
            />

            <TextField
              className="dialog__input"
              type="email"
              label="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              className="dialog__input"
              type="password"
              label="password"
              value={passward}
              onChange={(e) => setPassward(e.target.value)}
            />
            <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                Signin
              </Button>
            </DialogActions>
          </div>
        </form>
      </Dialog>
    );
  };

  return (
    <div className="App">
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRQuPvLvBV4DUB-zA_W8_ovOqt0vDFDAFa3Gg&usqp=CAU"
          alt="logo"
        />
        {user ? (
          <Button color="primary" onClick={() => auth().signOut()}>
            Log out
          </Button>
        ) : (
          <div className="app__header__button">
            <Button color="primary" onClick={() => setOpen(true)}>
              Signup
            </Button>
            <Button color="primary" onClick={() => setSignin(true)}>
              SignIN
            </Button>
          </div>
        )}
      </div>
      {signupSiginIn()}
      {signin && dialog()}

      <div className="app__posts">
        <div className="app__postleft">
          {posts.map(({ post, id }) => {
            return (
              <Post
                key={id}
                post={post.imageUrl}
                caption={post.caption}
                userName={post.username}
                postId={id}
                user={user}
              />
            );
          })}
        </div>
        <div className="app__postright">
          <InstagramEmbed
            url="https://www.instagram.com/p/CDOg7WrAnmG/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName || user ? (
        <ImageUpload userName={user.displayName} />
      ) : (
        <h2 className="imageNotUpload">Sorry you need to Login/signin</h2>
      )}

      <div>
        <p className="footerText">@Sonu Sharma</p>
      </div>
    </div>
  );
}

export default App;
