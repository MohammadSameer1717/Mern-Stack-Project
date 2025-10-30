import jwt from "jsonwebtoken"

export const genToken = (userId) => {
  const secret = process.env.JWT_SECRET || "mysecretkey";

  // Generate JWT Token
  const token = jwt.sign({ id: userId }, secret, {
    expiresIn: "7d",
  });

  return token;
};
