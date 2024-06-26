import cookieParser from "cookie-parser";
import { randomUUID, UUID } from "crypto";
import dotenv from "dotenv";
import express, { Router } from "express";

dotenv.config();
const app = express();

interface ISession {
  [key: UUID]: {
    email: string;
    password: string;
  };
}

const session: ISession = {};

const route = Router();

const user = {
  email: "admin",
  password: "admin",
};

app.use(cookieParser());

route.get("/", (req, res) => {
  try {
    const sessionID = req.cookies("uid");

    if (session[sessionID]) {
      res.status(200).json(session[sessionID]);
    }
  } catch (error) {
    res.status(400).json({ message: "error in logout session" });
  }
});

route.get("/login/:email/:password", (req, res) => {
  try {
    const { email, password } = req.params;
    console.log(email === user.email && password === user.password);

    if (email === user.email && password === user.password) {
      const sessionKey = randomUUID();
      session[sessionKey] = { email, password };
      res.cookie("uid", sessionKey);
      res.status(200).json(session[sessionKey]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "erreur d'authentification" });
  }
});

route.get("/logout", async (req, res) => {
  try {
    const { uid } = await req.cookies;
    if (session[uid]) {
      delete session[uid];
      res.send({ message: "session deleted" });
    }
    res.send({ message: "no session to delete" });
  } catch (error) {
    res.status(400).json({ message: "error in logout session" });
  }
});

app.use("/api/test", route);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`écoute sur le port ${PORT}`);
});
