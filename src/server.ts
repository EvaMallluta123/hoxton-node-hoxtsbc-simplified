import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

const app = express();
app.use(cors());
app.use(express.json());
const prisma = new PrismaClient();
const port = 3400;

app.get(`/sign-up`, async (req, res) => {
  try {
    const match = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (match) {
      res.status(400).send({ error: "This account already exists." });
    } else {
      const user = await prisma.user.create({
        data: {
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password),
        },
      });

      res.send({ user: user });
    }
  } catch (error) {
    // @ts-ignore
    res.status(400).send({ error: error.message });
  }
});

app.post("/sign-in", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
  });
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    res.send({ user: user });
  } else {
    res.status(400).send({ error: "Invalid email/password combination." });
  }
});

app.get(`/transactions`, async (req, res) => {
  try {
    const transaction = prisma.transactions.findMany();
    res.send(transaction);
  } catch (error) {
    //@ts-ignore
    res.status(400).send({ error: error.message });
  }
});
 app.listen((port),()=>{
    console.log(`App running:˘${port} `)
 })