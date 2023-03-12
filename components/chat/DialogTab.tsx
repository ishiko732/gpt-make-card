import * as React from "react";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ChatBox from "./ChatBox";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Chat } from "@prisma/client";
import ButtonInTabs from "./ButtonTab";
import AddIcon from "@mui/icons-material/Add";

export default function DialogTabs({
  dialogs,
  setDialogs,
  userimg,
}: {
  dialogs: {
    id: number;
    name: string;
    chat: Chat[];
  }[];
  setDialogs: React.Dispatch<any>;
  userimg: string;
}) {
  const [value, setValue] = React.useState("0");
  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setValue(String(newValue));
    setDialogs(await queryDialogs());
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={String(value)}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
          display="flex"
          justifyContent="center"
          width="100%"
        >
          <TabList
            scrollButtons
            allowScrollButtonsMobile
            onChange={handleChange}
            variant="scrollable"
          >
            {dialogs.map((dialog, index) => (
              <Tab
                key={`tab-${index}`}
                value={String(index)}
                label={dialog.name}
              />
            ))}
            <ButtonInTabs
              onClick={async () => {
                const data = await createDialog(
                  `制作卡片${dialogs.length + 1}`
                );
                setDialogs((pre: any[]) => [...pre, data]);
              }}
            >
              <AddIcon color="info" />
            </ButtonInTabs>
          </TabList>
        </Box>
        {dialogs.map((dialog, index) => (
          <TabPanel value={String(index)} key={`pannel-${index}`}>
            <ChatBox
              chat={dialog.chat}
              dialogId={dialog.id}
              userimg={userimg}
            />
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
}

async function queryDialogs() {
  const response = await fetch("/api/dialog", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}

async function createDialog(name: string) {
  const response = await fetch("/api/dialog", {
    method: "POST",
    body: JSON.stringify({ name: name }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}
