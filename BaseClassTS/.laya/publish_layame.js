// v1.0.6
const ideModuleDir = global.ideModuleDir;
const workSpaceDir = global.workSpaceDir;

var Stream = require('stream');
//引用插件模块
const gulp = require(ideModuleDir + "gulp");
const fs = require("fs");
const path = require("path");
const del = require(ideModuleDir + "del");

let copyLibsTask = ["copyPlatformLibsJsFile"];
let versiontask = ["version2"];
let exec = require('child_process').exec;
let tsconfigPath = path.join(workSpaceDir, "tsconfig.json");
let isTS = fs.existsSync(tsconfigPath);

gulp.task("preCreate_LayaMe", copyLibsTask, function() {
	releaseDir = global.releaseDir;
	config = global.config;
	commandSuffix = global.commandSuffix;
});

gulp.task("del", ["preCreate_LayaMe"], function(cb) {
    let buildFolder = path.join(workSpaceDir, "build");
	if (!isTS || !fs.existsSync(buildFolder)) {
		return cb();
	}
	let delList = [`${buildFolder}/**`];
	del(delList, { force: true }).then(paths => {
		cb();
	}).catch((err) => {
		throw err;
	})
});

gulp.task("tsc", ["del"], function(cb) {
	if (!isTS) {
		return cb();
	}

	let tscPath = path.join(ideModuleDir, ".bin", `tsc${commandSuffix}`);
	return exec(`"${tscPath}" -p "${tsconfigPath}"`, {
		cwd: workSpaceDir,
		shell: true,
		encoding: "utf8"
	}, function(error, stdout, stderr) {
		if (error) console.log("error", error);
		if (stdout) console.log("stdout", stdout);
		if (stderr) console.log("stderr", stderr);
		cb();
	});
});
function getFolderList(rootPath, fileList, fileType, deep= 0) {
    if (!fs.existsSync(rootPath)) {
        return fileList;
    }
    let dirList = fs.readdirSync(rootPath);
    let fileName, fileFullPath;
    for (let i = 0, len = dirList.length; i < len; i++) {
        fileName = dirList[i];
        fileFullPath = path.join(rootPath, fileName);
        if (fs.statSync(fileFullPath).isDirectory()) {
            getFolderList(fileFullPath, fileList, fileType, deep + 1);
        } else {
            if (!!fileType && !fileFullPath.endsWith(fileType)) {
                continue;
            }
            fileList.push({path: fileFullPath,deep:deep});
        }
    }
}

// 将引入的库的路径改为src根目录的LayaMeMain,并且将引入的该类合并到最终发布目录的根目录下的LayaMeMain.js里

gulp.task("mergrToLayaMeMain", ["tsc"], function() {
	let source = "src";
	if (isTS) {
		source = "build";
	}
	let sourceFolder = path.join(workSpaceDir, source); 
	const scriptPath = path.join(sourceFolder, "script");
	let jsList= [];
	let scriptStrList = [];
	let filePath, fileCon, deep;  
	// 遍历所有的script，合并到LayaMeMain.js 
	jsList= [];
	scriptStrList = [];
 
	getFolderList(scriptPath, jsList, ".js");
	for (let i = 0, len = jsList.length; i < len; i++) {
		filePath = jsList[i].path;
		fileCon = fs.readFileSync(filePath, "utf8"); 
		scriptStrList.push(fileCon);
	}           
	let layaMeMainStr = '';  
	const layaMeMainPath = path.join(sourceFolder, "LayaMeMain.js");
	if (fs.existsSync(layaMeMainPath)) { 
		layaMeMainStr = fs.readFileSync(layaMeMainPath, "utf8");
	}
	if (scriptStrList.length > 0) {
		let scriptStrAll = scriptStrList.join('\n');
		layaMeMainStr = scriptStrAll + layaMeMainStr;
	}       	
	if (layaMeMainStr) { 
		// console.log(jsList.length,'layaMeMainStr' , layaMeMainStr);
		layaMeMainStr = layaMeMainStr.replace(/import/mg, "// import");
		fs.writeFileSync(`${releaseDir}/LayaMeMain.js`, layaMeMainStr, "utf8");
	} 
});
// 修改extends Laya.Script3D 为 extends Script3D
// 修改 config.json，把.ts替换为.js
function commentImport (str){
	
	str = str.replace(/import/mg, "// import"); 	
	return str;
}
function changeComponentsFile() {
    var stream = new Stream.Transform({ objectMode: true });
	let source = "src";
	if (isTS) {
		source = "build";
	}
	let sourceFolder = path.join(workSpaceDir, source); 
	const scriptPath = path.join(sourceFolder, "script");
	const componentsPath = path.join(sourceFolder, "components"); 
	const actionScriptPath = path.join(sourceFolder, "actionScript", "actionFunc.js"); 
	const uiScriptPath = path.join(sourceFolder, "uiScript"); 
	let importPathList = [scriptPath, componentsPath, actionScriptPath, uiScriptPath];
    stream._transform = function (originalFile, unused, callback) {
        let fPath = originalFile.path; 
		let file = null;
		const getFile = () => {
			if (!file) {
				file = originalFile.clone({ contents: false });
			}
			return file;
		}
		// console.log('fPth', fPath, componentsPath);
		// 注释import
		for(let k =0; k <importPathList.length; k ++) {
			let _path = importPathList[k];
			if (fPath.startsWith(_path)) { 
				file = getFile();
				let stringData = String(file.contents); 
				stringData = commentImport(stringData);
				let finalBinaryData = Buffer.from(stringData);
				file.contents = finalBinaryData;
			}
		}
        if (fPath.indexOf('components') >= 0) {
			if ( fPath.endsWith('.js')) { 
				file = getFile();
				let stringData = String(file.contents); 
				stringData = stringData.replace(/extends\s+[Laya.Script3D\.]+\s*{/mg, "extends Laya.Script {");
				let finalBinaryData = Buffer.from(stringData);
				file.contents = finalBinaryData;
			 
			} else  if (fPath.endsWith('config.json')) { 
				file = getFile();
				let stringData = String(file.contents); 
				stringData = stringData.replace(/.ts\"/mg, '.js"');
				let finalBinaryData = Buffer.from(stringData);
				file.contents = finalBinaryData; 
			} 
        } 
		if (file) {
			callback(null, file); 
		} else {
			callback(null, originalFile);
		}
    }; 
    return stream;
}
gulp.task("copy", ["mergrToLayaMeMain"], function() {
	let source = "src";
	if (isTS) {
		source = "build";
	}
	let sourceFolder = path.join(workSpaceDir, source);
	let filters = [
		`${sourceFolder}/{uiScript/**/*.*,actionScript/**/*.*,components/**/*.*}` 
	];
	if (isTS) { 
		filters.push(
			`${workSpaceDir}/src/{uiScript/**/!(*.ts),actionScript/**/!(*.ts),components/**/!(*.ts)}`
		); 
	} 
	return gulp.src(filters)
	.pipe(changeComponentsFile())
	.pipe(gulp.dest(releaseDir));
});


gulp.task("buildLayaMeProj", versiontask, function() {
	console.log("all tasks completed");
});