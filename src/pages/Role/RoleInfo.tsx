import React, { useEffect, useState } from "react";
import styles from "./RoleInfo.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { changeValue } from "../../store/reducers/breadcrumbSlice";
import { role } from "../../types";
import { addData, updateData } from "../../config/firebase/firestore";
import {
  addRoles,
  clearRole,
  updateRoles,
} from "../../store/reducers/roleSlice";
import { Input } from "../../components/Input";
import { CheckBox } from "../../components/CheckBox";
import { ButtonOutline } from "../../components/ButtonOutline";
import { Button } from "../../components/Button";

const featuresGroupA = ["Tất cả", "Chức năng x", "Chức năng y", "Chức năng z"];
const featuresGroupB = ["Tất cả", "Chức năng x", "Chức năng y", "Chức năng z"];

export const RoleInfo = () => {
  const breadcrumbSate = useSelector(
    (state: RootState) => state.breadcrumb.value
  );
  const rolesState = useSelector((state: RootState) => state.role.roles);
  const roleState = useSelector((state: RootState) => state.role.role);
  const dispatch = useDispatch<any>();

  const [role, setRole] = useState<role>({
    id: "",
    description: "",
    roleName: "",
    numberPeopleUse: 0,
    features: [],
  });

  useEffect(() => {
    setRole(roleState);
  }, [roleState]);

  const handleCancel = () => {
    const data = breadcrumbSate.filter((item) => {
      return item.title !== "Thêm vai trò" && item.title !== "Cập nhật vai trò";
    });
    dispatch(changeValue(data));
    // dispatch(resetDevice(""));
  };

  const getTextButton = () => {
    let text: string = "";
    const getType = breadcrumbSate[breadcrumbSate.length - 1] as {
      title: string;
      path: string;
    };
    if (getType.title.includes("Thêm vai trò")) {
      text = "Thêm vai trò";
    } else {
      text = "Cập nhật";
    }
    return text;
  };

  const checkCheckStatus = (name: string, group: string) => {
    const findExist = role.features.filter((item) => {
      return item.name.match(name) && item.group.match(group);
    });
    if (findExist.length > 0) return true;
    return false;
  };

  const handleChangeInput = (name: string, value: string | any[]) => {
    setRole({ ...role, [name]: value });
  };

  const handleCheck = (value: string, group: string) => {
    const isHaveFeature = role.features.filter((item) => {
      return item.name.match(value) && item.group.match(group);
    });
    if (isHaveFeature.length > 0) {
      const removeAlreadyExistsFeature = role.features.filter((item) => {
        return !item.name.match(value) && !item.group.match(group);
      });
      return handleChangeInput("features", removeAlreadyExistsFeature);
    }
    setRole({
      ...role,
      features: [...role.features, { name: value, group: group }],
    });
  };

  const handleAddOrUpdate = async () => {
    const getType = breadcrumbSate[breadcrumbSate.length - 1] as {
      title: string;
      path: string;
    };
    if (getType.title.match("Thêm vai trò")) {
      const res = await addData(role, "roles");
      if (!res.status) return;
      dispatch(addRoles(role));
    }
    if (getType.title.match("Cập nhật vai trò")) {
      const res = await updateData(role, "roles");
      if (res === null) return;
      const newRoles: role[] = [];

      rolesState.forEach((item: role) => {
        if (item.id.includes(role.id)) {
          item = role;
        }
        newRoles.push(item);
      });
      dispatch(updateRoles(newRoles));
      dispatch(clearRole(""));
    }
    handleCancel();
  };

  return (
    <React.Fragment>
      <div className={styles.info}>
        <h3>Thông tin vai trò</h3>

        <div className={styles.body}>
          <div>
            <div>
              <p>
                Tên vai trò <span>*</span>
              </p>
              <Input
                value={role.roleName !== "" ? role.roleName : ""}
                placeholder="Tên vai trò"
                status={true}
                handleChange={(e) =>
                  handleChangeInput("roleName", e.target.value)
                }
              />
            </div>

            <div className={styles.input}>
              <p>Mô tả:</p>
              <textarea
                name="description"
                id=""
                value={role.description !== "" ? role.description : ""}
                onChange={(e) =>
                  handleChangeInput(e.target.name, e.target.value)
                }
              />
            </div>

            <p>
              <span>*</span> Là trường thông tin bắt buộc
            </p>
          </div>

          <div>
            <p>
              Phần quền chức năng <span>*</span>
            </p>
            <div>
              <div>
                <p>Nhóm chức năng A</p>
                <div>
                  {featuresGroupA.map((item) => (
                    <CheckBox
                      key={item}
                      value={item}
                      checked={checkCheckStatus(item, "A")}
                      onClick={(value) => handleCheck(value, "A")}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p>Nhóm chức năng B</p>
                <div>
                  {featuresGroupB.map((item) => (
                    <CheckBox
                      key={item}
                      value={item}
                      checked={checkCheckStatus(item, "B")}
                      onClick={(value) => handleCheck(value, "B")}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.btn}>
        <ButtonOutline text="Hủy bỏ" handleClick={() => handleCancel()} />

        <Button
          text={getTextButton()}
          handleClick={() => handleAddOrUpdate()}
        />
      </div>
    </React.Fragment>
  );
};
