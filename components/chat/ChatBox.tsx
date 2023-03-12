import { Stack, Paper } from "@mui/material";
import { Chat, Prisma } from "@prisma/client";
import MuiMarkdown from "mui-markdown";
import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import TextInput from "./TextInput";

async function saveChat(chat: { text: string; dialogId: number }) {
  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify(chat),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}

async function replyAI(text: string, dialogId: number) {
  const response = await fetch("/api/openai", {
    method: "POST",
    body: JSON.stringify({
      text: text,
      dialogId: dialogId,
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}

const ChatBox = ({
  chat,
  dialogId,
  userimg,
}: {
  chat: Chat[];
  dialogId: number;
  userimg?: string;
}) => {
  const [chats, setChats] = useState(chat || []);
  const paperRef = useRef<HTMLDivElement>();
  const handleSubmit = async (
    data: {
      text: string;
    },
    e: { target: { reset: () => void } }
  ) => {
    try {
      const newdata = await saveChat({
        text: data.text,
        dialogId: dialogId,
      });
      setChats(newdata);
      e.target.reset();
      const chat_ai = await replyAI(data.text, dialogId);
      setChats((pre) => [...pre, ...chat_ai]);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    paperRef.current.scrollTop = paperRef.current.scrollHeight;
  }, [chats]);
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      width="100%"
    >
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          height: "85vh",
          maxWidth: "1000px",
          maxHeight: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "calc( 100% - 20px )",
            overflowY: "scroll",
            scrollbarWidth: "none",
            height: "calc( 100% - 80px )",
          }}
          ref={paperRef}
        >
          <Stack direction="column">
            {chats
              .filter((chat) => chat.role != "system")
              .map((item) => (
                <Message
                  key={`chat-${item.dialogId}-${item.id}`}
                  position={item.role === "user" ? "right" : "left"}
                  photo={item.role === "user" ? userimg : "ChatGPT_logo.svg"}
                  timestamp={item.commitDate}
                  message={
                    item.role === "user" ? (
                      item.text
                    ) : (
                      <MuiMarkdown>{item.text}</MuiMarkdown>
                    )
                  }
                  displayName={item.role === "user" ? "user" : "chatgpt"}
                />
              ))}
          </Stack>
        </Paper>
        <TextInput onSubmit={handleSubmit} />
      </Paper>
    </Stack>
  );
};

export default ChatBox;
