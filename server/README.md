[toc]

## 安装依赖


```bash
$ yarn
```

## 运行项目

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## 测试

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## 项目结构

如下简单介绍 Danke 项目的组织形式，\* 表示 gitignore

```
Danke
└───.vscode # 关于 VSCode 的项目配置文件，需要保留 eslint 的配置，具体信息可以参见 docs 中的参与开发文档
|
└───dist* # build 生成的编译后的代码
└───docs # 项目文档
└───node_modules* # yarn install 安装的项目依赖包
|
└───src # 项目功能代码
│   └───auth # 负责用户注册、登陆、修改密码等的模块
│   └───entities # 通过 TypeORM 操作数据库的对象（每一个 class 都对应数据库中的一张表单）
│   └───mail # 负责发送邮件的模块
│   └───user # 获取用户信息的模块
│   └───utils # 公用模块
|
└───test # 项目测试代码
└───views # 发送邮件时的样式模板
│   └───mail
|
│   .eslintrc.js # eslint 配置文档
│   .gitignore
│   .prettierignore # 记录 pretteir 不用检查的文件
│   .prettierrc # pretteir 的配置文档
│   nest-cli.json
|	ormconfig.json # TypeORM 的配置参数，migrations 依赖于此
│   package-lock.json
│   package.json # 项目依赖管理
│   README.md # 本文档
│   tsconfig.build.json
│   tsconfig.json
```

## 前端对接

- 当从 Github 拉下其他协作者的 commit 中有新的 migration 引入时，请通过如下方式同步数据库

  `yarn build && yarn typeorm migration:run` 。

- 目前后端引入了 swagger 用以替代 Swagger 和 mock，`yarn start:dev` 启动项目后，可在 http://localhost:3000/api/#/ 访问。

