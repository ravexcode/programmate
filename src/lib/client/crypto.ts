import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

//Checks crypto key
function getCryptoPass() {
  //Verifies if exists
  if(process.env.NEXT_PUBLIC_CRYPTO_PASS) {
    //Returns the key
    return process.env.NEXT_PUBLIC_CRYPTO_PASS;
  }

  //Error if there's no crypto sk
  throw new Error("Cypto JavaScript password not found");
}

export function ClientEncrypt(text: string): string {
  return AES.encrypt(text, getCryptoPass()).toString();
}

export function ClientDecrypt(encrypted: string): string {
  const bytes = AES.decrypt(encrypted, getCryptoPass());
  return bytes.toString(Utf8);
}