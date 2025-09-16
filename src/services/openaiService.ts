import OpenAI from "openai";
import { openaiKey } from "../cron/config";

const openai = new OpenAI({
    apiKey:openaiKey
});

export const  generateDailyOuestion = async (): Promise<String> =>{
    try {
        const response = await openai.chat.completions.create({
            model:'gpt-4-turbe',
            messages:[
                {role:'user',content:'Generate a fun and engaging daily question for a chat conversation.'}
            ],

            max_tokens:50
        })
        console.log("getDailyQuestion - openAi called :");
        console.log(response.choices[0]?.message?.content);
        return response.choices[0]?.message?.content?.trim() || "What's your favorite hobby?";
        
    } catch (error) {
        console.error("Error generate daily question:", error);
        return"Here is a random question: What's your favorite book?";
    }
}