import type { NextApiRequest, NextApiResponse } from "next";
import { Chat, Prisma, PrismaClient } from "@prisma/client";
import openai from "../../lib/openai";
import { ChatCompletionRequestMessage } from "openai";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const text: string = data["text"];
  const dialogId: number = data["dialogId"];
  if (!text || !dialogId) {
    return res.status(400).json({ message: "text is not" });
  }
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `文本\n${text}\n一套卡片：` },
      ],
    });
    const listChatAI: Chat[] = [];
    const chatAI: Prisma.ChatCreateInput[] = response.data.choices.map(
      (message) => {
        return {
          role: message.message.role,
          text: message.message.content,
          dialog: {
            connect: {
              id: dialogId,
            },
          },
        };
      }
    );
    for (let index = 0; index < chatAI.length; index += 1) {
      listChatAI.push(await prisma.chat.create({ data: chatAI[index] }));
    }
    res.status(200).json(listChatAI);
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

export default handler;

const systemPrompt = `请根据我提供的文本，制作一套抽认卡。

在制作抽认卡时，请遵循下述要求：
- 保持抽认卡的简单、清晰，并集中于最重要的信息。
- 确保问题是具体的、不含糊的。
- 使用清晰和简洁的语言。使用简单而直接的语言，使卡片易于阅读和理解。
- 答案应该只包含一个关键的事实/名称/概念/术语。

制作抽认卡时，让我们一步一步来：
第一步，使用简单的中文改写内容，同时保留其原来的意思。
第二步，将内容分成几个小节，每个小节专注于一个要点。
第三步，利用小节来生成多张抽认卡，对于超过 15 个字的小节，先进行拆分和概括，再制作抽认卡。

文本：
衰老细胞的特征是细胞内的水分减少，结果使细胞萎缩，体积变小，细胞代谢的速率减慢。细胞内多种酶的活性降低。细胞核的体积增大，核膜内折，染色质收缩、染色加深。细胞膜通透性改变，使物质运输功能降低。
一套卡片：
| 问题-答案 |
|---|
|衰老细胞的体积会怎么变化？::变小。|
|衰老细胞的体积变化的具体表现是什么？::细胞萎缩。|
|衰老细胞的体积变化原因是什么？::细胞内的水分减少。|
|衰老细胞内的水分变化对细胞代谢的影响是什么？::细胞代谢的速率减慢。 |
|衰老细胞内的酶活性如何变化？::活性降低。|
|衰老细胞的细胞核体积如何变化？::体积变大。|
|衰老细胞的细胞核的核膜如何变化？::核膜内折。 |
|衰老细胞的细胞核的染色质如何变化？::染色质收缩。|
|衰老细胞的细胞核的染色质变化对细胞核形态的影响是？::染色加深。|
|衰老细胞的物质运输功能如何变化？::物质运输功能降低。|
|衰老细胞的物质运输功能为何变化？::细胞膜通透性改变。|`;
