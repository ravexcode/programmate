//Node modules imports
import CryptoJS from "crypto-js";

//Function for getting the crypto secret key
function getSK(){
  //Gets from dotenv the secret key
  const cryptoSK = process.env.ENCRYPTION_KEY;

  //Verifies if the crypto secret key
  if(!cryptoSK) throw new Error("CryptoSecret Key not inserted");

  //Returns the secret key
  return cryptoSK;
}

//Function for decrypting
export function Decrypt(encryptedText: string){
  //Decrypts the texts, and then turns into a text with encoding
  const decrypted = CryptoJS.AES.decrypt(encryptedText, getSK()).toString(
    CryptoJS.enc.Utf8
  );

  //Returns the decrypted text
  return decrypted;
}

//Function for encrypting
export function Encrypt(text: string) {
  //Encrypts the text and then turns into a text type
  const encrypted = CryptoJS.AES.encrypt(text, getSK()).toString();

  //Returns the encrypted text
  return encrypted;
}