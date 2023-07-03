import {
    addDoc,
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import { NumberLevel, account, device, history, notification, role, service } from "../../types";
import { db } from "./index";

export const addData = async (
    data: device | account | role | service | NumberLevel | history | notification,
    nameColection: string
) => {
    try {
        const { id, ...value } = data;
        const docRef = await addDoc(collection(db, nameColection), value);
        return { status: true, data: { ...value, id: docRef.id } };
    } catch (error) {
        return { status: false, data: undefined };
    }
};

export const getAllDataInColection = async (nameColection: string) => {
    let res: any[] = [];
    const querySnapshot = await getDocs(collection(db, nameColection));
    querySnapshot.forEach((doc) => {
        return res.push({ ...doc.data(), id: doc.id });
    });
    return res;
};

export const updateData = async (
    data: device | account | role | service,
    nameColection: string
) => {
    try {
        const { id, ...value } = data;
        await setDoc(doc(db, nameColection, id), value);
        return data as device & account & service;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const addDatas = async (
    data: device[] | service[] | role[] | NumberLevel[],
    nameColection: string
) => {
    data.forEach(async (item) => {
        const { id, ...value } = item;
        const docRef = await addDoc(collection(db, nameColection), value);
        console.log("Document written with ID: ", docRef.id);
    });
};

export const getDocumentWithId = async (id: string, nameColection: string) => {
    let res: any = {};
    const q = query(collection(db, nameColection), where("__name__", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        res = { ...doc.data(), id: doc.id };
    });
    return res;
};

export const getListNumberLevelOfService = async (type: string) => {
    try {
        const res: NumberLevel[] = [];
        const q = query(collection(db, "numberLevels"), where("service", "==", type));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            res.push({...doc.data(), id: doc.id} as NumberLevel);
        });
        return res.sort((a,b) =>{ return parseInt(a.stt) - parseInt(b.stt) });
    } catch (error) {
        return [];
    }
};

export const updateNumberUseInRole = async (oldRole: string, newRole: string) => {
    const roles: role[] = await  getAllDataInColection('roles');
    const rolesUpdate: role[] = [];
    let roleUpdate: role = {
        id: "",
        roleName: "",
        numberPeopleUse: 0,
        description: "",
        features: []
    }
    roles.forEach((item) => { 
        if(item.roleName === oldRole){
            roleUpdate = item;
            roleUpdate.numberPeopleUse = roleUpdate.numberPeopleUse - 1
            rolesUpdate.push(roleUpdate);  
        } 
        if(item.roleName === newRole){
            roleUpdate = item;
            roleUpdate.numberPeopleUse = roleUpdate.numberPeopleUse + 1
            rolesUpdate.push(roleUpdate);  
        } 
    });

    rolesUpdate.map( async (item) => {
        await updateData(item, 'roles');
    })
    return rolesUpdate;
}
