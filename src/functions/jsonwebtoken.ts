// Imports
import * as jwt from "jsonwebtoken";

// Env constants
const jwtSecret : string | undefined = process.env.JWT_SECRET;

// Declares the type token
type Token = {
  id: Number
};

// Decode function
export function decode_jwt(token : string){
  // Verifies if the token is inserted
  if(!token) throw new Error("Token not inserted!");

  // Verifies if the sk is in the code
  if(!jwtSecret) throw new Error("JWT SK not inserted");

  // Gets the token data
  const decoded = jwt.verify(token, jwtSecret) as Token;

  // Verifies if is OK
  if(!decoded || !decoded.id) throw new Error("Invalid access token");

  // Returns the token data
  return decoded.id
}

export function create_jwt(id: string | undefined) {
  // Verifies if the user id is inserted
  if(!id) throw new Error("user id not inserted!");

  // Verifies if the sk is in the code
  if(!jwtSecret) throw new Error("JWT SK not inserted");

  // Creates a token with the ID
  const token = jwt.sign({ id: id }, jwtSecret) as string;

  // Returns the token
  return token
}