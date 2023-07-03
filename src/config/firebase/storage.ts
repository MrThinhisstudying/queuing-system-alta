import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from ".";

export const uploadImage = async (file: File) => {
    try {
        let image: string = "";
        const storageRef = ref(storage, `images/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        image = url;
        if(image === '') return false;
        return image;
    } catch (error) {
        console.log(error);
        return false;
    }
}