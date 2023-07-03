
import axios from "axios";
import { history } from "../types";


export const checkTableHeader = (header: string) => {
    if (header.includes("nút")) return false;
    return true;
};

export const removeLastItemBreadScrumb = (
    array: { title: string; path: string }[]
) => {
    const lastItem: { title: string; path: string } = array[array.length - 1];
    const newArray = array.filter(
        (item) => item.title.includes(lastItem.title) === false
    );
    return { lastItem, newArray };
};

export const getCookie = (name: string) => {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) {
        return parts.pop()?.split(";").shift();
    }
    return null;
};

export const getCurrentTimeOrTimeExpire = (type: string) => {
    const dateTime = new Date();
    let date: string = dateTime.getDate().toString();
    let month: string = (dateTime.getMonth() + 1).toString();
    if (dateTime.getDate() < 10) {
        date = `0${dateTime.getDate()}`;
    }
    if (dateTime.getMonth() < 10) {
        month = `0${dateTime.getMonth() + 1}`;
    }
    if (type.match("expire"))
        return `17:30 - ${date}/${month}/${dateTime.getFullYear()}`;
    return `${dateTime.getHours()}:${dateTime.getMinutes()} - ${date}/${month}/${dateTime.getFullYear()}`;
};

export const getOnlyDate = (dateTime: string, type: string) => {
    if (dateTime === undefined) return;
    let formatDate: string = '';
    if(type === "ahourAndDAte"){
        formatDate = dateTime.split("-")[1].trim();
    }
    if(type === "dateAndAhour"){
        formatDate = dateTime.split(" ")[0].trim();
    }
    const date = formatDate.split("/");
    const getDate = date[0];
    const getMonth = date[1];
    const getYear = date[2];
    return new Date(parseInt(getYear), parseInt(getMonth), parseInt(getDate));
};


export const createDateTypeDateAndTime = () => {
    const currentDate = new Date();
    let date: string = currentDate.getDate().toString();
    let month: string = (currentDate.getMonth() + 1).toString();
    if(parseInt(date) < 10) date = `0${date}`;
    if(parseInt(month) < 10) month = `0${month}`;
    return `${date}/${month}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`
}

export const updateHistory = async (name: string, content: string, type: string) => {
    const history: history = {
        id: '',
        username: name,
        time: createDateTypeDateAndTime(),
        ip: '',
        content: content,
    };
    const res = await axios.get("https://api.ipify.org/?format=json");
    const data: string = res.data.ip;
    history.ip = data;
    if(type === "Cập nhật"){
        history.content = `Cập nhật thông tin ${content}`
    }
    if(type === "Thêm"){
        history.content = `Thêm ${content}`
    }
    return history;
};