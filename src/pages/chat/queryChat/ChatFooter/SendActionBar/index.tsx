import { MessageItem } from "@openim/wasm-client-sdk/lib/types/entity";
import { Popover, PopoverProps, Upload } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";
import clsx from "clsx";
import i18n, { t } from "i18next";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { memo, ReactNode, useCallback, useState } from "react";
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
  setPositionInfo,
  getPositionInfo,
  getIMUserID,
} from "@/utils/storage";
import { IMSDK } from "@/layout/MainContentWrap";
import { useSendMessage } from "../useSendMessage";

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

var positionList=[
  {
    "id": 91,
    "postName": "测试谷3",
    "postCity": "广东-深圳-罗湖区 田贝二路76",
    "experienceYear": "在读学生",
    "academicRequirements": "不限",
    "payroll": "1000-4000元/月",
    "serviceCode": "1001",
    "noReadCount": 0,
    "interviewCount": 0,
    "candidateCount": 0,
    "postStatus": "1",
    "deadline": "2024-10-03",
    "modiDateTime": "2024-09-02 17:07:06",
    "jobType": "实习"
}
];

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




 const getPostionList=async (vis:boolean)=>{

  let obj = {
    ID: 1,
    PostType: 1,
    PostName: "职位名称",
    Payroll: "sfsf",
    CompanyName: "userName",
    CompanyUrl: "headPath",
  };

  const { data: message } =await IMSDK.createCustomMessage({
    data: JSON.stringify(obj),
    extension: "position_msg",
    description: "[职位消息]",
  });



   sendMessage({ message });



   debugger
   const IMUserID = await getIMUserID();
   const response = await axios.get('http://enterprise-admin-dev.51djt.net/api/Enterprise/PositionManagementList?postStatus=1&key=&pageNo=1&pageSize=100&userId=' + IMUserID);
   debugger
   positionList = response.data.data.datas;

   setShowProfile(vis);

 }


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
        <div ><span>查看简历</span></div>
        <div >
        <Popover
          content={ProfileContent}
          trigger="click"
          placement="rightBottom"
          overlayClassName="profile-popover"
          title={null}
          arrow={false}
          open={showProfile}
          onOpenChange={(vis) =>getPostionList(vis) }
        >
          <span>发送职位</span>
          </Popover>
        </div>
        <div ><span>邀请面试</span></div>
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


const ProfileContent = (


  <div className={styles.profilebox}>
    <div className={styles.title} >发送职位</div>
    <div className={styles.positionWrap}>

    {positionList.map((action) => {


      const sendCardMessage =async () => {
        debugger
        //发职位

        let obj = {
          ID: 1,
          PostType: 1,
          PostName: "职位名称",
          Payroll: "sfsf",
          CompanyName: "userName",
          CompanyUrl: "headPath",
        };
        let PositionMessage = {
          data: JSON.stringify(obj),
          extension: "position_msg",
          description: "[职位消息]",
        };


        const { data: message } =await IMSDK.createCustomMessage({
          data: JSON.stringify(PositionMessage),
          extension: "",
          description: "",
        });
   

        // sendMessage({ message });

      }

        return (
          <div className={styles.box} onClick={sendCardMessage}>
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
);