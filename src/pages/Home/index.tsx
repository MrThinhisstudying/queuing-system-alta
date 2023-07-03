import React from "react";
import styles from "./home.module.css";
import AvatarTest from "../../assets/images/avatar_test.svg";
import ChangeAvatarIcon from "../../assets/images/ChangeAvatarIcon.svg";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "../../config/firebase/storage";
import { updateAccount } from "../../store/reducers/accountSlice";
import { account } from "../../types";
import { InputTypeDisable } from "../../components/InputTypeDisable";

export const Home = () => {
  const accountInfo = useSelector(
    (state: RootState) => state.account.accountLogin
  );
  const dispatch = useDispatch<any>();

  const handleChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files === null || e.target.files?.length === 0) return;
      const file: File = e.target.files[0];
      const res = await uploadImage(file);
      if (res === false) return;
      let info: account = {
        id: "",
        email: "",
        fullname: "",
        password: "",
        phone: "",
        role: "",
        status: "",
        username: "",
        avatar: "",
      };
      info = { ...accountInfo, avatar: res.toString() };
      dispatch(updateAccount(info));
    } catch (error) {
      console.log("Error: ", error);
    }
    // setAvatarPreview(URL.createObjectURL(file));
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <div>
          <img
            className={styles.avatar}
            src={accountInfo.avatar === "" ? AvatarTest : accountInfo.avatar}
            alt="avatar"
          />
          <label htmlFor="icon-button-file">
            <input
              onChange={(e) => {
                handleChangeAvatar(e);
              }}
              accept="image/*"
              id="icon-button-file"
              type="file"
            />
            <img
              className={styles.changeBtn}
              src={ChangeAvatarIcon}
              alt="button"
            />
          </label>
        </div>
        <p>{accountInfo.fullname}</p>
      </div>

      <div className={styles.rightSide}>
        <div>
          <label>Tên người dùng</label>
          <InputTypeDisable value={accountInfo.fullname} />
        </div>

        <div>
          <label>Tên đăng nhập</label>
          <InputTypeDisable value={accountInfo.username} />
        </div>

        <div>
          <label>Số điện thoại</label>
          <InputTypeDisable value={accountInfo.phone} />
        </div>

        <div>
          <label>Mật khẩu</label>
          <InputTypeDisable value={accountInfo.password} />
        </div>

        <div>
          <label>Email:</label>
          <InputTypeDisable value={accountInfo.email} />
        </div>

        <div>
          <label>Vai trò:</label>
          <InputTypeDisable value={accountInfo.role} />
        </div>
      </div>
    </div>
  );
};
