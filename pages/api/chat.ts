import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const chat: Prisma.ChatCreateInput = {
      text: data.text,
      dialog: {
        connect: {
          id: data.dialogId,
        },
      },
    };
    const savedContact = await prisma.chat.create({ data: chat });
    const listChat = await prisma.chat.findMany({
      where: {
        dialogId: data.dialogId,
      },
    });
    res.status(200).json(listChat);
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

export default handler;
