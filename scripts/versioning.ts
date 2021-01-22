const childProcess = require("child_process");
const fs = require("fs");

function writeToEnv(key: string = "", value: string = "") {
    const empty = key === "" && value === "";

    if (empty) {
        fs.writeFile(".env.local", "", () => {});
    } else {
        fs.appendFile(".env.local", `${key}='${value.trim()}'\n`, (err: Error | null) => {
            if (err) console.log(err);
        });
    }
}

// reset .env file
writeToEnv();


childProcess.exec("git rev-parse --abbrev-ref HEAD", (err: Error | null, stdout: string) => {
    writeToEnv("REACT_APP_VERSION_BRANCH", stdout);
});
childProcess.exec("git rev-parse HEAD", (err: Error| null, stdout: string) => {
    writeToEnv("REACT_APP_DEV_VERSION", stdout);
});
childProcess.exec("grep 'shared' yarn.lock | grep -o -E -e '[0-9a-f]{40}'", (err: Error| null, stdout: string) => {
    writeToEnv("REACT_APP_DEV_SHARED_VERSION", stdout);
});


