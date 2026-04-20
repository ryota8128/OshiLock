import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "node:fs";
import { env } from "../../config/env.js";

function initFirebase() {
  const serviceAccountJson = env.IS_LOCAL
    ? readFileSync(env.FIREBASE_SERVICE_ACCOUNT_PATH, "utf-8")
    : env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;
  return initializeApp({ credential: cert(serviceAccount) });
}

const app = initFirebase();

export const firebaseAuth = getAuth(app);
