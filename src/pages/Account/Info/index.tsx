import React, { useCallback, useEffect, useState } from "react";
import styles from "./info.module.css";
import { removeLastItemBreadScrumb } from "../../../utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { changeValue } from "../../../store/reducers/breadcrumbSlice";
import { account } from "../../../types";
import {
  clearAccount,
  updateAccounts,
} from "../../../store/reducers/accountSlice";
import {
  addData,
  updateData,
  updateNumberUseInRole,
} from "../../../config/firebase/firestore";
import { Input } from "../../../components/Input";
import { PasswordInput } from "../../../components/PasswordInput";
import { Dropdown } from "../../../components/Dropdown";
import { ButtonOutline } from "../../../components/ButtonOutline";
import { Button } from "../../../components/Button";

type InfoProps = {
  data: account | null;
};

export const Info = (props: InfoProps) => {
  const breadcrumbState = useSelector(
    (state: RootState) => state.breadcrumb.value
  );
  const accountsState = useSelector(
    (state: RootState) => state.account.accounts
  );
  const accountState = useSelector((state: RootState) => state.account.account);
  const rolesState = useSelector((state: RootState) => state.role.roles);

  const dispatch = useDispatch<any>();
  const [passwordAgain, setPasswordAgain] = useState<string>("");
  const [accountForm, setAccountForm] = useState<account>({
    id: "",
    email: "",
    fullname: "",
    password: "",
    phone: "",
    role: "",
    status: "",
    username: "",
    avatar: "",
  });

  useEffect(() => {
    if (props.data !== null) {
      setPasswordAgain(props.data.password);
      return setAccountForm(props.data);
    }
  }, [props.data]);

  const getNameRoles = useCallback(() => {
    let rolesName: string[] = [];
    rolesState.map((item) => {
      return rolesName.push(item.roleName);
    });
    return rolesName.sort();
  }, [rolesState]);

  const handleInputAgainPassword = (value: string) => {
    return setPasswordAgain(value);
  };

  const handleChangeAccountForm = (type: string, value: string) => {
    setAccountForm({ ...accountForm, [type]: value });
  };

  const handleDisplayText = () => {
    const value = removeLastItemBreadScrumb(breadcrumbState);
    if (value.lastItem.title.includes("Thêm tài khoản")) return "Thêm";
    if (value.lastItem.title.includes("Cập nhật tài khoản")) return "Cập nhật";
  };

  const checkValueBeforeSubmit = () => {
    let errors: string[] = [];
    if (accountForm.fullname === "") errors.push("errorFullname");
    if (accountForm.username === "") errors.push("errorUsername");
    if (accountForm.phone === "") errors.push("errorPhone");
    if (accountForm.password === "") errors.push("errorPassword");
    if (accountForm.email === "") errors.push("errorEmail");
    if (accountForm.password !== passwordAgain || passwordAgain === "")
      errors.push("errorPasswordInputAgain");
    if (accountForm.role === "") errors.push("errorRole");
    if (accountForm.status === "") errors.push("errorStatus");
    if (errors.length === 0) return { status: true, error: errors };
    return { status: false, error: errors };
  };

  const handleCancel = () => {
    const value = removeLastItemBreadScrumb(breadcrumbState);
    if (value.lastItem.title.includes("Cập nhật tài khoản")) {
      dispatch(clearAccount(""));
    }
    dispatch(changeValue(value.newArray));
  };

  const handleAddOrUpdate = async () => {
    const checkError = checkValueBeforeSubmit();

    if (checkError.error.length > 0) {
      checkError.error.forEach((item) => {
        if (item.includes("errorPasswordInputAgain"))
          return window.alert("Mật khẩu và nhập lại mật khẩu không trùng khớp");
      });
      return window.alert(
        "Đã xảy ra lỗi vui lòng kiểm tra lại xem đã nhập đầy đủ thông tin"
      );
    }
    if (checkError.status) {
      const value = removeLastItemBreadScrumb(breadcrumbState);
      if (value.lastItem.title.includes("Cập nhật tài khoản")) {
        const res = await updateData(accountForm, "accounts");
        if (res === null) return;
        const newUpdateAccounts: account[] = [];

        accountsState.forEach((item) => {
          if (item.id.includes(accountForm.id)) {
            item = accountForm;
          }
          newUpdateAccounts.push(item);
        });

        await updateNumberUseInRole(accountState.role, accountForm.role);
        dispatch(updateAccounts(newUpdateAccounts));
        dispatch(changeValue(value.newArray));
      }
      if (value.lastItem.title.includes("Thêm tài khoản")) {
        const res = await addData(accountForm, "accounts");
        if (res.status === false) return;
        const newAccountsState = [...accountsState, res.data];
        dispatch(updateAccounts(newAccountsState));
        dispatch(changeValue(value.newArray));
      }
    }
  };

  return (
    <React.Fragment>
      <div className={styles.infoContainer}>
        <h3>Thông tin tài khoản</h3>

        <div>
          <div className={styles.input}>
            <p>
              Họ tên <span>*</span>
            </p>
            <Input
              value={accountForm.fullname !== "" ? accountForm.fullname : ""}
              placeholder="Họ tên"
              handleChange={(e) =>
                handleChangeAccountForm("fullname", e.target.value)
              }
              status={true}
            />
          </div>

          <div className={styles.input}>
            <p>
              Tên đăng nhập <span>*</span>
            </p>
            <Input
              value={accountForm.username !== "" ? accountForm.username : ""}
              placeholder="Họ tên"
              handleChange={(e) =>
                handleChangeAccountForm("username", e.target.value)
              }
              status={true}
            />
          </div>

          <div className={styles.input}>
            <p>
              Số điện thoại <span>*</span>
            </p>
            <Input
              value={accountForm.phone !== null ? accountForm.phone : ""}
              placeholder="Số điện thoại"
              handleChange={(e) =>
                handleChangeAccountForm("phone", e.target.value)
              }
              status={true}
            />
          </div>

          <div className={styles.input}>
            <p>
              Mật khẩu <span>*</span>
            </p>
            <PasswordInput
              status={true}
              value={accountForm.password !== null ? accountForm.password : ""}
              handleChange={(e) =>
                handleChangeAccountForm("password", e.target.value)
              }
            />
          </div>

          <div className={styles.input}>
            <p>
              Email <span>*</span>
            </p>
            <Input
              value={accountForm.email !== null ? accountForm.email : ""}
              placeholder="Email"
              handleChange={(e) =>
                handleChangeAccountForm("email", e.target.value)
              }
              status={true}
            />
          </div>

          <div className={styles.input}>
            <p>
              Nhập lại mật khẩu <span>*</span>
            </p>
            <PasswordInput
              status={true}
              value={passwordAgain}
              handleChange={(e) => handleInputAgainPassword(e.target.value)}
            />
          </div>

          <div className={styles.input}>
            <p>
              Vai trò <span>*</span>
            </p>
            <Dropdown
              data={getNameRoles()}
              setWidth="300"
              text=""
              value={accountForm.role !== null ? accountForm.role : ""}
              onClick={(value) => handleChangeAccountForm("role", value)}
            />
          </div>

          <div className={styles.input}>
            <p>
              Tình trạng <span>*</span>
            </p>
            <Dropdown
              data={["Tất cả", "Ngưng hoạt động", "Hoạt động"]}
              setWidth="300"
              text="Tất cả"
              value={accountForm.status !== null ? accountForm.status : ""}
              onClick={(value) => handleChangeAccountForm("status", value)}
            />
          </div>
        </div>
        <p>
          <span>*</span> Là trường thông tin bắt buộc
        </p>
      </div>

      <div className={styles.listbtn}>
        <ButtonOutline text="Hủy bỏ" handleClick={() => handleCancel()} />

        <Button
          text={handleDisplayText()}
          handleClick={() => handleAddOrUpdate()}
        />
      </div>
    </React.Fragment>
  );
};
