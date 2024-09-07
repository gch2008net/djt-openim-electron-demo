import { t } from "i18next";
import { useCallback, useState } from "react";

import login_bg from "@/assets/images/login/login_bg.png";
import WindowControlBar from "@/components/WindowControlBar";
import { getLoginMethod, setLoginMethod as saveLoginMethod } from "@/utils/storage";

import ConfigModal from "./ConfigModal";
import styles from "./index.module.scss";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useLocation } from "react-router-dom";

export type FormType = 0 | 2;

export const Login = () => {
  // 0login 2register
  const [formType, setFormType] = useState<FormType>(0);
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">(getLoginMethod());

  const updateLoginMethod = useCallback((method: "phone" | "email") => {
    setLoginMethod(method);
    saveLoginMethod(method);
  }, []);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  var djt_token = query.get("djt_token")?.toString();
  var touserid = query.get("touserid")?.toString();

  return (
    <div className="relative flex h-full flex-col">
      <div className="app-drag relative h-10 bg-[var(--djt-primary-color)]">
        <WindowControlBar />
      </div>
      <div className="flex flex-1 items-center justify-center">
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
            />
          )}
          {formType === 2 && (
            <RegisterForm loginMethod={loginMethod} setFormType={setFormType} />
          )}
        </div>
      </div>
    </div>
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
