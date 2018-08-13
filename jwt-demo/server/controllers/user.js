const crypto = require('crypto'),
    jwt = require('jsonwebtoken'),
    userModel = require('../models/userModel.js');

class UserController {
    // 用户注册
    static async register(ctx) {
        const data = ctx.request.body;
        const checkUser = await userModel.findOne({
            name: data.name
        });
        if(checkUser !== null){
            return ctx.sendError('000002', '该用户名已存在');
        }
        const user = new userModel({
            name: data.name,
            password: crypto.createHash('md5').update(data.password).digest('hex'),     // 密码加密存储
            email: data.email
        })
        const result = await user.save();
        return result !== null ? ctx.send(null, '注册成功') : ctx.sendError('000002', '注册失败');
    }
    // 用户登录
    static async login(ctx) {
        const data = ctx.request.body;
        if(!data.name || !data.password){
            return ctx.sendError('000002', '参数不合法');
        }
        const result = await userModel.findOne({
            name: data.name,
            password: crypto.createHash('md5').update(data.password).digest('hex')
        })
        if(result !== null){
            const token = jwt.sign({
                name: result.name,
                _id: result._id
            }, 'my_token', { expiresIn: 60*60 });
            return ctx.send(token, '登录成功');
        }else{
            return ctx.sendError('000002', '用户名或密码错误');
        }
    }
    // 获取用户信息
    static async userinfo(ctx){
        const data = ctx.state.user;
        const user = await userModel.findById(data._id);

        if(user !== null){
            const result = {
                _id: user._id,
                name: user.name,
                email: user.email
            };
            return ctx.send(result);
        }else{
            return ctx.sendError('000002');
        }
    }
}

module.exports = UserController;