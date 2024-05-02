# WebpackTS

install.bat 下载全局命令依赖工具模块

modules.bat 下载依赖模块，下载模块具体见package.json文件

build.bat 编译（检查代码文件更新后编译）

server.bat 启动webpack服务，具体配置见webpack.config.js文件

webpack.config.js webpack配置文件

index.ts 文件是启动开始检测主文件，webpack解决类之间依赖关系引入文件从这里开始

# 使用步骤

1、如果没有下载typesctipt和webpack工具，先运行install.bat

2、下载依赖包node_modules，运行modules.bat

3、运行build.bat和server.bat

4、打开浏览器访问localhost:8888

具体了解可查看对应文件配置和运行后结果

注：目前是为layaair项目准备，如有需要可以稍作修改做在其他项目中使用
