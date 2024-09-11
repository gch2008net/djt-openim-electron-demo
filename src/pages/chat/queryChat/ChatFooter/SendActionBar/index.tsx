import { MessageItem } from "@openim/wasm-client-sdk/lib/types/entity";
import { Popover, PopoverProps, Upload } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";
import clsx from "clsx";
import i18n, { t } from "i18next";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { memo, ReactNode, useCallback, useState ,useEffect} from "react";
import React from "react";

import { message as antdMessage } from "@/AntdGlobalComp";
import emoji from "@/assets/images/chatFooter/emoji.png";
import image from "@/assets/images/chatFooter/image.png";
import rtc from "@/assets/images/chatFooter/rtc.png";
import video from "@/assets/images/chatFooter/video.png";
import { EmojiData } from "@/components/CKEditor";

import { SendMessageParams } from "../useSendMessage";
import CallPopContent from "./CallPopContent";
import EmojiPopContent from "./EmojiPopContent";
import styles from "./index.module.scss";
import axios from 'axios';
import {
  getIMUserID,
} from "@/utils/storage";
import { IMSDK } from "@/layout/MainContentWrap";
import { getEnterPriseUrl } from "@/config";
import { useConversationStore, useUserStore } from "@/store";
import { message } from "@/AntdGlobalComp";
import { Spin } from "antd";

const sendActionList = [
  {
    title: t("placeholder.emoji"),
    icon: emoji,
    key: "emoji",
    accept: undefined,
    comp: <EmojiPopContent />,
    placement: "topLeft",
  },
  {
    title: t("placeholder.image"),
    icon: image,
    key: "image",
    accept: "image/*",
    comp: null,
    placement: undefined,
  },
  {
    title: t("placeholder.video"),
    icon: video,
    key: "video",
    accept: ".mp4",
    comp: null,
    placement: undefined,
  },
  {
    title: t("placeholder.call"),
    icon: rtc,
    key: "rtc",
    accept: undefined,
    comp: <CallPopContent />,
    placement: "top",
  },
];

var userInfo = {
  "nickName": "",
  "headPath": "",
};

i18n.on("languageChanged", () => {
  sendActionList[0].title = t("placeholder.emoji");
  sendActionList[1].title = t("placeholder.image");
  sendActionList[2].title = t("placeholder.video");
  sendActionList[3].title = t("placeholder.call");
});

const SendActionBar = ({
  sendEmoji,
  sendMessage,
  createImageOrVideoMessage,
}: {
  sendEmoji: (emoji: EmojiData) => void;
  sendMessage: (params: SendMessageParams) => Promise<void>;
  createImageOrVideoMessage: (file: File) => Promise<MessageItem>;
}) => {
  const [visibleState, setVisibleState] = useState({
    rtc: false,
    emoji: false,
  });

  const [showProfile, setShowProfile] = useState(false);

  const closeAllPop = useCallback(
    () => setVisibleState({ rtc: false, emoji: false }),
    [],
  );

  const currentConversation = useConversationStore(
    (state) => state.currentConversation,
  );

  const fileHandle = async (options: UploadRequestOption) => {
    const fileEl = options.file as File;
    if (fileEl.size === 0) {
      antdMessage.warning(t("empty.fileContentEmpty"));
      return;
    }
    const message = await createImageOrVideoMessage(fileEl);
    sendMessage({
      message,
    });
  };

  //发职位
  const sendCardMessage = async (action: any) => {
    let obj = {
      ID: action.id,
      PostType: action.jobType,
      PostName: action.postName,
      Payroll: action.payroll,
      CompanyName: userInfo.nickName,
      CompanyUrl: userInfo.headPath,
    };
    const { data: message } = await IMSDK.createCustomMessage({
      data: JSON.stringify(obj),
      extension: "position_msg",
      description: "[职位消息]",
    });
    sendMessage({ message });
    setShowProfile(false);
  }

  const handleClick = () => {
    window.open(getEnterPriseUrl()+'/#/search/index?userid='+currentConversation?.userID, '_blank');
  };

  return (
    <div className="flex items-center px-4.5 pt-2">
      {sendActionList.map((action) => {
        const popProps: PopoverProps = {
          placement: action.placement as TooltipPlacement,
          content:
            action.comp &&
            React.cloneElement(action.comp as React.ReactElement, {
              sendEmoji,
              closeAllPop,
            }),
          title: null,
          arrow: false,
          trigger: "click",
          // @ts-ignore
          open: action.key ? visibleState[action.key] : false,
          onOpenChange: (visible) =>
            setVisibleState((state) => {
              const tmpState = { ...state };
              // @ts-ignore
              tmpState[action.key] = visible;
              return tmpState;
            }),
        };

        return (
          <ActionWrap
            popProps={popProps}
            key={action.key}
            accept={action.accept}
            fileHandle={fileHandle}
          >
            <div
              className={clsx("flex cursor-pointer items-center last:mr-0", {
                "mr-5": !action.accept,
              })}
            >
              <img src={action.icon} width={20} alt={action.title} />
            </div>
          </ActionWrap>
        );
      })}
      <div className={styles.btns} >
        <div ><span onClick={handleClick}>查看简历</span></div>
        <div >
          <Popover
            content={ProfileContent({ sendCardMessage })}
            trigger="click"
            placement="rightBottom"
            overlayClassName="profile-popover"
            title={null}
            arrow={false}
            open={showProfile}
            onOpenChange={(vis) => setShowProfile(vis)}
          >
            <span>发送职位</span>
          </Popover>
        </div>
        <div ><span onClick={handleClick}>邀请面试</span></div>
      </div>
    </div>
  );
};

