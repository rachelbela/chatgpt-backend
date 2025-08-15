// authors.ts
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception';
import { streamText } from 'hono/streaming';
import OpenAI from "openai";
const app = new Hono()

app.post('/', async (c) => {
    const body = await c.req.json();
    if (!body) {
        throw new HTTPException(400, {
            message: "非法请求"
        })
    }
    const { messages } = body
    if (!messages || messages.length === 0) {
        throw new HTTPException(400, {
            message: "非法请求"
        })
    }
    console.log("body", body)
    const openai = new OpenAI(
        {
            // 若没有配置环境变量，请用阿里云百炼API Key将下行替换为：apiKey: "sk-xxx",
            apiKey: "sk-2bf06c0d834d4535b157fc0e14dbfbe1",
            baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
        }
    );
    return streamText(c, async (stream) => {
        const completions = await openai.chat.completions.create({
            model: "deepseek-r1",  // 此处以 deepseek-r1 为例，可按需更换模型名称。
            messages,
            stream: true
        });
        for await (const chunk of completions) {
            const delta = chunk.choices[0].delta;
            console.log(JSON.stringify(delta))
            if (delta.reasoning_content) await stream.write(delta.reasoning_content)
            if (delta.content) await stream.write(delta.content)
        }
        return c.json({
            message: "123"
        })
    })

})


export default app