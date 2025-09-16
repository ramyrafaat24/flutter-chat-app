import { Request,Response } from "express";
import bcrypt from 'bcrypt';
import pool from "../models/db";
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'chato';
const randomImages  = [
  
    'data:image/jpeg;base64,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',
]

export const register = async(req:Request, res:Response) =>{
    const {username,email,password} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
const randomImage: string = randomImages[Math.floor(Math.random() * randomImages.length)];
        const result = await pool.query(
               'INSERT INTO users (username, email, password, profile_image) VALUES ($1, $2, $3.$4) RETURNING *',
            [username, email,hashedPassword,randomImage]
        );
        const user = result.rows[0];
        res.status(201).json({user});


    } catch (error) {
         res.status(500).json({error:'Faild to Register User '});
    }

}
export const login = async(req:Request, res:Response):Promise<any> =>{
    const {email, password} = req.body;
    try {
         const result = await pool.query(
               'SELECT * FROM users WHERE email = $1',
            [ email]
        );
        const  user = result.rows[0];
        if (!user) return   res.status(404).json({error:'User Not Found'});
        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) return  res.status(400).json({error:'Invalid credentials'});
        const token = jwt.sign({id:user.id},JWT_SECRET,{expiresIn:'50d'});
        let finalResult = {...user,token}
        res.json({user: finalResult});
    } catch (error) {
            res.status(500).json({error:'Faild to Login User '});
        
    }
    
}
