import {Router} from "express";
import prisma from "../lib/prisma";

const router = Router();


//Get all  todos (filter by completed status optional)

router.get("/",async(req,res)=>{
    const {completed}=req.query;
    
    const where=completed !== undefined ? {completed:completed === "true" ? true : false} : {};

    const todos = await prisma.todo.findMany({
        where,
        orderBy:{
            createdAt:"desc"
        },
    });
    res.status(200).json(todos);
})
