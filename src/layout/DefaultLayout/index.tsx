import React, { useEffect, useState, useCallback } from "react";
import styles from "./defaultLayout.module.css";
import AvatarTest from "../../assets/images/avatar_test.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  addValue,
  changeValue,
  clearValue,
} from "../../store/reducers/breadcrumbSlice";
import { account, stateModel } from "../../types";
import { getCookie } from "../../utils";
import { getDocumentWithId } from "../../config/firebase/firestore";
import { changeAccountLogin } from "../../store/reducers/accountSlice";
import { getAllRole } from "../../store/reducers/roleSlice";
import { getAllServices } from "../../store/reducers/serviceSlice";
import { getAllDevices } from "../../store/reducers/devicesSlice";
import { Menubar } from "../../components/Menubar";
import { Notification } from "../../components/Notification";

type DefaultLayoutProps = {
  children: React.ReactNode;
};

const breadcrumbData = [
  {
    path: "/thongke",
    data: [
      {
        title: "Dashboard",
        path: "/thongke",
      },
    ],
  },
  {
    path: "/thietbi",
    data: [
      {
        title: "Thiết bị",
        path: "",
      },
      {
        title: "Danh sách thiết bị",
        path: "/thietbi",
      },
    ],
  },
  {
    path: "/dichvu",
    data: [
      {
        title: "Dịch Vụ",
        path: "",
      },
      {
        title: "Danh sách dịch vụ",
        path: "/dichvu",
      },
    ],
  },
  {
    path: "/baocao",
    data: [
      {
        title: "Báo cáo",
        path: "",
      },
      {
        title: "Lập báo cáo",
        path: "/baocao",
      },
    ],
  },
  {
    path: "/capso",
    data: [
      {
        title: "Cấp số",
        path: "",
      },
      {
        title: "Danh sách cấp số",
        path: "/capso",
      },
    ],
  },
  {
    path: "/vaitro",
    data: [
      {
        title: "Cài đặt hệ thống",
        path: "",
      },
      {
        title: "Quản lý vai trò",
        path: "/vaitro",
      },
    ],
  },
  {
    path: "/taikhoan",
    data: [
      {
        title: "Cài đặt hệ thống",
        path: "",
      },
      {
        title: "Quản lý tài khoản",
        path: "/taikhoan",
      },
    ],
  },
] as { path: string; data: stateModel[] }[];

export const DefaultLayout = (props: DefaultLayoutProps) => {
  const state = useSelector((state: RootState) => state.breadcrumb.value);
  const accountInfo = useSelector(
    (state: RootState) => state.account.accountLogin
  );

  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const location = useLocation();

  const [notificationClick, setNotificationClick] = useState<boolean>(false);
  const [openSetting, setOpenSetting] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getAllRole());
    dispatch(getAllServices());
    dispatch(getAllDevices());
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

  const handleClickNotification = () => {
    setNotificationClick(!notificationClick);
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

  const getLocation = useCallback(async () => {
    const getIdUserLogin = await getCookie("isLogin");
    const urlPathName = location.pathname;
    breadcrumbData.forEach((item) => {
      if (item.path === urlPathName) {
        return dispatch(changeValue(item.data));
      }
    });

    if (
      urlPathName === "/capso" &&
      getIdUserLogin === null &&
      getIdUserLogin === undefined
    ) {
      dispatch(addValue({ title: "Cấp số mới", path: "" }));
      return navigate("/capso");
    }
  }, [location.pathname, dispatch, navigate]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

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
        <div className={styles.topBar}>
          {state.length === 0 ? (
            <p>Thông tin cá nhân</p>
          ) : (
            <ul className={styles.breadcrumb}>
              {state.map((item) => {
                return (
                  <li key={item.title}>
                    {item.path ? (
                      <a href={accountInfo.id !== "" ? item.path : ""}>
                        {item.title}
                      </a>
                    ) : (
                      <p>{item.title}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {accountInfo.id !== "" && (
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
                      accountInfo.avatar === ""
                        ? AvatarTest
                        : accountInfo.avatar
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
          )}
        </div>

        {props.children}
      </div>
    </div>
  );
};
