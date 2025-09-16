import cron from 'node-cron';
import pool from '../models/db';
import { generateDailyOuestion } from '../services/openaiService';
import { AT_BOT_ID } from './config';


cron.schedule('0 9 * * *', async () => {
  try {
    const conversations = await pool.query(`SELECT id FROM conversations`);
    
    for (const conversation of conversations.rows) {
      const question = await generateDailyOuestion();
      await pool.query(
        `
        INSERT INTO messages (conversation_id, sender_id, content)
        VALUES ($1, $2, $3)
        `,
        [conversation.id, AT_BOT_ID, question]
      );
      
      console.log(`Daily question sent for conversation ${conversation.id}`);
    }
  } catch (error) {
    console.error(`Error in daily questions job`, error);
  }
});
