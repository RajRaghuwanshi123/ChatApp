import { response } from "express";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response
        .status(400)
        .json({ message: "Email and Password are required" });
    }
    const UserEmail = await User.find({ email: email });
    if (UserEmail.length > 0) {
      return response.status(500).json({ message: "Email already exist" });
    }

    const user = await User.create({ email, password });

    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send({ message: "Internal server problem" });
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and Password are required" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ message: "You have to Signup first" });
    }

    const auth = await compare(password, user.password);

    if (!auth) {
      return res.status(400).send({ message: "Password is incorrect" });
    }

    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        color: user.color,
        image: user.image,
      },
      // token: { token },
    });
  } catch (err) {
    console.log(err);
  }
};

export const getuserInfo = async (request, response, next) => {
  try {
    const userData = await User.findById(request.userId);

    if (!userData) {
      return response
        .status(404)
        .send({ message: "User with the given email not found" });
    }
    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      color: userData.color,
      image: userData.image,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send({ message: "Internal server problem" });
  }
};

export const checksaveChanges = async (request, response, next) => {
  try {
    const { userId } = request;
    const { firstName, lastName, color } = request.body;
    if (!firstName || !lastName) {
      return response
        .status(400)
        .send("Firstname lastname and color is required");
    }
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );
    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      color: userData.color,
      image: userData.image,
    });
  } catch (error) {
    return response.status(500).send({ message: "Internal server problem" });
  }
};

export const logout = async (request, response, next) => {
  try {
    response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return response.status(200).send({ message: "Logout successfull" });
  } catch (error) {
    return response.status(500).send({ message: "Internal server problem" });
  }
};


