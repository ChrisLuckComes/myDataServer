# myDataServer
数据服务器

1.安装Express 
npm install Express

#命令行创建并进入目录
mkdir myServer
cd myServer

#输入项目名 不输入直接当前目录部署
express name 

#安装依赖文件
npm install

#添加路由文件
#routes 目录下新建文件getExchangeRate.js
#引入router
const express = require('express');
const router = express.Router();

#在此处处理get请求
router.get('/', (req, res, next) => {
    res.send('...anything you want')
})

#再到app.js中添加该router
#引入文件
var getExchangeRate = require('./routes/getExchangeRate');

#监听该路径
app.use('/getExchangeRate',getExchangeRate);

#运行
npm start

#浏览器输入localhost:3000/getExchangeRate 页面输出...anything you want
#done


