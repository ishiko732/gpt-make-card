import type { NextApiRequest, NextApiResponse } from "next";
import openai from "../../lib/openai";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query["model"] && !Array.isArray(req.query["model"])) {
    const response = await openai.retrieveModel(req.query["model"]);
    res.status(200).json(response.data);
  } else {
    const response = await openai.listModels();
    res.status(200).json(response.data);
  }
};

export default handler;
