import dotenv from "dotenv";
dotenv.config();

interface IEnvVars {
  NODE_ENV: string;
  PORT: string;
  DB_URL: string;
}

const envVarsKeys = ["NODE_ENV", "PORT", "DB_URL"];

const envVars = {} as IEnvVars;
const missingEnvs: string[] = [];

envVarsKeys.forEach((key) => {
  const value = process.env[key];
  if (value) {
    envVars[key as keyof IEnvVars] = value;
  } else {
    missingEnvs.push(key);
  }
});

// Showing missing envs
const blue = (s: string) => `\x1b[34m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;

if (missingEnvs.length > 0) {
  const err =
    "\n================================\n" +
    yellow(" Missing") +
    " environment variables:" +
    "\n" +
    missingEnvs
      .map((k) => `    ${blue(k)}: ${yellow("undefined")}`)
      .join("\n") +
    "\n================================\n";
  throw new Error(err);
}

export default envVars;
