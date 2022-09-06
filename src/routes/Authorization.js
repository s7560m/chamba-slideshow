import {useState} from "react";
import {Button, IconButton, TextField} from "@mui/material";
import {Check} from "@mui/icons-material";
import './Authorization.css'

export default function Authorization({sendAuthToParent}) {
    const [pass, setPass] = useState("");

    const submitPass = (newValue) => {
        setPass(newValue);
        sendAuthToParent(newValue);
    }

    return (<div className="authorization">
        <h1>Enter secret code to log in.</h1>
        <TextField type="password" className="authorization-textfield" placeholder="Enter secret code here..." onChange={(e) => submitPass(e.target.value)} value={pass}/>
    </div>)
}