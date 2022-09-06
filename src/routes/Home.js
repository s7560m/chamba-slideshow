import Slideshow from "../components/Slideshow";
import {useEffect, useState} from "react";
import {getItems} from "../api/firebase";

export default function Home() {

    const [items, setItems] = useState([]);

    const fetchItems = async () => {
        const items_response = await getItems()
        setItems(items_response);
    }

    useEffect(() => {
        fetchItems();
    }, [])

    // const items = [
    //     {
    //         src: "https://image.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-260nw-1037719204.jpg",
    //         isVideo: false,
    //     },
    //     {
    //         src: "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
    //         isVideo: false,
    //     },
    //     {
    //         src: "https://www.w3schools.com/tags/movie.mp4",
    //         isVideo: true,
    //     }
    // ]

    return (<>
        <Slideshow items={items}/>
    </>)
}