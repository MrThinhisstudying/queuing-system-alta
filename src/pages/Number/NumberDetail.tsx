import React from "react";
import styles from "./NumberDetail.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { removeLastItemBreadScrumb } from "../../utils";
import { changeValue } from "../../store/reducers/breadcrumbSlice";
import { ButtonBack } from "../../components/ButtonBack";

export const NumberDetail = () => {
  const breadcrumbState = useSelector(
    (state: RootState) => state.breadcrumb.value
  );
  const numberLevelState = useSelector(
    (state: RootState) => state.numberLevel.numberLevel
  );
  const dispatch = useDispatch<any>();

  const handleBack = () => {
    const res = removeLastItemBreadScrumb(breadcrumbState);
    dispatch(changeValue(res.newArray));
  };

  return (
    <div className={styles.detailContainer}>
      <div>
        <p>Thông tin cấp số</p>
        <div className={styles.body}>
          <div>
            <div>
              <p>Họ tên:</p>
              <p>{numberLevelState.customer}</p>
            </div>

            <div>
              <p>Nguồn cấp:</p>
              <p>{numberLevelState.device}</p>
            </div>

            <div>
              <p>Tên dịch vụ:</p>
              <p>{numberLevelState.service}</p>
            </div>

            <div>
              <p>Trang thái:</p>
              <p>{numberLevelState.status}</p>
            </div>

            <div>
              <p>Số thứ tự:</p>
              <p>{numberLevelState.stt}</p>
            </div>

            <div>
              <p>Số điện thoại:</p>
              <p>{numberLevelState.phone}</p>
            </div>

            <div>
              <p>Thời gian cấp:</p>
              <p>{numberLevelState.timeuse}</p>
            </div>

            <div>
              <p>Địa chỉ Email:</p>
              <p>{numberLevelState.email}</p>
            </div>

            <div>
              <p>Hạn sử dụng:</p>
              <p>{numberLevelState.timeexpire}</p>
            </div>
          </div>
        </div>
      </div>
      <ButtonBack onClick={() => handleBack()} />
    </div>
  );
};
