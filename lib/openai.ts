import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.secret_key,
});
const openai = new OpenAIApi(configuration);
export default openai;
