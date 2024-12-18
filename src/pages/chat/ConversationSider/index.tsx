import clsx from "clsx";
import { t } from "i18next";
import { useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import sync from "@/assets/images/common/sync.png";
import sync_error from "@/assets/images/common/sync_error.png";
import FlexibleSider from "@/components/FlexibleSider";
import { useConversationStore, useUserStore } from "@/store";

import ConversationItemComp from "./ConversationItem";
import styles from "./index.module.scss";
import { IMSDK } from "@/layout/MainContentWrap";
import { App } from "antd";
import { feedbackToast } from "@/utils/common";
const ConnectBar = () => {
  const userStore = useUserStore();
  const showLoading =
    userStore.syncState === "loading" || userStore.connectState === "loading";
  const showFailed =
    userStore.syncState === "failed" || userStore.connectState === "failed";

  const loadingTip =
    userStore.syncState === "loading" ? t("connect.syncing") : t("connect.connecting");

  const errorTip =
    userStore.syncState === "failed"
      ? t("connect.syncFailed")
      : t("connect.connectFailed");

  if (userStore.reinstall) {
    return null;
  }

  return (
    <>
      {showLoading && (
        <div className="flex h-6 items-center justify-center bg-[#0089FF] bg-opacity-10">
          <img
            src={sync}
            alt="sync"
            className={clsx("mr-1 h-3 w-3 ", styles.loading)}
          />
          <span className=" text-xs text-[#0089FF]">{loadingTip}</span>
        </div>
      )}
      {showFailed && (
        <div className="flex h-6 items-center justify-center bg-[#FF381F] bg-opacity-15">
          <img src={sync_error} alt="sync" className="mr-1 h-3 w-3" />
          <span className=" text-xs text-[#FF381F]">{errorTip}</span>
        </div>
      )}
    </>
  );
};

const ConversationSider = () => {
  const { modal } = App.useApp();
  const navigate = useNavigate();
  const { conversationID } = useParams();
  const conversationList = useConversationStore((state) => state.conversationList);
  const getConversationListByReq = useConversationStore(
    (state) => state.getConversationListByReq,
  );
  const virtuoso = useRef<VirtuosoHandle>(null);
  const hasmore = useRef(true);

  const endReached = async () => {
    if (!hasmore.current) return;
    hasmore.current = await getConversationListByReq(true);
  };

  useEffect(() => {
    getUsersInfoWithCache();

    return () => { };
  }, [conversationList.length]);

  const getUsersInfoWithCache = async () => {
    if (conversationList.length > 0) {
      const userIDList = conversationList.map((item) => {
        return item.userID;
      });
      const { data } = await IMSDK.getUsersInfoWithCache({
        userIDList: userIDList,
      });
      const friendInfo = data[0].friendInfo; //
    }
  };

  const clearAllConversation = async () => {
    modal.confirm({
      title: "清空所有会话",
      content: "确认清空所有会话吗？",
      onOk: async () => {
        try {
          conversationList.map((item) => {
            deleteConversationAndDeleteAllMsg(item);
          });

          navigate("/clear");
        } catch (error) {
          feedbackToast({ error, msg: "删除会话失败！" });
        }
      },
    });
  };

  const deleteConversationAndDeleteAllMsg = async (item) => {
    debugger;
    await IMSDK.deleteFriend(item.userID!);
    debugger;
    await IMSDK.deleteConversationAndDeleteAllMsg(item.conversationID);
  };
  return (
    <div>
      <ConnectBar />
      <FlexibleSider
        needHidden={Boolean(conversationID)}
        wrapClassName="left-2 right-2 top-1.5 flex flex-col"
      >
        <Virtuoso
          className="flex-1"
          data={conversationList}
          ref={virtuoso}
          endReached={endReached}
          computeItemKey={(_, item) => item.conversationID}
          itemContent={(_, conversation) => (
            <ConversationItemComp
              isActive={conversationID === conversation.conversationID}
              conversation={conversation}
            />

          )}
        />
        <div className={styles.tSMsg}>以上是30天内的联系人</div>
        <button className={styles.clearAllConversation} onClick={clearAllConversation}>
          清空会话
        </button>
      </FlexibleSider>
    </div>
  );
};

export default ConversationSider;
