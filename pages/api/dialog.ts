import type { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const name: string =
        typeof req.body === "string"
          ? JSON.parse(req.body)["name"]
          : req.body["name"];
      const savedContact = await prisma.dialog.create({
        data: {
          name: name,
        },
      });
      return res.status(200).json(savedContact);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "Something went wrong" });
    }
  } else if (req.method === "GET") {
    const dialogs = await prisma.dialog.findMany({
      include: {
        chat: true,
      },
    });
    return res.status(200).json(dialogs);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
