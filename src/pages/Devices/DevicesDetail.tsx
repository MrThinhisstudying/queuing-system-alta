import React from "react";
import styles from "./DevicesDetail.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { changeValue } from "../../store/reducers/breadcrumbSlice";
import { ButtonAdd } from "../../components/ButtonAdd";

export const DevicesDetail = () => {
  const deviceState = useSelector((state: RootState) => state.device.device);
  const breadcrumbState = useSelector(
    (state: RootState) => state.breadcrumb.value
  );
  const dispatch = useDispatch();

  const handleUpdate = () => {
    const changeArray = breadcrumbState.filter((item) => {
      return item.title.includes("Chi tiết thiết bị") === false;
    }) as { title: string; path: string }[];
    changeArray.push({ title: "Cập nhật thiết bị", path: "" });
    dispatch(changeValue(changeArray));
  };

  return (
    <div className={styles.frame}>
      <div className={styles.detailContainer}>
        <h3>Chi tiết thiết bị</h3>
        <div className={styles.body}>
          <div className={styles.row}>
            <p>Mã thiết bị:</p>
            <p>{deviceState.deviceCode}</p>
          </div>

          <div className={styles.row}>
            <p>Loại thiết bị:</p>
            <p>{deviceState.deviceType}</p>
          </div>

          <div className={styles.row}>
            <p>Tên thiết bị:</p>
            <p>{deviceState.deviceName}</p>
          </div>

          <div className={styles.row}>
            <p>Tên đăng nhập:</p>
            <p>{deviceState.username}</p>
          </div>

          <div className={styles.row}>
            <p>Địa chỉ IP:</p>
            <p>{deviceState.deviceIP}</p>
          </div>

          <div className={styles.row}>
            <p>Mật khẩu:</p>
            <p>{deviceState.password}</p>
          </div>
        </div>

        <div className={styles.service}>
          <p>Dịch vụ sử dụng:</p>
          <p>{deviceState.deviceUse}.</p>
        </div>
      </div>

      <ButtonAdd text="Cập nhật thiết bị" onClick={() => handleUpdate()} />
    </div>
  );
};
