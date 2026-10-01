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


// create a new todo

router.post("/",async(req,res)=>{
    try{
        const {title,description,completed,priority,dueDate} = req.body;

        if(!title || !description){
            return res.status(400).json({error:"title and description are required"});
        }

        const newTodo = await prisma.todo.create({
            data:{
                title,
                description,
                priority,
                dueDate : dueDate ? new Date(dueDate) : null,
            },
        });

        res.status(201).json(newTodo)
    }catch(error){
        res.status(500).json({error : "failed to create todo", details: error.message});
    }
});




//update an existing todo

router.patch("/:id",async(req,res)=>{
    try{
        const {id} = req.params;
        if(isNaN(id)) return res.status(400).json({error:"invalid Id format"});

        const {title,description,completed,priority,dueDate} = req.body;

        const updatedTodo = await prisma.todo.update({
            where:{id},
            data:{
                title,
                description,
                completed,
                priority,
                dueDate : dueDate : new Date(dueDate) : undefined,
            },
        });
        res.status(200).json(updatedTodo);
    
    }catch(error){
        if(error.code === "P2025"){
            return res.status(404).json({error:"Todo not found"});
        }
        res.status(500).json({error:"failed to update todo"});
    }
});

