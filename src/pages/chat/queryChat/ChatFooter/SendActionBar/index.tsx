import { DownOutlined } from "@ant-design/icons";
import { Popover, PopoverProps, Upload } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";
import clsx from "clsx";
import { t } from "i18next";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { memo, ReactNode, useCallback, useRef, useState } from "react";
import React from "react";

import card from "@/assets/images/chatFooter/card.png";
import emoji from "@/assets/images/chatFooter/emoji.png";
import file from "@/assets/images/chatFooter/file.png";
import image from "@/assets/images/chatFooter/image.png";
import rtc from "@/assets/images/chatFooter/rtc.png";
import video from "@/assets/images/chatFooter/video.png";
import { ExMessageItem } from "@/store";
import emitter from "@/utils/events";

import { SendMessageParams } from "../useSendMessage";
import CallPopContent from "./CallPopContent";
import EmojiPopContent from "./EmojiPopContent";

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
    accept: !window.electronAPI ? ".mp4" : "video/*",
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

const SendActionBar = ({
  sendMessage,
  createFileMessage,
}: {
  sendMessage: (params: SendMessageParams) => Promise<void>;
  createFileMessage: (file: File) => Promise<ExMessageItem>;
}) => {
  const [visibleState, setVisibleState] = useState({
    emoji: false,
    cut: false,
    rtc: false,
  });

  const closeAllPop = useCallback(
    () => setVisibleState({ cut: false, rtc: false, emoji: false }),
    [],
  );
  const cutWithoutWindow = useCallback(
    () => setVisibleState({ cut: false, rtc: false, emoji: false }),
    [],
  );

  const fileHandle = async (options: UploadRequestOption) => {
    const fileEl = options.file as File;

    const message = await createFileMessage(fileEl);
    sendMessage({
      message,
    });
  };

  return (
    <div className="flex items-center px-4.5 pt-2">
      {sendActionList.map((action) => {
        const popProps: PopoverProps = {
          placement: action.placement as TooltipPlacement,
          content:
            action.comp &&
            React.cloneElement(action.comp as React.ReactElement, {
              closeAllPop,
              cutWithoutWindow,
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
      className="mr-5 flex"
    >
      {children}
    </Upload>
  ) : (
    <Popover {...popProps}>{children}</Popover>
  );
};
