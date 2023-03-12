import { Avatar, Button, Grid, styled, Typography } from "@mui/material";
import React, { useRef } from "react";
import dayjs from "dayjs";

interface ChatTextProps {
  align: "left" | "right";
}

const ChatText = styled("div", {
  shouldForwardProp: (prop) => !["align"].includes(prop as string),
})<ChatTextProps>(({ align }: { align: "left" | "right" }) => ({
  color: align === "left" ? undefined : "#fff",
  backgroundColor: align === "left" ? "#f5f5f5" : "#3f51b5",
  borderTopRightRadius: align === "left" ? "20px" : undefined,
  borderTopLeftRadius: align === "right" ? "20px" : undefined,
  borderBottomRightRadius: "20px",
  borderBottomLeftRadius: "20px",
  textAlign: "left",
  display: "inline-block",
  padding: "8px 16px",
  marginBottom: "4px",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  fontSize: "15px",
}));

const Message = (props: {
  position: "left" | "right";
  message?: string | JSX.Element;
  timestamp?: string | number | Date;
  photo?: string;
  displayName?: string;
}) => {
  const {
    position = "left",
    message = "no message",
    timestamp,
    photo = "ChatGPT_logo.svg",
    displayName = "null",
  } = props;
  const showDateDayjs = timestamp ? dayjs(timestamp) : dayjs();
  const diffDay = dayjs(showDateDayjs).diff(dayjs(), "day");
  const textRef = useRef<HTMLDivElement>();
  return (
    <Grid container spacing={2}>
      {position === "left" && (
        <Grid item xs={1}>
          <div
            onClick={() =>
              copyOpt(textRef.current.innerText.replace("问题-答案\n", ""))
            }
          >
            <Avatar alt={displayName} src={photo} />
          </div>
        </Grid>
      )}
      <Grid item xs={10} marginRight={"8px"} textAlign={position}>
        <Typography
          variant="caption"
          display="block"
          color={"rgba(0, 0, 0, 0.54)"}
          textAlign={position}
          suppressHydrationWarning={true} // nextjs error
        >
          {diffDay === 0
            ? showDateDayjs.format("HH:mm:ss")
            : showDateDayjs.format("MM/DD HH:mm:ss")}
        </Typography>
        <ChatText align={position} ref={textRef}>
          {message}
        </ChatText>
      </Grid>
      {position === "right" && (
        <Grid item xs={1}>
          <div onClick={() => copyOpt(textRef.current.innerText)}>
            <Avatar alt={displayName} src={photo} />
          </div>
        </Grid>
      )}
    </Grid>
  );
};

export default Message;

const copyOpt = async (text: string) => {
  await navigator.clipboard.writeText(text);
};
