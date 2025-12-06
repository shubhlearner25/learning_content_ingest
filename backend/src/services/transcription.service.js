import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

console.log("🔍 Whisper Key Loaded?", !!process.env.OPENAI_API_KEY);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 600000,   // 10 minutes
  maxRetries: 5      // auto retry
});

export const transcribeAudioOrVideo = async (filePath) => {
  try {
    // Check file exists
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found: " + filePath);
    }

    const absolutePath = path.resolve(filePath);

    console.log("🎧 Transcribing file:", absolutePath);

    // Use toFile instead of raw stream — fixes ECONNRESET on slow networks
    const file = await OpenAI.fileFromPath(absolutePath);

    const result = await client.audio.transcriptions.create({
      file,
      model: "whisper-1",
      response_format: "text",
    });

    console.log("✅ Transcription successful");
    return result;

  } catch (err) {
    console.error("❌ Whisper FAILURE:", err.message);
    throw new Error("Whisper failed: " + err.message);
  }
};