export default memo(SendActionBar);

const ActionWrap = ({
  accept,
  popProps,
  children,
  fileHandle,
}: {
  accept?: string;
  children: ReactNode;
  popProps?: PopoverProps;
  fileHandle: (options: UploadRequestOption) => void;
}) => {
  return accept ? (
    <Upload
      showUploadList={false}
      customRequest={fileHandle}
      accept={accept}
      multiple
      className="mr-5 flex"
    >
      {children}
    </Upload>
  ) : (
    <Popover {...popProps}>{children}</Popover>
  );
};

const ProfileContent = ({
  sendCardMessage,
}: {
  sendCardMessage: (params: {}) => {};
}) => {

  const [positionList, setPositionList] = useState([
    {
      "id": 0,
      "postName": "",
      "postCity": "",
      "experienceYear": "",
      "academicRequirements": "",
      "payroll": "",
      "serviceCode": "1001",
      "noReadCount": 0,
      "interviewCount": 0,
      "candidateCount": 0,
      "postStatus": "1",
      "deadline": "",
      "modiDateTime": "",
      "jobType": "",
  
    }
  ]);
  
  const [isLoading, setIsLoading]  = useState(true);

  useEffect(() => {
    // 组件加载完成后执行的事件
    console.log("组件加载完成");

    // setTimeout(() => {
      
    // }, 5000);
    
    getPostionList();

    // 如果需要清理副作用，可以返回一个函数
    return () => {
      console.log("组件卸载或更新前的清理");
    };
  }, []); // 空依赖数组表示只在组件加载时执行一次

  const getPostionList = async () => {
    var IMUserID = await getIMUserID();
    if (IMUserID == undefined || IMUserID == "") {
      IMUserID = localStorage.getItem("IM_PHONE_NUM");
    }
    const response = await axios.get(getEnterPriseUrl() + '/api/Enterprise/PositionManagementList?postStatus=1&key=&pageNo=1&pageSize=100&userId=' + IMUserID);
    if (response.data.status == 1000) {
      setPositionList(response.data.data.datas);
      userInfo.nickName = response.data.data.nickName;
      userInfo.headPath = response.data.data.headPath;
      setIsLoading(false);
    }
  }

  return (
    <Spin className="!max-h-none" spinning={isLoading} tip={"职位加载中，请稍等..."}>
      <div className={styles.profilebox}>
        <div className={styles.title} >发送职位</div>
        <div className={styles.positionWrap}>
          {positionList.map((action) => {
            return (
              <div className={styles.box} onClick={() => sendCardMessage(action)}>
                <div className={clsx(styles.top, styles.flex)} >
                  <div className={styles.postName} >{action.postName}</div>
                  <div className={styles.payroll} >{action.payroll}</div>
                </div>
                <div className={clsx(styles.bottom, styles.flex)} >
                  <div className={styles.que} >
                    <span>{action.postCity}</span>|<span>{action.academicRequirements}</span>|<span>{action.experienceYear}</span>
                  </div>
                  <div className={styles.time}>{action.deadline}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Spin>
  );
};



