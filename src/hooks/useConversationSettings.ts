import { App } from "antd";
import { t } from "i18next";
import { useCallback } from "react";

import { IMSDK } from "@/layout/MainContentWrap";
import { useConversationStore } from "@/store";
import { feedbackToast } from "@/utils/common";
import { useParams, useNavigate } from "react-router-dom";

export function useConversationSettings() {
  const navigate = useNavigate();
  const { modal } = App.useApp();

  const currentConversation = useConversationStore(
    (state) => state.currentConversation,
  );

  const delConversationByCID = useConversationStore(
    (state) => state.delConversationByCID,
  );

  const updateConversationPin = useCallback(
    async (isPinned: boolean) => {
      if (!currentConversation) return;

      try {
        await IMSDK.pinConversation({
          conversationID: currentConversation.conversationID,
          isPinned,
        });
      } catch (error) {
        feedbackToast({ error, msg: t("toast.pinConversationFailed") });
      }
    },
    [currentConversation?.conversationID],
  );

  const clearConversationMessages = useCallback(() => {
    if (!currentConversation) return;
    modal.confirm({
      title: t("toast.clearChatHistory"),
      content: t("toast.confirmClearChatHistory"),
      onOk: async () => {
        try {
          await IMSDK.clearConversationAndDeleteAllMsg(
            currentConversation.conversationID,
          );
          navigate("/chat");
        } catch (error) {
          feedbackToast({ error, msg: t("toast.clearConversationMessagesFailed") });
        }
      },
    });
  }, [currentConversation?.conversationID]);

  const delConversation = useCallback(() => {
    if (!currentConversation) return;
    modal.confirm({
      title: "删除会话",
      content: "确认删除会话吗？",
      onOk: async () => {
        try {
          await IMSDK.deleteConversationAndDeleteAllMsg(currentConversation?.conversationID);

          await delConversationByCID(currentConversation?.conversationID)

          navigate("/chat");
        } catch (error) {
          feedbackToast({ error, msg: "删除会话失败！" });
        }
      },
    });
  }, [currentConversation?.conversationID]);

  return {
    currentConversation,
    updateConversationPin,
    clearConversationMessages,
    delConversation,
  };
}
