import { useEffect, useState, useCallback } from "react";
import AltaLogo from "../../assets/images/Logo_alta.svg";
import DashboardIcon from "../../assets/images/dashboard_icon.svg";
import MonitorIcon from "../../assets/images/monitor_icon.svg";
import ServiceIcon from "../../assets/images/service_icon.svg";
import CapSoIcon from "../../assets/images/capso_icon.svg";
import ReportIcon from "../../assets/images/baocao_icon.svg";
import SettingIcon from "../../assets/images/setting_icon.svg";
import MoreIcon from "../../assets/images/fi_more-vertical.svg";
import LogoutIcon from "../../assets/images/fi_log-out.svg";
import styles from "./Menubar.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { account, stateModel } from "../../types";
import React from "react";
import { getCookie } from "../../utils";
import { getDocumentWithId, updateData } from "../../config/firebase/firestore";

type MenuBarProps = {
  onClick: (name: string, path: string) => void;
};

const menubar = [
  {
    text: "Dashboard",
    img: DashboardIcon,
    path: "/thongke",
  },
  {
    text: "Thiết bị",
    img: MonitorIcon,
    path: "/thietbi",
  },
  {
    text: "Dịch vụ",
    img: ServiceIcon,
    path: "/dichvu",
  },
  {
    text: "Cấp số",
    img: CapSoIcon,
    path: "/capso",
  },
  {
    text: "Báo cáo",
    img: ReportIcon,
    path: "/baocao",
  },
];

const menubarWithoutLogin = [
  {
    text: "Cấp số",
    img: CapSoIcon,
    path: "/capso",
  },
];

const checkIsSelect = (array: stateModel[], text: string) => {
  let checked = true;
  array.map((item) => {
    if (item.title !== text) {
      checked = false;
    }
    return checked;
  });
  return checked;
};

export const Menubar = (props: MenuBarProps) => {
  const navigate = useNavigate();
  const state = useSelector((state: RootState) => state.breadcrumb.value);

  const location = useLocation();
  const [selected, setSelected] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const handleClick = (array: stateModel[], text: string) => {
    if (checkIsSelect(array, text)) return setSelected(text);
    else return setSelected("");
  };

  const userIsLoginOrNot = useCallback(() => {
    const res = getCookie("isLogin");
    if (res === null || res === undefined) return setIsLogin(false);
    return setIsLogin(true);
  }, []);

  useEffect(() => {
    userIsLoginOrNot();
  }, [userIsLoginOrNot]);

  const getLocation = useCallback(() => {
    const getUrlLocationPathName = location.pathname;

    if (
      getUrlLocationPathName.includes("/taikhoan") ||
      getUrlLocationPathName.includes("/vaitro") ||
      getUrlLocationPathName.includes("/nhatky")
    ) {
      return setSelected("Cài đặt");
    }

    menubar.forEach((item) => {
      if (item.path === getUrlLocationPathName) return setSelected(item.text);
    });
  }, [location.pathname]);

  useEffect(() => {
    if (state.length === 0) return setSelected("");
  }, [state]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const handleLogout = async () => {
    const res = getCookie("isLogin");
    if (res === null || res === undefined) return;
    const account = (await getDocumentWithId(res, "accounts")) as account;
    account.status = "Ngưng hoạt động";
    const updateStatus = await updateData(account, "accounts");
    if (updateStatus === null) return;
    document.cookie =
      "isLogin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrap}>
        <img src={AltaLogo} alt="logo" />

        <div className={styles.listBtn}>
          {isLogin === true &&
            menubar.map((item) => (
              <div
                key={item.text}
                className={
                  selected === item.text ? styles.btnActive : styles.btn
                }
                onClick={() => {
                  props.onClick(item.text, item.path);
                  handleClick(state, item.text);
                }}
              >
                <img src={item.img} alt="icon" />
                <p>{item.text}</p>
              </div>
            ))}

          {isLogin === false &&
            menubarWithoutLogin.map((item) => (
              <div
                key={item.text}
                className={
                  selected === item.text ? styles.btnActive : styles.btn
                }
                onClick={() => {
                  props.onClick(item.text, item.path);
                  handleClick(state, item.text);
                }}
              >
                <img src={item.img} alt="icon" />
                <p>{item.text}</p>
              </div>
            ))}

          {isLogin === true && (
            <div
              className={
                selected.includes("Cài đặt") ? styles.btnActive : styles.btn
              }
              onClick={() => {
                props.onClick("Cài đặt", "");
                setSelected("Cài đặt");
              }}
            >
              <img src={SettingIcon} alt="setting icon" />
              <p>Cài đặt hệ thống</p>
              <img src={MoreIcon} alt="more icon" />
            </div>
          )}
        </div>
      </div>

      {isLogin === true && (
        <div className={styles.logoutBtn} onClick={() => handleLogout()}>
          <img src={LogoutIcon} alt="logout icon" />
          <p>Đăng xuất</p>
        </div>
      )}
    </div>
  );
};
