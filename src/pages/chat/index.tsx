import { SessionType } from "@openim/wasm-client-sdk";
import { Layout } from "antd";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { useConversationToggle } from "@/hooks/useConversationToggle";

import ConversationSider from "./ConversationSider";

export const Chat = () => {
  useEffect(() => {
    // 组件加载完成后执行的事件
    console.log("组件加载完成");

    toSpecifiedConversation({
      sourceID: "80000133",
      sessionType: SessionType.Single,
    });

    // 如果需要清理副作用，可以返回一个函数
    return () => {
      console.log("组件卸载或更新前的清理");
    };
  }, []); // 空依赖数组表示只在组件加载时执行一次

  const { toSpecifiedConversation } = useConversationToggle();

  return (
    <Layout className="flex-row">
      <ConversationSider />
      <Outlet />
    </Layout>
  );
};
