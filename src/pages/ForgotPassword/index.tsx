import React, { useState } from "react";
import styles from "./forgotPassword.module.css";
import LogoAlta from "../../assets/images/Logo_alta.svg";
import ForgotPassBackground from "../../assets/images/ForgotPassBackground.svg";
import { useNavigate } from "react-router-dom";
import {
  getAllDataInColection,
  getDocumentWithId,
  updateData,
} from "../../config/firebase/firestore";
import { account } from "../../types";
import { Input } from "../../components/Input";
import { ButtonOutline } from "../../components/ButtonOutline";
import { Button } from "../../components/Button";
import { PasswordInput } from "../../components/PasswordInput";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [inputPassword, setInputPassword] = useState<string | null>();
  const [error, setError] = useState<boolean>(true);
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState({
    newPass: "",
    newPassAgain: "",
  });

  const handleClickButton = async () => {
    if (inputPassword === undefined || !inputPassword?.includes("@"))
      return setError(false);
    let idAccount: string = "";
    const res = await getAllDataInColection("accounts");
    res.forEach((item: account) => {
      if (item.email === inputPassword) {
        return (idAccount = item.id);
      }
      return;
    });
    if (idAccount === "") return setError(false);
    setError(true);
    localStorage.setItem("ChangePassword", idAccount);
    return setChangePassword(true);
  };

  const handleChangePassword = async () => {
    if (newPassword.newPass === "" || newPassword.newPassAgain === "")
      return setError(false);
    if (newPassword.newPass !== newPassword.newPassAgain)
      return setError(false);
    const id = localStorage.getItem("ChangePassword");
    if (id === null) return setChangePassword(false);
    const account: account = await getDocumentWithId(id, "accounts");
    account.password = newPassword.newPass;
    const res = await updateData(account, "accounts");
    if (res === null) return setError(false);
    setError(true);
    localStorage.removeItem("ChangePassword");
    return navigate("/");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <img src={LogoAlta} alt="logo" />
          {changePassword !== true ? (
            <>
              <h1>Đặt lại mật khẩu</h1>
              <p>Vui lòng nhập email để đặt lại mật khẩu của bạn *</p>
              <Input
                status={error}
                placeholder=""
                value=""
                handleChange={(e) => setInputPassword(e.target.value)}
              />

              <div className={styles.btn}>
                <ButtonOutline
                  text="Hủy"
                  handleClick={() => {
                    return navigate("/");
                  }}
                />

                <Button text="Tiếp tục" handleClick={handleClickButton} />
              </div>
            </>
          ) : (
            <>
              <h1>Đặt lại mật khẩu mới</h1>
              <div>
                <label>Mật khẩu</label>
                <PasswordInput
                  status={error}
                  value=""
                  handleChange={(e) =>
                    setNewPassword({ ...newPassword, newPass: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Nhập lại mật khẩu</label>
                <PasswordInput
                  status={error}
                  value=""
                  handleChange={(e) =>
                    setNewPassword({
                      ...newPassword,
                      newPassAgain: e.target.value,
                    })
                  }
                />
              </div>

              <Button
                text="Xác nhận"
                handleClick={() => handleChangePassword()}
              />
            </>
          )}
        </div>

        <div className={styles.rightSide}>
          <img src={ForgotPassBackground} alt="background" />
        </div>
      </div>
    </div>
  );
};
