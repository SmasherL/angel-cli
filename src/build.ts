import * as cp from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';

export function buildProject(callback: () => void) {

    let projectPath = process.cwd();
    executeCommand("tsc", ["-p", projectPath], callback);
}

export function buildEngine(callback: () => void) {

    let projectPath = process.cwd();//返回运行当前脚本的工作目录的路径
    let configFile = path.join(projectPath, "angel.json");//angel-test-game文件中
    let config = fs.readJSONSync(configFile);
    let enginePath = config.engine;

    executeCommand("tsc", ["-p", enginePath], () => {
        //找到运行该项目的父目录目录的angel文件夹,将angel中的out文件夹内容复制到运行该项目的angel文件夹中
        let source = path.join(enginePath, "out");
        let target = path.join(projectPath, 'angel');
        fs.copy(source, target, callback);
    });
}

function executeCommand(command: string, args: string[], callback: () => void) {
    let child_process = cp.exec(command, args);
    child_process.stdout.addListener("data", data => {
        console.log(data.toString())
    })
    child_process.stderr.addListener("data", data => {
        console.log(data.toString())
    })
    child_process.addListener("close", () => {
        callback();
    })
}

export function buildAll() {
    buildEngine(function () {//编译引擎
        buildProject(function () {//编译项目

        });
    });
}