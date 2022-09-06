import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./routes/Home";
import Admin from "./routes/Admin";
import Navigation from "./components/Navigation";
import {createTheme} from "@mui/material";
import {ThemeProvider} from "@emotion/react";
import {useEffect, useState} from "react";

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
  const [auth, setAuth] = useState("")

  useEffect(() => {
      if (show) {
          setTimeout(() => {
              // hide navbar after 2 seconds of loading the slideshow
              setShow(false)
          }, 3000);
      }
  }, [show])

  return (
    <div className="App" onMouseMove={() => setShow(true)}>
        <ThemeProvider theme={materialUITheme}>
          <BrowserRouter>
            <Navigation show={show}/>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/admin" element={<Admin/>}/>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      {/*<p>hello world</p>*/}
    </div>
  );
}

export default App;
