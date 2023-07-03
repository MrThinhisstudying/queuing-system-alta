import React, { useCallback, useEffect, useState } from "react";
import styles from "./dashboardLayout.module.css";
import AvatarTest from "../../assets/images/avatar_test.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  addValue,
  changeValue,
  clearValue,
} from "../../store/reducers/breadcrumbSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import { getCookie } from "../../utils";
import { getDocumentWithId } from "../../config/firebase/firestore";
import { NumberLevel, account, device, service } from "../../types";
import { changeAccountLogin } from "../../store/reducers/accountSlice";
import { Calendar } from "../../components/Calendar";
import { getAllDevices } from "../../store/reducers/devicesSlice";
import { getAllServices } from "../../store/reducers/serviceSlice";
import { getAllNumberLevels } from "../../store/reducers/numberLevelSlice";
import { Menubar } from "../../components/Menubar";
import { Notification } from "../../components/Notification";
import { ProgressCustom } from "../../components/ProgressCustom";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export const DashboardLayout = (props: DashboardLayoutProps) => {
  const accountInfo = useSelector(
    (state: RootState) => state.account.accountLogin
  );
  const devicesState = useSelector((state: RootState) => state.device.devices);
  const serviceState = useSelector(
    (state: RootState) => state.service.services
  );
  const numberLevelsState = useSelector(
    (state: RootState) => state.numberLevel.numberLevels
  );

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const [notificationClick, setNotificationClick] = useState<boolean>(false);
  const [openSetting, setOpenSetting] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getAllDevices());
    dispatch(getAllServices());
    dispatch(getAllNumberLevels());
  }, [dispatch]);

  const handleClickMenu = useCallback(
    (name: string, path: string) => {
      let temp = [] as { title: string; path: string }[];
      if (name === "Dashboard") dispatch(addValue({ title: name, path }));
      if (name === "Thiết bị") {
        temp = [
          {
            title: name,
            path: "",
          },
          {
            title: "Danh sách thiết bị",
            path: "/thietbi",
          },
        ];
      }
      if (name === "Cấp số") {
        temp = [
          { title: "Cấp số" },
          { title: "Danh sách cấp số", path: "/capso" },
        ] as { title: string; path: string }[];
      }
      if (name.includes("Cài đặt")) return setOpenSetting(true);

      setOpenSetting(false);
      dispatch(changeValue(temp));
      return navigate(path);
    },
    [dispatch, navigate]
  );

  const handleClickNotification = () => {
    setNotificationClick(!notificationClick);
  };

  const handleClickOpenSetting = (name: string, path: string) => {
    const temp = [{ title: "Cài đặt hệ thống", path: "" }] as {
      title: string;
      path: string;
    }[];
    temp.push({ title: name, path });
    setOpenSetting(false);
    navigate(path);
    dispatch(changeValue(temp));
  };

  const infoAccountLoginWithId = useCallback(async () => {
    const res = getCookie("isLogin");
    if (res === null || res === undefined) return navigate("/");
    const accountInfo = (await getDocumentWithId(res, "accounts")) as account;
    if (accountInfo?.id === undefined) return navigate("/");
    dispatch(changeAccountLogin(accountInfo));
  }, [dispatch, navigate]);

  useEffect(() => {
    infoAccountLoginWithId();
  }, [infoAccountLoginWithId]);

  const filterDevicesState = (type: string, value: string) => {
    let res: device[] | service[] | NumberLevel[] = [];
    if (type === "devices") {
      if (value === "Hoạt động")
        res = devicesState.filter((item) => {
          return item.activeStatus === value;
        });
      if (value === "Ngưng hoạt động")
        res = devicesState.filter((item) => {
          return item.activeStatus === value;
        });
    }
    if (type === "services") {
      if (value === "Hoạt động")
        res = serviceState.filter((item) => {
          return item.activeStatus === value;
        });
      if (value === "Ngưng hoạt động")
        res = serviceState.filter((item) => {
          return item.activeStatus === value;
        });
    }
    if (type === "numberLevel") {
      if (value === "Đã sử dụng")
        res = numberLevelsState.filter((item) => {
          return item.status === value;
        });
      if (value === "Đang chờ")
        res = numberLevelsState.filter((item) => {
          return item.status === value;
        });
      if (value === "Bỏ qua")
        res = numberLevelsState.filter((item) => {
          return item.status === value;
        });
    }
    return res.length;
  };

  const handleCalPercent = (type: string, value: string) => {
    const count = filterDevicesState(type, value);
    let result: number = 0;
    if (type === "devices") result = (count / devicesState.length) * 100;
    if (type === "services") result = (count / serviceState.length) * 100;
    if (type === "numberLevel")
      result = (count / numberLevelsState.length) * 100;

    return Math.round(result);
  };

  const handleDisplayValueWithType = (type: string) => {
    let res: NumberLevel[] = [];
    if (type === "numberUsed") res = numberLevelsState;
    if (type === "waitting")
      res = numberLevelsState.filter((item) => {
        return item.status === "Đang chờ";
      });
    if (type === "wasUse")
      res = numberLevelsState.filter((item) => {
        return item.status === "Đã sử dụng";
      });
    if (type === "skip")
      res = numberLevelsState.filter((item) => {
        return item.status === "Bỏ qua";
      });
    return res.length;
  };

  return (
    <div className={styles.container}>
      <div className={styles.menubar}>
        <div
          style={{
            position: "relative",
            height: "100vh",
            width: "212px",
          }}
        >
          <Menubar onClick={(name, path) => handleClickMenu(name, path)} />

          {openSetting && (
            <div className={styles.settingBtn}>
              <div
                onClick={() =>
                  handleClickOpenSetting("Quản lý vai trò", "/vaitro")
                }
              >
                <p>Quản lý vài trò</p>
              </div>
              <div
                onClick={() =>
                  handleClickOpenSetting("Quản lý tài khoản", "/taikhoan")
                }
              >
                <p>Quản lý tài khoản</p>
              </div>
              <div
                onClick={() =>
                  handleClickOpenSetting("Nhật ký hoạt động", "/nhatky")
                }
              >
                <p>Nhật ký người dùng</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.left}>
          <p>Dashboard</p>

          <div className={styles.leftListNumber}>
            <div className={styles.dashboardField}>
              <div>
                <div className={styles.backgroundColorBlue}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_69043_6873)">
                      <path
                        d="M5.25 0C5.44891 0 5.63968 0.0790176 5.78033 0.21967C5.92098 0.360322 6 0.551088 6 0.75V1.5H18V0.75C18 0.551088 18.079 0.360322 18.2197 0.21967C18.3603 0.0790176 18.5511 0 18.75 0C18.9489 0 19.1397 0.0790176 19.2803 0.21967C19.421 0.360322 19.5 0.551088 19.5 0.75V1.5H21C21.7956 1.5 22.5587 1.81607 23.1213 2.37868C23.6839 2.94129 24 3.70435 24 4.5V21C24 21.7956 23.6839 22.5587 23.1213 23.1213C22.5587 23.6839 21.7956 24 21 24H3C2.20435 24 1.44129 23.6839 0.87868 23.1213C0.316071 22.5587 0 21.7956 0 21V4.5C0 3.70435 0.316071 2.94129 0.87868 2.37868C1.44129 1.81607 2.20435 1.5 3 1.5H4.5V0.75C4.5 0.551088 4.57902 0.360322 4.71967 0.21967C4.86032 0.0790176 5.05109 0 5.25 0V0ZM1.5 6V21C1.5 21.3978 1.65804 21.7794 1.93934 22.0607C2.22064 22.342 2.60218 22.5 3 22.5H21C21.3978 22.5 21.7794 22.342 22.0607 22.0607C22.342 21.7794 22.5 21.3978 22.5 21V6H1.5Z"
                        fill="#6493F9"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_69043_6873">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <p>Số thứ tự đã cấp</p>
              </div>

              <div>
                <p>{handleDisplayValueWithType("numberUsed")}</p>
                <div>
                  <p>32.41%</p>
                </div>
              </div>
            </div>

            <div className={styles.dashboardField}>
              <div>
                <div className={styles.backgroundColorGreen}>
                  <svg
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_69043_8180)">
                      <path
                        d="M17.031 10.7194C17.1008 10.789 17.1563 10.8718 17.1941 10.9629C17.2319 11.054 17.2513 11.1517 17.2513 11.2504C17.2513 11.349 17.2319 11.4467 17.1941 11.5378C17.1563 11.6289 17.1008 11.7117 17.031 11.7814L12.531 16.2814C12.4613 16.3512 12.3786 16.4066 12.2875 16.4444C12.1963 16.4822 12.0987 16.5017 12 16.5017C11.9014 16.5017 11.8037 16.4822 11.7126 16.4444C11.6214 16.4066 11.5387 16.3512 11.469 16.2814L9.219 14.0314C9.14927 13.9616 9.09396 13.8788 9.05622 13.7877C9.01848 13.6966 8.99905 13.599 8.99905 13.5004C8.99905 13.4017 9.01848 13.3041 9.05622 13.213C9.09396 13.1219 9.14927 13.0391 9.219 12.9694C9.35983 12.8285 9.55084 12.7494 9.75 12.7494C9.84862 12.7494 9.94627 12.7688 10.0374 12.8066C10.1285 12.8443 10.2113 12.8996 10.281 12.9694L12 14.6899L15.969 10.7194C16.0387 10.6495 16.1214 10.5941 16.2126 10.5563C16.3037 10.5185 16.4013 10.499 16.5 10.499C16.5987 10.499 16.6963 10.5185 16.7875 10.5563C16.8786 10.5941 16.9613 10.6495 17.031 10.7194V10.7194Z"
                        fill="#35C75A"
                      />
                      <path
                        d="M6 0C6.19891 0 6.38968 0.0790176 6.53033 0.21967C6.67098 0.360322 6.75 0.551088 6.75 0.75V1.5H18.75V0.75C18.75 0.551088 18.829 0.360322 18.9697 0.21967C19.1103 0.0790176 19.3011 0 19.5 0C19.6989 0 19.8897 0.0790176 20.0303 0.21967C20.171 0.360322 20.25 0.551088 20.25 0.75V1.5H21.75C22.5456 1.5 23.3087 1.81607 23.8713 2.37868C24.4339 2.94129 24.75 3.70435 24.75 4.5V21C24.75 21.7956 24.4339 22.5587 23.8713 23.1213C23.3087 23.6839 22.5456 24 21.75 24H3.75C2.95435 24 2.19129 23.6839 1.62868 23.1213C1.06607 22.5587 0.75 21.7956 0.75 21V4.5C0.75 3.70435 1.06607 2.94129 1.62868 2.37868C2.19129 1.81607 2.95435 1.5 3.75 1.5H5.25V0.75C5.25 0.551088 5.32902 0.360322 5.46967 0.21967C5.61032 0.0790176 5.80109 0 6 0V0ZM2.25 6V21C2.25 21.3978 2.40804 21.7794 2.68934 22.0607C2.97064 22.342 3.35218 22.5 3.75 22.5H21.75C22.1478 22.5 22.5294 22.342 22.8107 22.0607C23.092 21.7794 23.25 21.3978 23.25 21V6H2.25Z"
                        fill="#35C75A"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_69043_8180">
                        <rect
                          width="24"
                          height="24"
                          fill="white"
                          transform="translate(0.75)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <p>Số thứ tự đã sử dụng</p>
              </div>

              <div>
                <p>{handleDisplayValueWithType("wasUse")}</p>
                <div>
                  <p>32.41%</p>
                </div>
              </div>
            </div>

            <div className={styles.dashboardField}>
              <div>
                <div className={styles.backgroundColorOrange}>
                  <svg
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.2505 8.9625L20.155 8.058C20.2767 7.93778 20.4308 7.85549 20.5984 7.82114C20.766 7.78679 20.94 7.80185 21.0992 7.8645L22.2017 8.304C22.3627 8.36959 22.5007 8.48137 22.5983 8.62525C22.6958 8.76913 22.7486 8.93867 22.75 9.1125V11.1315C22.748 11.3637 22.6539 11.5856 22.4884 11.7485C22.3229 11.9113 22.0995 12.0018 21.8672 12L21.8297 11.9985C14.1077 11.5185 12.55 4.977 12.2552 2.4735C12.2425 2.35915 12.2525 2.24341 12.2845 2.1329C12.3165 2.02239 12.37 1.91927 12.4418 1.82942C12.5137 1.73958 12.6026 1.66477 12.7034 1.60928C12.8042 1.55379 12.9149 1.51869 13.0292 1.506C13.0631 1.50199 13.0972 1.49998 13.1312 1.5H15.0812C15.2552 1.50063 15.4249 1.55323 15.5687 1.65106C15.7125 1.74888 15.8238 1.88746 15.8882 2.049L16.3285 3.1515C16.3932 3.31023 16.4098 3.48452 16.376 3.65259C16.3423 3.82066 16.2597 3.97506 16.1387 4.0965L15.2342 5.001C15.2342 5.001 15.7547 8.526 19.2505 8.9625Z"
                      fill="#FFAC6A"
                    />
                    <path
                      d="M12.25 22.5H10.75V18.75C10.7494 18.1534 10.5122 17.5815 10.0903 17.1597C9.6685 16.7378 9.09655 16.5006 8.5 16.5H5.5C4.90345 16.5006 4.3315 16.7378 3.90967 17.1597C3.48784 17.5815 3.2506 18.1534 3.25 18.75V22.5H1.75V18.75C1.75119 17.7558 2.14666 16.8027 2.84966 16.0997C3.55267 15.3967 4.5058 15.0012 5.5 15H8.5C9.4942 15.0012 10.4473 15.3967 11.1503 16.0997C11.8533 16.8027 12.2488 17.7558 12.25 18.75V22.5Z"
                      fill="#FFAC6A"
                    />
                    <path
                      d="M7 7.5C7.44501 7.5 7.88002 7.63196 8.25004 7.87919C8.62005 8.12643 8.90843 8.47783 9.07873 8.88896C9.24903 9.3001 9.29359 9.7525 9.20677 10.189C9.11995 10.6254 8.90566 11.0263 8.59099 11.341C8.27632 11.6557 7.87541 11.87 7.43896 11.9568C7.0025 12.0436 6.5501 11.999 6.13896 11.8287C5.72783 11.6584 5.37643 11.37 5.1292 11C4.88196 10.63 4.75 10.195 4.75 9.75C4.75 9.15326 4.98705 8.58097 5.40901 8.15901C5.83097 7.73705 6.40326 7.5 7 7.5ZM7 6C6.25832 6 5.5333 6.21993 4.91661 6.63199C4.29993 7.04404 3.81928 7.62971 3.53545 8.31494C3.25162 9.00016 3.17736 9.75416 3.32206 10.4816C3.46675 11.209 3.8239 11.8772 4.34835 12.4017C4.8728 12.9261 5.54098 13.2833 6.26841 13.4279C6.99584 13.5726 7.74984 13.4984 8.43506 13.2145C9.12029 12.9307 9.70596 12.4501 10.118 11.8334C10.5301 11.2167 10.75 10.4917 10.75 9.75C10.75 9.25754 10.653 8.76991 10.4646 8.31494C10.2761 7.85997 9.99987 7.44657 9.65165 7.09835C9.30343 6.75013 8.89004 6.47391 8.43506 6.28545C7.98009 6.097 7.49246 6 7 6Z"
                      fill="#FFAC6A"
                    />
                  </svg>
                </div>
                <p>Số thứ tự đang chờ</p>
              </div>

              <div>
                <p>{handleDisplayValueWithType("waitting")}</p>
                <div>
                  <p>32.41%</p>
                </div>
              </div>
            </div>

            <div className={styles.dashboardField}>
              <div>
                <div className={styles.backgroundColorRed}>
                  <svg
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.26 6.15C12.2819 6.10502 12.3161 6.06711 12.3585 6.04058C12.4009 6.01406 12.45 6 12.5 6C12.5501 6 12.5991 6.01406 12.6415 6.04058C12.684 6.06711 12.7181 6.10502 12.74 6.15L13.691 8.0775C13.7101 8.11649 13.7383 8.15025 13.7733 8.17587C13.8084 8.20148 13.8491 8.21817 13.892 8.2245L16.022 8.5335C16.2395 8.565 16.328 8.8335 16.169 8.988L14.63 10.4895C14.599 10.5198 14.5758 10.5572 14.5624 10.5985C14.5491 10.6398 14.546 10.6838 14.5535 10.7265L14.9165 12.8475C14.9247 12.8965 14.919 12.9468 14.9002 12.9927C14.8813 13.0386 14.85 13.0784 14.8098 13.1075C14.7696 13.1367 14.7221 13.154 14.6726 13.1576C14.6231 13.1613 14.5735 13.151 14.5295 13.128L12.6245 12.126C12.5863 12.106 12.5439 12.0956 12.5008 12.0956C12.4577 12.0956 12.4152 12.106 12.377 12.126L10.472 13.128C10.4281 13.1506 10.3787 13.1605 10.3294 13.1567C10.2801 13.1529 10.2329 13.1355 10.1929 13.1064C10.153 13.0773 10.1219 13.0377 10.1031 12.992C10.0843 12.9463 10.0786 12.8963 10.0865 12.8475L10.4495 10.7265C10.4572 10.6839 10.4543 10.64 10.4413 10.5987C10.4282 10.5575 10.4053 10.52 10.3745 10.4895L8.82952 8.988C8.79413 8.95325 8.76911 8.90934 8.75728 8.86117C8.74545 8.81301 8.74727 8.7625 8.76253 8.71531C8.77779 8.66812 8.8059 8.62612 8.84369 8.594C8.88149 8.56189 8.92748 8.54094 8.97652 8.5335L11.1065 8.2245C11.1494 8.21817 11.1902 8.20148 11.2252 8.17587C11.2602 8.15025 11.2885 8.11649 11.3075 8.0775L12.26 6.15Z"
                      fill="#F86D6D"
                    />
                    <path
                      d="M3.5 3C3.5 2.20435 3.81607 1.44129 4.37868 0.87868C4.94129 0.316071 5.70435 0 6.5 0L18.5 0C19.2956 0 20.0587 0.316071 20.6213 0.87868C21.1839 1.44129 21.5 2.20435 21.5 3V23.25C21.4999 23.3857 21.4631 23.5188 21.3933 23.6351C21.3236 23.7515 21.2236 23.8468 21.104 23.9108C20.9844 23.9748 20.8497 24.0052 20.7142 23.9988C20.5787 23.9923 20.4474 23.9492 20.3345 23.874L12.5 19.6515L4.6655 23.874C4.55256 23.9492 4.42135 23.9923 4.28584 23.9988C4.15033 24.0052 4.0156 23.9748 3.896 23.9108C3.7764 23.8468 3.67641 23.7515 3.60667 23.6351C3.53694 23.5188 3.50007 23.3857 3.5 23.25V3ZM6.5 1.5C6.10218 1.5 5.72064 1.65804 5.43934 1.93934C5.15804 2.22064 5 2.60218 5 3V21.849L12.0845 18.126C12.2076 18.0441 12.3521 18.0004 12.5 18.0004C12.6479 18.0004 12.7924 18.0441 12.9155 18.126L20 21.849V3C20 2.60218 19.842 2.22064 19.5607 1.93934C19.2794 1.65804 18.8978 1.5 18.5 1.5H6.5Z"
                      fill="#F86D6D"
                    />
                  </svg>
                </div>
                <p>Số thứ tự đã bỏ qua</p>
              </div>

              <div>
                <p>{handleDisplayValueWithType("skip")}</p>
                <div>
                  <p>32.41%</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.children}>{props.children}</div>
        </div>

        <div className={styles.right}>
          <React.Fragment>
            <div className={styles.rightTopBar}>
              <div
                className={
                  notificationClick !== true
                    ? styles.notificationBtn
                    : styles.notificationBtnActive
                }
                onClick={() => handleClickNotification()}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="FFF2E7"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.1168 12.0743L15.2834 10.691C15.1084 10.3827 14.9501 9.79935 14.9501 9.45768V7.34935C14.9501 5.39102 13.8001 3.69935 12.1418 2.90768C11.7084 2.14102 10.9084 1.66602 9.99178 1.66602C9.08345 1.66602 8.26678 2.15768 7.83345 2.93268C6.20845 3.74102 5.08345 5.41602 5.08345 7.34935V9.45768C5.08345 9.79935 4.92511 10.3827 4.75012 10.6827L3.90845 12.0743C3.57512 12.6327 3.50012 13.2493 3.70845 13.816C3.90845 14.3743 4.38345 14.8077 5.00012 15.016C6.61678 15.566 8.31678 15.8327 10.0168 15.8327C11.7168 15.8327 13.4168 15.566 15.0334 15.0244C15.6168 14.8327 16.0668 14.391 16.2834 13.816C16.5001 13.241 16.4418 12.6077 16.1168 12.0743Z"
                    fill={notificationClick ? "#FFFFFF" : "#FFAC6A"}
                  />
                  <path
                    d="M12.3582 16.6743C12.0082 17.641 11.0832 18.3327 9.9999 18.3327C9.34157 18.3327 8.69157 18.066 8.23324 17.591C7.96657 17.341 7.76657 17.0077 7.6499 16.666C7.75824 16.6827 7.86657 16.691 7.98324 16.7077C8.1749 16.7327 8.3749 16.7577 8.5749 16.7743C9.0499 16.816 9.53324 16.841 10.0166 16.841C10.4916 16.841 10.9666 16.816 11.4332 16.7743C11.6082 16.7577 11.7832 16.7493 11.9499 16.7243C12.0832 16.7077 12.2166 16.691 12.3582 16.6743Z"
                    fill={notificationClick ? "#FFFFFF" : "#FFAC6A"}
                  />
                </svg>
              </div>

              <div
                className={styles.userInfoBtn}
                onClick={() => {
                  dispatch(clearValue([]));
                  navigate("/trangchu");
                }}
              >
                <img
                  src={
                    accountInfo.avatar === "" ? AvatarTest : accountInfo.avatar
                  }
                  alt="avatar"
                />
                <div>
                  <p className={styles.hello}>Xin chào</p>
                  <p className={styles.username}>{accountInfo.fullname}</p>
                </div>
              </div>
            </div>

            {notificationClick && <Notification />}
          </React.Fragment>

          <div>
            <p>Tổng quan</p>

            <div className={styles.circle}>
              <div>
                <ProgressCustom
                  numberCircle={2}
                  percents={[
                    handleCalPercent("devices", "Hoạt động"),
                    handleCalPercent("devices", "Ngưng hoạt động"),
                  ]}
                  colorsCode={["#FF7506", "#7E7D88"]}
                />
              </div>
              <div className={styles.number}>
                <p>{devicesState.length}</p>
                <div className={styles.service}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.75663 1.16699H10.2375C12.3141 1.16699 12.8333 1.68616 12.8333 3.75699V7.44949C12.8333 9.52616 12.3141 10.0395 10.2433 10.0395H3.75663C1.68579 10.0453 1.16663 9.52616 1.16663 7.45533V3.75699C1.16663 1.68616 1.68579 1.16699 3.75663 1.16699Z"
                      stroke="#FF7506"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 10.0449V12.8333"
                      stroke="#FF7506"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M1.16663 7.58301H12.8333"
                      stroke="#FF7506"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.375 12.833H9.625"
                      stroke="#FF7506"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className={styles.textColorOrange}>Thiết bị</p>
                </div>
              </div>

              <div>
                <div className={styles.statusInfo}>
                  <p className={`${styles.status} ${styles.yellow}`}></p>
                  <p>
                    Đang hoạt động{" "}
                    <span className={styles.textColorOrange}>
                      {filterDevicesState("devices", "Hoạt động")}
                    </span>
                  </p>
                </div>

                <div className={styles.statusInfo}>
                  <p className={`${styles.status} ${styles.gray}`}></p>
                  <p>
                    Ngưng hoạt động{" "}
                    <span className={styles.textColorOrange}>
                      {filterDevicesState("devices", "Ngưng hoạt động")}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.circle}>
              <div>
                <ProgressCustom
                  numberCircle={2}
                  percents={[
                    handleCalPercent("services", "Hoạt động"),
                    handleCalPercent("services", "Ngưng hoạt động"),
                  ]}
                  colorsCode={["#4277FF", "#7E7D88"]}
                />
              </div>
              <div className={styles.number}>
                <p>{serviceState.length}</p>
                <div className={styles.service}>
                  <svg
                    width="16"
                    height="15"
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <ellipse
                      cx="3.22143"
                      cy="10.0817"
                      rx="0.498165"
                      ry="0.495793"
                      fill="#4277FF"
                    />
                    <ellipse
                      cx="4.88183"
                      cy="10.0817"
                      rx="0.498165"
                      ry="0.495793"
                      fill="#4277FF"
                    />
                    <ellipse
                      cx="6.54248"
                      cy="10.0817"
                      rx="0.498165"
                      ry="0.495793"
                      fill="#4277FF"
                    />
                    <g clipPath="url(#clip0_201_18563)">
                      <path
                        d="M9.63057 3.8252C9.96328 3.8252 10.2657 3.91953 10.527 4.12707C11.0219 4.52599 11.0934 5.20252 10.6782 5.68229C10.549 5.83323 10.395 5.968 10.2492 6.10277C10.0678 6.26988 9.93578 6.45047 9.94678 6.71461C9.95503 6.90598 9.7928 7.03266 9.60307 7.02727C9.42434 7.01919 9.3006 6.88172 9.29236 6.69035C9.27586 6.33996 9.39959 6.04347 9.64156 5.7928C9.80654 5.6203 9.98802 5.46666 10.1503 5.29147C10.373 5.05428 10.3235 4.74431 10.0375 4.57989C9.94953 4.52868 9.84229 4.49364 9.7378 4.48017C9.40784 4.43974 9.11088 4.53946 8.98439 4.95724C8.93215 5.13514 8.74792 5.22678 8.57744 5.17557C8.39871 5.12435 8.30522 4.95455 8.35472 4.76857C8.5032 4.19176 8.99539 3.82789 9.63057 3.8252Z"
                        fill="#4277FF"
                      />
                      <path
                        d="M9.63287 7.36051C9.81985 7.3659 9.95733 7.50876 9.95184 7.68665C9.94634 7.86993 9.7951 8.0047 9.60538 7.99661C9.4239 7.98853 9.28642 7.84298 9.29466 7.66509C9.30016 7.48719 9.4459 7.35512 9.63287 7.36051Z"
                        fill="#4277FF"
                      />
                    </g>
                    <path
                      d="M14.7704 5.7304C14.7704 7.04284 14.0591 8.22267 12.9266 9.04368C12.8874 9.07098 12.8658 9.11778 12.8639 9.16459L12.8149 10.4419C12.809 10.6135 12.6189 10.713 12.4739 10.6213L11.3864 9.94074C11.3864 9.94074 11.3864 9.94074 11.3845 9.94074C11.3218 9.89978 11.2453 9.88808 11.1748 9.90954C10.5282 10.1104 9.82472 10.2216 9.08797 10.2216C9.07817 10.2216 9.06837 10.2216 9.05857 10.2216C9.07817 10.0928 9.08797 9.96219 9.08797 9.82958C9.08797 7.99841 7.2108 6.51436 4.89472 6.51436C4.41857 6.51436 3.96201 6.57676 3.53485 6.69182C3.44863 6.38175 3.40356 6.05802 3.40356 5.7265C3.40356 3.24398 5.94695 1.2334 9.08601 1.2334C12.227 1.2373 14.7704 3.24983 14.7704 5.7304Z"
                      stroke="#4277FF"
                      strokeWidth="1.10526"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M3.53675 6.69531C1.88884 7.14189 0.703369 8.37828 0.703369 9.83308C0.703369 10.8003 1.22851 11.6721 2.06324 12.2785C2.09263 12.3 2.1083 12.3331 2.11026 12.3682L2.14553 13.3102C2.14945 13.4369 2.29053 13.5091 2.3983 13.4428L3.20168 12.9396C3.20756 12.9357 3.2154 12.9299 3.22128 12.926C3.25067 12.9026 3.28986 12.8948 3.32513 12.9065C3.81108 13.0625 4.34013 13.1483 4.89662 13.1483C7.04419 13.1483 8.81555 11.871 9.06048 10.2251"
                      stroke="#4277FF"
                      strokeWidth="1.10526"
                      strokeMiterlimit="10"
                    />
                    <defs>
                      <clipPath id="clip0_201_18563">
                        <rect
                          width="2.60944"
                          height="4.1751"
                          fill="white"
                          transform="translate(8.34058 3.82422)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <p className={styles.textColorblue}>Dịch vụ</p>
                </div>
              </div>

              <div>
                <div className={styles.statusInfo}>
                  <p className={`${styles.status} ${styles.blue}`}></p>
                  <p>
                    Đang hoạt động{" "}
                    <span className={styles.textColorblue}>
                      {filterDevicesState("services", "Hoạt động")}
                    </span>
                  </p>
                </div>

                <div className={styles.statusInfo}>
                  <p className={`${styles.status} ${styles.gray}`}></p>
                  <p>
                    Ngưng hoạt động{" "}
                    <span className={styles.textColorblue}>
                      {filterDevicesState("services", "Ngưng hoạt động")}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.circle}>
              <div>
                <ProgressCustom
                  numberCircle={3}
                  percents={[
                    handleCalPercent("numberLevel", "Đã sử dụng"),
                    handleCalPercent("numberLevel", "Đang chờ"),
                    handleCalPercent("numberLevel", "Bỏ qua"),
                  ]}
                  colorsCode={["#35C75A", "#7E7D88", "#F178B6"]}
                />
              </div>
              <div className={styles.number}>
                <p>{numberLevelsState.length}</p>
                <div className={styles.service}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_201_18602)">
                      <g clipPath="url(#clip1_201_18602)">
                        <path
                          d="M1.16663 9.91699L6.99996 12.8337L12.8333 9.91699"
                          stroke="#35C75A"
                          strokeWidth="1.16667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1.16663 7L6.99996 9.91667L12.8333 7"
                          stroke="#35C75A"
                          strokeWidth="1.16667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.99996 1.16699L1.16663 4.08366L6.99996 7.00033L12.8333 4.08366L6.99996 1.16699Z"
                          stroke="#35C75A"
                          strokeWidth="1.16667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </g>
                    <defs>
                      <clipPath id="clip0_201_18602">
                        <rect width="14" height="14" fill="white" />
                      </clipPath>
                      <clipPath id="clip1_201_18602">
                        <rect width="14" height="14" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <p className={styles.textColorGreen}>Cấp số</p>
                </div>
              </div>

              <div className={styles.listStatus}>
                <div className={styles.statusInfo}>
                  <p className={`${styles.status} ${styles.green}`} />
                  <p>
                    Đã sử dụng{" "}
                    <span className={styles.textColorGreen}>
                      {filterDevicesState("numberLevel", "Đã sử dụng")}
                    </span>
                  </p>
                </div>

                <div className={styles.statusInfo}>
                  <p className={`${styles.status} ${styles.gray}`} />
                  <p>
                    Đang chờ{" "}
                    <span className={styles.textColorGreen}>
                      {filterDevicesState("numberLevel", "Đang chờ")}
                    </span>
                  </p>
                </div>

                <div className={styles.statusInfo}>
                  <p className={`${styles.status} ${styles.pink}`} />
                  <p>
                    Bỏ qua{" "}
                    <span className={styles.textColorGreen}>
                      {filterDevicesState("numberLevel", "Bỏ qua")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.calendar}>
            <Calendar
              onClick={(date) => {
                return date;
              }}
              open={(value) => {
                return value;
              }}
              typeSelect={1}
              value={new Date().toUTCString()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
