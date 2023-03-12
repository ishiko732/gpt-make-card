import DialogTabs from "@/components/chat/DialogTab";
import { Dialog, Prisma, PrismaClient } from "@prisma/client";
import { useState } from "react";
const prisma = new PrismaClient();

const Index = ({
  initialDialogs,
  userimg,
}: {
  initialDialogs: string;
  userimg: string;
}) => {
  const [dialogs, setDialogs] = useState(JSON.parse(initialDialogs));
  return (
    <DialogTabs dialogs={dialogs} setDialogs={setDialogs} userimg={userimg} />
  );
};
export default Index;

export async function getServerSideProps() {
  const dialogs: Dialog[] = await prisma.dialog.findMany({
    include: {
      chat: true,
    },
  });
  return {
    props: {
      initialDialogs: JSON.stringify(dialogs),
      userimg: process.env.user_img,
    },
  };
}
