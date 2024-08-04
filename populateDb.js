import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { createClient } from '@supabase/supabase-js';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from '@langchain/openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const filePath = path.join(__dirname, 'scrimba-info.txt');
  const text = fs.readFileSync(filePath, 'utf8');

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    separators: ['\n\n', '\n', ' ', ''],
    chunkOverlap: 50
  });

  // Split the text into chunks
  const output = await splitter.createDocuments([text]);


  const sbApiKey = process.env.SUPABASE_API_KEY;
  const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT;
  const openAIApiKey = process.env.OPENAI_API_KEY;

  if (!sbUrl || !sbApiKey || !openAIApiKey) {
    throw new Error("Missing environment variables for Supabase or OpenAI.");
  }

  // Initialize the Supabase client
  const client = createClient(sbUrl, sbApiKey);

  // Store the documents in Supabase
  await SupabaseVectorStore.fromDocuments(
    output,
    new OpenAIEmbeddings({ openAIApiKey }),
    {
      client,
      tableName: 'documents'
    }
  );

} catch (err) {
  console.error(err);
}
