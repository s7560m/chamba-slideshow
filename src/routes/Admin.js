import {Autocomplete, Checkbox, Fab, IconButton, TextField} from "@mui/material";
import './Admin.css'
import {useEffect, useState} from "react";
import {deleteItemByID, getItems, updateItems} from "../api/firebase";
import {Check, Delete, Edit, Queue} from "@mui/icons-material";

export default function Admin() {

    // each item has three properties: id, isVideo, and src
    const [items, setItems] = useState([]);
    const [changedIds, setChangedIds] = useState([]);

    const fetchItems = async () => {
        const items_response = await getItems()
        setItems(items_response);
    }

    useEffect(() => {
        fetchItems();
    }, [])

    const addButtonListener = () => {
        setItems(prevState => {
            let nextState = [...prevState];
            nextState.push({src: "", isVideo: false})
            return nextState;
        })
    }

    const setChangedIdsWrapper = (new_id) => {
        /*
        * Two cases: if the new id that we're adding exists, then don't do anything
        * Otherwise, we append it to the array
        * */
        if (changedIds.indexOf(new_id) > -1) return;

        setChangedIds(prevState => {
            let nextState = [...prevState];
            nextState.push(new_id);
            return nextState;
        })
    }

    // we can track the ids of the image sources we've changed
    const confirmButtonListener = () => {
        let itemsToBeUpdated = [];

        // const parseURLAsStatic = (url) => {
        //     const id = url.split('https://drive.google.com/file/d/')[1].split('/view')[0];
        //     return `https://drive.google.com/uc?id=${id}`
        // }

        items.forEach((item) => {
            changedIds.forEach((changedId) => {
                if (item.id === changedId) {

                    // parse url from google drive link to its static url
                    // item.src = parseURLAsStatic(item.src);
                    itemsToBeUpdated.push(item);
                }
            })
        })

        // console.log(itemsToBeUpdated);
        updateItems(itemsToBeUpdated);

        //reset state
        setChangedIds([]);
        fetchItems();
    }

    const deleteButtonListener = async (id) => {

        /* we have two cases: if id is undefined, we can just pop the object from the array
           if item.src is not empty, then we should delete from firebase then refetch the items to have
           react re-render */

        if (!id) {
            setItems(prevState => {
                let nextState = [...prevState];
                nextState.pop();
                return nextState;
            })

            return;
        }

        await deleteItemByID(id);
        fetchItems();
    }

    const changeTextListener = (newValue, index) => {
        // change src at index but also notify react that we've changed this textfield specifically, by tracking its id
        // this is so we can update it in firestore later when we press confirm
        setItems(prevState => {
            let nextState = [...prevState];
            nextState[index].src = newValue;
            return nextState;
        })

        setChangedIdsWrapper(items[index].id);
    }

    const changeAutocompleteListener = (newValue, index) => {
        setItems(prevState => {
            let nextState = [...prevState];

            if (newValue === "Video") {
                nextState[index].isVideo = true;
            }

            if (newValue === "Image") {
                nextState[index].isVideo = false;
            }
            return nextState;
        })
    }

    const getTextFields = () => {
        return items.map((item, index) => (
            <div key={index} className="textfield-container">
                <TextField
                    className="admin-text"
                    label="Enter your google drive source here"
                    placeholder="e.g. https://drive.google.com/file/d/1jd4k5qVAZkozDmN7b_h7rKbqVJ8Qvs3-/view"
                    value={item.src}
                    onChange={(e) => changeTextListener(e.target.value, index)}
                />
                <Autocomplete
                    className="admin-autocomplete"
                    renderInput={(params) => <TextField {...params} label="Media type"/>}
                    options={["Image", "Video"]}
                    value={item.isVideo ? "Video" : "Image"}
                    onChange={(e, v) => {changeAutocompleteListener(v, index)}}
                />
                <IconButton className="trash" onClick={() => deleteButtonListener(item.id)}>
                    <Delete/>
                </IconButton>
            </div>
            )
        )
    }

    return (<div className="admin">
        <h1>Add or delete images based on their sources.</h1>
        <div className="virtual-scroll">
            {getTextFields()}
        </div>
        <IconButton style={{borderRadius: 0}} onClick={() => addButtonListener()}>
            <Queue/>
            <p className="icon-button-label">Add image or video</p>
        </IconButton>
        <IconButton style={{borderRadius: 0}} onClick={() => confirmButtonListener()}>
            <Check/>
            <p className="icon-button-label">Confirm changes</p>
        </IconButton>
    </div>)
}