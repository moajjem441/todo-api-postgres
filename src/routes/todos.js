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


//Get single todo

router.get('/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const todo = await prisma.todo.findUnique({
            where:{
                id: id
            },
        });

        if(!todo){
            return res.status(404).json({error:"Todo not found"});

        }
        res.status(200).json(todo);
    }
    catch(error){
        res.status(500).json({error:"failed to get todo"});
    }
});
