import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./routes/Home";
import Admin from "./routes/Admin";
import Navigation from "./components/Navigation";
import {createTheme} from "@mui/material";
import {ThemeProvider} from "@emotion/react";
import {useEffect, useState} from "react";
import Authorization from "./routes/Authorization";
import {getPassword} from "./api/firebase";

const materialUITheme = createTheme({
    palette: {
        primary: {
            main: "#242424"
        },

        secondary: {
            main: "#ffffff"
        }
    }
})

function App() {

  const [show, setShow] = useState(true);
  const [pass, setPass] = useState(null);
  const [auth, setAuth] = useState("")

  useEffect(() => {
      if (show) {
          setTimeout(() => {
              // hide navbar after 2 seconds of loading the slideshow
              setShow(false)
          }, 3000);
      }
  }, [show])

  const fetchPass = () => {
      getPassword().then(response => setPass(response));
  }
  // when the app loads, fetch the password and store it in a state obj
  useEffect(() => {
      fetchPass();
  }, [])

  const getAdminOrAuthorization = () => {
      if (auth === pass) return <Admin/>
      return <Authorization sendAuthToParent={setAuth}/>
  }

  return (
    <div className="App" onMouseMove={() => setShow(true)}>
        <ThemeProvider theme={materialUITheme}>
          <BrowserRouter>
            <Navigation show={show}/>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/admin" element=
                  {getAdminOrAuthorization()}
              />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      {/*<p>hello world</p>*/}
    </div>
  );
}

export default App;
