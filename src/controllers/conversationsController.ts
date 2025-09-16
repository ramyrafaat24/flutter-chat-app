import pool from "../models/db";
import { Request, Response } from "express";

export const fetchAllConversationsByUserId = async(req:Request, res:Response)=>{
    let userId = null;
    if (req.user) {
        userId = req.user.id; 
      
    }
    try {
        const result = await pool.query(
          `
         SELECT 
         c.id AS conversation_id,
         CASE
          WHEN u1.id = $1 THEN u2.username
         ELSE u1. username
         CASE
         WHEN u1.id = $1 THEN u2.profile_image
         ELSE u1.profile_image
         END AS participant_image,
         
         END AS participant_name,
         m.content AS last_message,
         m.created_at AS last_message_time
         FROM conversations c
         JOIN users u1 ON  u1.id = c.participant_one
         JOIN users u2 ON u2.id = c.participant_two
         LEFT JOIN LATERAL(
         SELECT content, created_at
         From messages
         where conversation_id = c.id
         Order by created_at desc
         Limit 1
         ) m ON true
          Where c.participant_one = $1 or c.participant_two = $1
          Order by m.created_at DESC 
          `,
          [userId]  
        );
        res.json(result.rows);
        
    } catch (e) {
        console.error("DB Error:", e);
        res.status(500).json({error:'failed to fetch conversation'})
    }
}
export const checkOrCreateConversation = async(req:Request,res:Response):Promise<any>=>{
    let userId = null;
    if (req.user) {
        userId = req.user.id; 
      
    }
    const {contactId}=req.body;
    try {
       const existingConversation = await pool.query(
        `
        SELECT id FROM conversations 
        where (participant _one = $1 AND paricipant_two = $2)
        OR (participant _one = $2 AND paricipant_two = $1)
        LIMIT 1;
        `,
        [userId, contactId]
       ) ;

       if ( existingConversation.rowCount !=null && existingConversation.rowCount! >0) {

        return res.json({conversationId: existingConversation.rows[0].id});
       }
       const  newConversation = await pool.query(
        `
        INSERT INTO conversation (participant_one, participant_two)
        VALUES ($1,$2)
        RETURING id;
        `,
        [userId, contactId]

       );
       res.json({conversationId: newConversation.rows[0].id});
    } catch (error) {
        console.error('Error checking or creating conversation:',error);
        res.status(500).json({error:'Failed to check or create conversation'});
    }

}

export const  getDailyQuestion = async (req:Request, res:Response):Promise<any> =>{
    const conversationId = req.params.id;

    try {
       const result = await pool.query(
        `
        SELECT content FROM messages
        WHERE conversation_id = $1 AND sender_id 'AI-BOT'
        ORDER BY created_at DESC
        LIMIT 1
        `,
        [conversationId]
       );
       if(result.rowCount ===0){
        return res.status(404).json({error:'No daily question found'});

       }
       res.json({question:result.rows[0].content});
        
    } catch (error) {
        console.error('Error fetching daily question:',error);
        res.status(500).json({error:'Failed to fetch daily question'})
    }
}