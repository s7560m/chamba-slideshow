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

    return (<>
        <Slideshow items={items}/>
    </>)
}