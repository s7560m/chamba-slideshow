import {AppBar, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Toolbar} from "@mui/material";
import './Navigation.css'
import {useNavigate} from "react-router-dom";
import {useState} from "react";

export default function Navigation({show}) {

    const navigate = useNavigate();

    return (show &&
        <>
            <AppBar component="nav" color="primary">
                <Toolbar>
                    <img height="100px"
                         src="https://923181.smushcdn.com/2283927/wp-content/uploads/2021/02/Chamba_logo_feb16.png?lossy=1&strip=1&webp=1"/>
                    <Button className="nav-button" color="secondary" onClick={() => navigate("/")}>Home</Button>
                    <Button className="nav-button" color="secondary" onClick={() => navigate("/admin")}>Admin</Button>
                </Toolbar>
            </AppBar>
        </>)
}