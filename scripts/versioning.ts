const childProcess = require("child_process");
const fs = require("fs");

/**
 * Clear .env.local.
 */
async function clearEnv() {
    await new Promise<void>((resolve: Function, reject) =>
        fs.writeFile(".env.local", "", (err: Error | null) => {
            if (err) reject(err);
            resolve();
        })
    );
}

/**
 * Add an environment variable entry to .env.local.
 *
 * @param key - the variable key.
 * @param value - the variable value.
 */
async function writeToEnv(key: string, value: string) {
    const entry = `${key}='${value.trim()}'\n`;
    await new Promise<void>((resolve, reject) =>
        fs.appendFile(".env.local", entry, (err: Error | null) => {
            if (err) reject(err);
            resolve();
        })
    );
}

/**
 * Execute a command, returning stdout.
 *
 * @param command - the command to execute.
 * @returns the stdout of the command.
 */
async function exec(command: string): Promise<string> {
    return await new Promise((resolve, reject) =>
        childProcess.exec(command, (err: Error | null, stdout: string) => {
            if (err) reject(err);
            resolve(stdout);
        })
    );
}

/**
 * Write environment variables to .env.local
 */
async function main() {
    await clearEnv();
    await writeToEnv("REACT_APP_NAME", "$npm_package_name");
    await writeToEnv("REACT_APP_VERSION", "$npm_package_version");
}

main().catch(console.error);
