// src -> image source
// items -> image sources of the items
import {useEffect, useState} from "react";
import './Slideshow.css'

export default function Slideshow({src, items}) {

    const FADETYPES = {
        OUT: "OUT",
        IN: "IN"
    }

    const [height, setHeight] = useState(null);
    const [counter, setCounter] = useState(0);
    const [fadeType, setFadeType] = useState(FADETYPES.OUT);

    const incrementCounter = () => {
        setCounter(prevState => {
            // reset counter when it reaches the length of items
            if (counter === items.length - 1) return 0;
            return prevState + 1;
        });
    }

    // set image to window height on load
    useEffect(() => {
        setHeight(window.innerHeight);
    }, [])

    const getFadeClass = () => {
        if (fadeType === FADETYPES.OUT) return "fade-out";
        if (fadeType === FADETYPES.IN) return "fade-in";
    }

    useEffect(() => {
        if (fadeType === FADETYPES.IN) {
            setTimeout(() => {
                setFadeType(FADETYPES.OUT);
            }, 4000)
        }

        if (fadeType === FADETYPES.OUT) {
            setTimeout(() => {
                incrementCounter();
                setFadeType(FADETYPES.IN);
            }, 4000)
        }
    }, [fadeType])

    // use two img tags, fade out of the top one
    return (
        <div className={`${getFadeClass()} blur-background`}>
            {!items[counter]?.isVideo && <img src={items[counter]?.src} height={height} alt={"alt"}/>}
            {items[counter]?.isVideo && <video height={height} autoPlay muted onEnded={() => incrementCounter()} src={items[counter]?.src}/>}
        </div>)
}