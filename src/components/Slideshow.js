// src -> image source
// items -> image sources of the items
import {useEffect, useState} from "react";
import './Slideshow.css'
import useWindowSize from "../hooks/useWindowSize";

export default function Slideshow({src, items}) {

    const FADETYPES = {
        OUT: "OUT",
        IN: "IN"
    }

    // const [height, setHeight] = useState(null);
    // const [width, setWidth] = useState(null);
    const [counter, setCounter] = useState(0);
    const [fadeType, setFadeType] = useState(null);
    const size = useWindowSize();

    const incrementCounter = () => {
        setCounter(prevState => {
            // reset counter when it reaches the length of items
            if (counter === items.length - 1) return 0;
            return prevState + 1;
        });
    }

    // set image to window height on load
    // useEffect(() => {
    //     setHeight(window.innerHeight);
    //     setWidth(window.innerWidth);
    // }, [])

    const getFadeClass = () => {
        if (fadeType === FADETYPES.OUT) return "fade-out";
        if (fadeType === FADETYPES.IN) return "fade-in";
    }

    const imageLoad = () => {
        // incrementCounter();
        setTimeout(() => {
            setFadeType(FADETYPES.IN);
            setTimeout(() => {
                setFadeType(FADETYPES.OUT);
                setTimeout(() => incrementCounter(), 4000);
            }, 4000)
        })
    }

    const videoLoad = () => {
        // console.log("video has loaded");
        setFadeType(FADETYPES.IN);
    }

    const videoEnded = () => {
        // console.log("video has ended");
        setFadeType(FADETYPES.OUT);
        setTimeout(() => {
            incrementCounter();
        }, 4000)
    }

    // useEffect(() => {console.log(fadeType)}, [fadeType])

    // useEffect(() => {
    //
    //     // fade in after 4s, this works for both image and video media
    //     if (fadeType === FADETYPES.OUT) {
    //         setTimeout(() => {
    //             incrementCounter();
    //             setFadeType(FADETYPES.IN);
    //         }, 4000)
    //     }
    //
    // }, [fadeType])

    // use a video and img tag
    return (
        <div className={`${getFadeClass()} image-video-container`} style={{width: size.width, height: size.height}}>
            {!items[counter]?.isVideo && <img src={items[counter]?.src} onLoad={() => imageLoad()} width={size.width} height={size.height} alt={"alt"}/>}
            {items[counter]?.isVideo && <video height={size.height} width={size.width} autoPlay muted onLoadStart={() => videoLoad()} onEnded={() => videoEnded()} src={items[counter]?.src}/>}
        </div>)
}