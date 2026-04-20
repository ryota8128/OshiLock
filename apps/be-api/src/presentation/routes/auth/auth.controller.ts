import { Hono } from "hono";
import { signIn } from "../../../application/use-cases/sign-in.js";
import { validate } from "../../middleware/validate.js";
import { signInRequestSchema } from "./auth-request.schema.js";

const auth = new Hono();

auth.post("/signin", validate({ body: signInRequestSchema }), async (c) => {
  const { idToken } = c.get("validated");
  const result = await signIn(idToken);
  return c.json(result);
});

export { auth };
