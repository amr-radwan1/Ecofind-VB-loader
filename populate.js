import { RecursiveCharacterTextSplitter } from './node_modules/langchain/text_splitter'
import { createClient } from './node_modules/@supabase/supabase-js'
import { SupabaseVectorStore } from './node_modules/@langchain/community/vectorstores/supabase'
import { OpenAIEmbeddings } from './node_modules/@langchain/openai'

try {
    const result = await fetch('scrimba-info.txt')
    const text = await result.text()
  
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      separators: ['\n\n', '\n', ' ', ''], // default setting
      chunkOverlap: 50
    })
  
    const output = await splitter.createDocuments([text])
    
    const sbApiKey = process.env.SUPABASE_API_KEY
    const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT
    const openAIApiKey = process.env.OPENAI_API_KEY
  
    const client = createClient(sbUrl, sbApiKey)
  
    await SupabaseVectorStore.fromDocuments(
        output,
        new OpenAIEmbeddings({openAIApiKey}),
        {
            client,
            tableName: 'documents'
        }
    )

  } catch (err) {
    console.log(err)
  }
  