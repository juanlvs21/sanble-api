import { Request, Response } from "express";
import jwt from "jsonwebtoken";

// Config
import { JWT_SECRET } from "@/config/env";

// Models
import User, { IUser } from "@/models/user";

function createToken(user: IUser) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
}

export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.body.username || !req.body.password) {
    return res
      .status(422)
      .json({ msg: "Please. Send your username and password" });
  }

  const user = await User.findOne({ username: req.body.username });

  if (user) {
    return res.status(400).json({ msg: "The User already Exists" });
  }

  const newUser = new User(req.body);
  await newUser.save();

  return res.status(201).json(newUser);
};

export const signIn = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .json({ msg: "Please. Send your username and password" });
  }

  const user = await User.findOne({ username: req.body.username });

  if (!user) {
    return res.status(400).json({ msg: "The User does not exists" });
  }

  const isMatch = await user.comparePassword(req.body.password);

  if (isMatch) {
    return res.status(200).json({ token: createToken(user), user });
  }

  return res.status(401).json({
    msg: "The email or password are incorrect",
  });
};
