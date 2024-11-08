import { Button, Form, Input, QRCode, Select, Space, Tabs } from "antd";
import { t } from "i18next";
import md5 from "md5";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useLogin, useSendSms } from "@/api/login";
import login_pc from "@/assets/images/login/login_pc.png";
import login_qr from "@/assets/images/login/login_qr.png";
import {
  getEmail,
  getPhoneNumber,
  setAreaCode,
  setEmail,
  setIMProfile,
  setPhoneNumber,
} from "@/utils/storage";

import { areaCode } from "./areaCode";
import type { FormType } from "./index";
import styles from "./index.module.scss";
import axios from "axios";
import { getEnterPriseUrl } from "@/config";
import { message } from "@/AntdGlobalComp";

// 0login 1resetPassword 2register
enum LoginType {
  Password,
  VerifyCode,
}

type LoginFormProps = {
  setFormType: (type: FormType) => void;
  loginMethod: "phone" | "email";
  updateLoginMethod: (method: "phone" | "email") => void;
  djt_token?: string;
  touserid?: string;
  setIsLoading: (vid: boolean) => void;
};

const LoginForm = ({
  loginMethod,
  setFormType,
  updateLoginMethod,
  djt_token,
  touserid,
  setIsLoading,
}: LoginFormProps) => {
  useEffect(() => {
    // 组件加载完成后执行的事件
    console.log("组件加载完成");

    //用户验证
    iMUserVerify(djt_token);

    // 如果需要清理副作用，可以返回一个函数
    return () => {
      console.log("组件卸载或更新前的清理");
    };
  }, []); // 空依赖数组表示只在组件加载时执行一次

  const iMUserVerify = async (djt_token: any) => {
    const response = await axios.get(
      getEnterPriseUrl() + "/api/Enterprise/IMUserVerify?touserid=" + touserid,
      {
        headers: {
          Authorization: "Bearer " + djt_token,
        },
      },
    );

    if (response.data.status == 1000) {
      debugger;
      const areaCode = "+86";
      const password = "gch123";
      const phoneNumber = response.data.data;
      const verifyCode = "";
      const loginParams: API.Login.LoginParams = {
        areaCode,
        password,
        phoneNumber,
        verifyCode,
      };
      onFinish(loginParams);
    } else {
      message.warning("会话已失效，请重新登录");
    }
  };
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { mutate: login, isLoading: loginLoading } = useLogin();

  const onFinish = (params: API.Login.LoginParams) => {
    if (params.phoneNumber) {
      setAreaCode(params.areaCode);
      setPhoneNumber(params.phoneNumber);
    }
    if (params.email) {
      setEmail(params.email);
    }
    params.password = md5(params.password);
    login(params, {
      onSuccess: (data) => {
        const { chatToken, imToken, userID } = data.data;
        setIMProfile({ chatToken, imToken, userID });
        navigate("/chat?touserid=" + touserid);
        setIsLoading(false);
      },
    });
  };

  const onLoginMethodChange = (key: string) => {
    updateLoginMethod(key as "phone" | "email");
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div className="text-xl font-medium">{t("placeholder.welcome")}</div>
      </div>
      <Tabs
        className={styles["login-method-tab"]}
        activeKey={loginMethod}
        items={[
          { key: "phone", label: t("placeholder.phoneNumber") },
          { key: "email", label: t("placeholder.email") },
        ]}
        onChange={onLoginMethodChange}
      />
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        labelCol={{ prefixCls: "custom-form-item" }}
        initialValues={{
          areaCode: "+86",
          phoneNumber: getPhoneNumber() ?? "",
          email: getEmail() ?? "",
        }}
      >
        {loginMethod === "phone" ? (
          <Form.Item label={t("placeholder.phoneNumber")}>
            <Space.Compact className="w-full">
              <Form.Item name="areaCode" noStyle>
                <Select options={areaCode} className="!w-28" />
              </Form.Item>
              <Form.Item name="phoneNumber" noStyle>
                <Input allowClear placeholder={t("toast.inputPhoneNumber")} />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
        ) : (
          <Form.Item
            label={t("placeholder.email")}
            name="email"
            rules={[{ type: "email", message: t("toast.inputCorrectEmail") }]}
          >
            <Input allowClear placeholder={t("toast.inputEmail")} />
          </Form.Item>
        )}

        <Form.Item label={t("placeholder.password")} name="password">
          <Input.Password allowClear placeholder={t("toast.inputPassword")} />
        </Form.Item>

        <Form.Item className="mb-4">
          <Button type="primary" htmlType="submit" block loading={loginLoading}>
            {t("placeholder.login")}
          </Button>
        </Form.Item>

        {/* <div className="flex flex-row items-center justify-center">
          <span className="text-sm text-gray-400">
            {t("placeholder.registerToast")}
          </span>
          <span
            className="cursor-pointer text-sm text-blue-500"
            onClick={() => setFormType(2)}
          >
            {t("placeholder.toRegister")}
          </span>
        </div> */}
      </Form>
    </>
  );
};

export default LoginForm;
