import { t } from "i18next";
import { useCallback, useState, useEffect } from "react";

import login_bg from "@/assets/images/login/login_bg.png";
import WindowControlBar from "@/components/WindowControlBar";
import { getLoginMethod, setLoginMethod as saveLoginMethod } from "@/utils/storage";

import ConfigModal from "./ConfigModal";
import styles from "./index.module.scss";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { Spin } from "antd";
import axios from "axios";
import { getEnterPriseUrl } from "@/config";
import { message } from "@/AntdGlobalComp";
import {
  setAreaCode,
  setEmail,
  setIMProfile,
  setPhoneNumber,
} from "@/utils/storage";
import md5 from "md5";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "@/api/login";

export type FormType = 0 | 2;

export const Login = () => {
  const [isLoading, setIsLoading] = useState(true);
  // 0login 2register
  const [formType, setFormType] = useState<FormType>(0);
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">(getLoginMethod());

  const updateLoginMethod = useCallback((method: "phone" | "email") => {
    setLoginMethod(method);
    saveLoginMethod(method);
  }, []);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const djt_token = query.get("djt_token")?.toString();
  const userid = query.get("userid")?.toString();
  const touserid = query.get("touserid")?.toString();
  const handle = query.get("handle")?.toString();
  localStorage.setItem("djthandle", handle!);

  useEffect(() => {
    //用户验证
    iMUserVerify(djt_token);

    return () => {
      // 如果需要清理副作用，可以返回一个函数
    };
  }, []); // 空依赖数组表示只在组件加载时执行一次

  const iMUserVerify = async (djt_token: any) => {
    const areaCode = "+86";
    const password = "gch123";
    const phoneNumber = userid;
    const account = djt_token;
    const verifyCode = touserid!;
    const loginParams: API.Login.LoginParams = {
      areaCode,
      password,
      phoneNumber,
      verifyCode,
      account,
    };
    debugger
    onFinish(loginParams);
  };

  const navigate = useNavigate();
  // const [form] = Form.useForm();
  const { mutate: login } = useLogin();

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

  return (
    <Spin className="!max-h-none" spinning={isLoading} tip={"会话加载中..."}>
      <div className="relative flex h-full flex-col">
        <div className="app-drag relative h-10 bg-[var(--djt-white)]">
          <WindowControlBar />
        </div>
        {/* <div className="flex flex-1 items-center justify-center">
          <LeftBar />
          <div
            className={`${styles.login} mr-14 h-[450px] w-[350px] rounded-md p-11`}
            style={{ boxShadow: "0 0 30px rgba(0,0,0,.1)" }}
          >
            {formType === 0 && (
              <LoginForm
                setFormType={setFormType}
                loginMethod={loginMethod}
                updateLoginMethod={updateLoginMethod}
                djt_token={djt_token}
                touserid={touserid}
                setIsLoading={setIsLoading}
              />
            )}
            {formType === 2 && (
              <RegisterForm loginMethod={loginMethod} setFormType={setFormType} />
            )}
          </div>
        </div> */}
      </div>
    </Spin>
  );
};

const LeftBar = () => {
  const [configVisible, setConfigVisible] = useState<boolean>(false);
  const closeConfigModal = useCallback(() => setConfigVisible(false), []);

  return (
    <div className="flex min-h-[420]">
      <div className="mr-14 text-center">
        <div className="text-2xl" >
          {t("placeholder.title")}
        </div>
        <span className="text-sm  text-gray-400">{t("placeholder.subTitle")}</span>
        <img src={login_bg} alt="login_bg" />
      </div>
      <ConfigModal visible={configVisible} close={closeConfigModal} />
    </div>
  );
};
