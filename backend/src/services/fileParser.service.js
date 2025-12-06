import fs from "fs";
import pdfParse from "pdf-parse";
import { transcribeAudioOrVideo } from "./transcription.service.js";

export const parseFileToText = async (file) => {
  const { mimetype, path } = file;

  // 1. PDF files
  if (mimetype === "application/pdf") {
    const dataBuffer = fs.readFileSync(path);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  // 2. Text & transcript files
  if (
    mimetype.startsWith("text/") ||
    mimetype === "application/x-subrip" // .srt subtitles
  ) {
    return fs.readFileSync(path, "utf8");
  }

  // 3. Audio / Video -> Whisper transcription
  if (mimetype.startsWith("audio/") || mimetype.startsWith("video/")) {
    const transcript = await transcribeAudioOrVideo(path);
    return transcript;
  }

  // 4. Unsupported type
  return "Unsupported file type for text extraction.";
};
