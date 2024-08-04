import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { createClient } from '@supabase/supabase-js';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from '@langchain/openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

try {
  // Convert import.meta.url to a file path
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Read the content of scrimba-info.txt
  const filePath = path.join(__dirname, 'scrimba-info.txt');
  const text = fs.readFileSync(filePath, 'utf8');

  // Initialize the RecursiveCharacterTextSplitter
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    separators: ['\n\n', '\n', ' ', ''], // default setting
    chunkOverlap: 20
  });

  // Split the text into chunks
  const output = await splitter.createDocuments([text]);

  // Retrieve environment variables
  const sbApiKey = process.env.SUPABASE_API_KEY;
  const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT;
  const openAIApiKey = process.env.OPENAI_API_KEY;

  // Check for any issues with the URL
  if (!sbUrl || !sbApiKey || !openAIApiKey) {
    throw new Error("Missing environment variables for Supabase or OpenAI.");
  }

  // Ensure the URL does not contain extra characters
  const cleanedSbUrl = sbUrl.trim();

  // Initialize the Supabase client
  const client = createClient(cleanedSbUrl, sbApiKey);

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
