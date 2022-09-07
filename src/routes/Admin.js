import {Alert, Autocomplete, Checkbox, Fab, IconButton, Snackbar, TextField} from "@mui/material";
import './Admin.css'
import {useEffect, useState} from "react";
import {deleteItemByID, getItems, updateItems} from "../api/firebase";
import {Check, Delete, Edit, Queue} from "@mui/icons-material";

export default function Admin() {

    // each item has three properties: id, isVideo, and src
    const [items, setItems] = useState([]);
    const [changedIds, setChangedIds] = useState([]);
    const [showError, setShowError] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);

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
        let invalid_flag_type = [];
        const SUPPORTED_TYPES = ["jpg", "jpeg", "png", "mp4"];

        setShowError(false);
        items.forEach((item) => {

            if (!SUPPORTED_TYPES.some(type => item.src.includes(type))) invalid_flag_type.push(0);

            changedIds.forEach((changedId) => {

                // if item.id is changed id, we will change it
                if (item.id === changedId) {
                    itemsToBeUpdated.push(item);
                }
            })
        })

        if (invalid_flag_type.length > 0) return setShowError(true);
        // console.log(itemsToBeUpdated);
        updateItems(itemsToBeUpdated);

        setShowSnackbar(true);

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

        const SUPPORTED_IMG_TYPES = ["jpg", "jpeg", "png"];
        const SUPPORTED_VID_TYPES = ["mp4"]

        // change src at index but also notify react that we've changed this textfield specifically, by tracking its id
        // this is so we can update it in firestore later when we press confirm
        setItems(prevState => {
            let nextState = [...prevState];
            nextState[index].src = newValue;

            // set the isVideo property depending on the filetype of the src
            if (SUPPORTED_IMG_TYPES.some(type => newValue.includes(type))) {
                nextState[index].isVideo = false;
            } else if (SUPPORTED_VID_TYPES.some(type => newValue.includes(type))) {
                nextState[index].isVideo = true;
            }

            return nextState;
        })

        setChangedIdsWrapper(items[index].id);
    }

    const getTextFields = () => {
        return items.map((item, index) => (
            <div key={index} className="textfield-container">
                <TextField
                    className="admin-text"
                    label="Enter your source link here"
                    placeholder="e.g. https://i.imgur.com/AT6FqXD.jpeg"
                    value={item.src}
                    onChange={(e) => changeTextListener(e.target.value, index)}
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
        <Snackbar open={showSnackbar} autoHideDuration={3000} onClose={() => setShowSnackbar(false)}>
            <Alert onClose={() => setShowSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                Your slideshow has been updated!
            </Alert>
        </Snackbar>
        <Snackbar open={showError} autoHideDuration={6000} onClose={() => setShowError(false)}>
            <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '50%' }}>
                Invalid filetype entered in one of the fields. Supported filetypes are .png .jpg .jpeg and .mp4
            </Alert>
        </Snackbar>
    </div>)
}