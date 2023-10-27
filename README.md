# TT Chat
一款由 Go + Vue 构建的聊天系统

## 部署步骤
1. 安装docker，参考 https://docs.docker.com/engine/install/
2. 下载项目代码，进入项目目录
3. 复制.env.example 修改文件名为.env.prod.local
4. 修改变量`VUE_APP_API_BASE_URL`和`VUE_APP_WS_URL`，换成后端服务的地址
5. 执行 sudo ./deploy.sh