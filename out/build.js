"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cp = require("child_process");
var fs = require("fs-extra");
var path = require("path");
function buildProject(callback) {
    var projectPath = process.cwd();
    executeCommand("tsc", ["-p", projectPath], callback);
}
exports.buildProject = buildProject;
function buildEngine(callback) {
    var projectPath = process.cwd(); //返回运行当前脚本的工作目录的路径
    var configFile = path.join(projectPath, "angel.json"); //engine-test-game文件中
    var config = fs.readJSONSync(configFile);
    var enginePath = config.engine;
    executeCommand("tsc", ["-p", enginePath], function () {
        //找到运行该项目的父目录目录的engine文件夹,将engine中的out文件夹内容复制到运行该项目的engine文件夹中
        var source = path.join(enginePath, "out");
        var target = path.join(projectPath, 'angel');
        fs.copy(source, target, callback);
    });
}
exports.buildEngine = buildEngine;
function executeCommand(command, args, callback) {
    var child_process = cp.exec(command, args);
    child_process.stdout.addListener("data", function (data) {
        console.log(data.toString());
    });
    child_process.stderr.addListener("data", function (data) {
        console.log(data.toString());
    });
    child_process.addListener("close", function () {
        callback();
    });
}
function buildAll() {
    buildEngine(function () {
        buildProject(function () {
        });
    });
}
exports.buildAll = buildAll;
//# sourceMappingURL=build.js.map