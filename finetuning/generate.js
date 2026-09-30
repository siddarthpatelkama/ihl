import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables from the parent chatbot project
dotenv.config({ path: "../byok-chatbot/.env.local" });
dotenv.config({ path: "../byok-chatbot/.env" });

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ Error: GEMINI_API_KEY is not set.");
  console.error("Please add your Gemini API key to v:\\ihl\\byok-chatbot\\.env.local or run the script like this:");
  console.error("set GEMINI_API_KEY=your_key && node generate.js");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
// Using gemini-1.5-pro for high-quality synthetic data generation
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-pro",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          messages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                role: { type: "string" },
                content: { type: "string" }
              }
            }
          }
        }
      }
    }
  }
});

const CATEGORIES = [
  { name: 'Normal explanations', count: 50, desc: 'Casual but clear explanations of everyday tech or science concepts.' },
  { name: 'Bro/macha casual conversations', count: 50, desc: 'Very casual, everyday chat using words like bro, macha, mama, dude. Friendly and relaxed.' },
  { name: 'Encouraging when confused', count: 30, desc: 'User is frustrated or stuck ("I don\'t get this", "Why isn\'t this working?"). Assistant is patient, breaks it down, and is encouraging without overdoing slang.' },
  { name: 'Debugging/code', count: 40, desc: 'User asks code debugging questions (React, Python, SQL). Assistant fixes the code clearly while being friendly.' },
  { name: 'Exam explanations', count: 40, desc: 'User explicitly asks for exam answers ("2 marks", "define this"). Assistant gives concise, formal, exam-ready answers. NO SLANG.' },
  { name: 'Short answers', count: 30, desc: 'User asks for TLDR or one-line answers. Assistant gives very short answers.' },
  { name: 'Technical/deep answers', count: 30, desc: 'Hard topics like neural networks, system design, transformers. Technical correctness takes priority over slang.' },
  { name: 'Jokes/light humor', count: 20, desc: 'User wants a joke or banter. Assistant uses light humor naturally.' },
  { name: 'Serious questions', count: 20, desc: 'User asks about resumes, professional emails, or formal reports. Assistant is 100% professional. NO SLANG.' },
  { name: 'Avoiding excessive slang', count: 30, desc: 'Normal conversation where the assistant intentionally does NOT use slang, showing it knows when to dial it back.' }
];

async function generateBatch(category, count) {
  const prompt = `
    You are an expert AI dataset generator. 
    Generate EXACTLY ${count} unique JSONL training examples for a conversational language model.
    
    Category Focus: ${category.name}
    Category Details: ${category.desc}
    
    Target Personality of the Assistant:
    - Friendly, knowledgeable friend
    - Uses "bro", "macha", "mama", "dude" occasionally and naturally, BUT ONLY when appropriate.
    - NEVER uses slang in formal, exam, or professional contexts.
    - Patient when the user is confused.
    - Corrects the user if they are wrong.
    
    Format:
    An array of objects matching the schema: {"messages": [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}
    
    Ensure ALL ${count} examples are highly diverse in topic, length, and user emotion. Do NOT repeat topics.
  `;

  console.log(`⏳ Generating ${count} examples for: ${category.name}...`);
  try {
    const result = await model.generateContent(prompt);
    const jsonStr = result.response.text();
    const parsed = JSON.parse(jsonStr);
    return parsed;
  } catch (error) {
    console.error(`❌ Failed to generate batch for ${category.name}:`, error.message);
    return [];
  }
}

async function main() {
  const allData = [];
  
  for (const category of CATEGORIES) {
    // Generate in batches of 15 to avoid hitting output token limits (usually 8192)
    let remaining = category.count;
    while (remaining > 0) {
      const batchSize = Math.min(remaining, 15);
      const batchData = await generateBatch(category, batchSize);
      allData.push(...batchData);
      remaining -= batchSize;
      
      // Write progressively to file
      const lines = batchData.map(d => JSON.stringify(d)).join("\n") + "\n";
      fs.appendFileSync("dataset.jsonl", lines);
    }
  }

  console.log(`\n✅ Successfully generated ${allData.length} total examples and saved to dataset.jsonl!`);
}

// Clear file before starting
fs.writeFileSync("dataset.jsonl", "");
main();
