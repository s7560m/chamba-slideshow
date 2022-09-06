import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc, addDoc} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB6p7Gnzi_8Hd5lhWBSg6YaviBDJiH23rE",
    authDomain: "chamba-project-15b59.firebaseapp.com",
    projectId: "chamba-project-15b59",
    storageBucket: "chamba-project-15b59.appspot.com",
    messagingSenderId: "97798044141",
    appId: "1:97798044141:web:5a807a6e5f6e9a84f98fe4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// @return an array of all items
export async function getItems() {
    const querySnapshot = await getDocs(collection(db, "items"))
    return querySnapshot.docs.map(doc => {
        return {
            id: doc.id,
            ...doc.data()
        }
    })
}

// @param id -> an array of ids of which we'll update
export async function updateItems(items) {

    return await Promise.all(items.map(item => {
        let docRef;
        // two cases: if there's an id present, we will update the doc
        // if not, it means the doc doesn't exist yet, so we add it
        if (item?.id) {
            docRef = doc(db, 'items', item.id);
            return updateDoc(docRef, {
                src: item.src,
                isVideo: item.isVideo,
            })
        }

        return addDoc(collection(db, "items"), {
            src: item.src,
            isVideo: item.isVideo,
        })
    }))
}

// @param id -> the id of the media we're deleting
export async function deleteItemByID(id) {
    await deleteDoc(doc(db, "items", id))
}
