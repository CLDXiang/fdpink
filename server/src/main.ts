import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'body-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module';
import { DEV_GUARD_ALLOW_ACCESS } from './utils/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // see https://github.com/expressjs/cors#configuration-options
    cors: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Danke 的 APIs')
    .setDescription(
      '这里列出了 fdpink 后端所用到的 api 接口和他们的参数，定位到具体的 API 可以方便地进行调试。 新的 api 会被自动添加到本页面, 已按照模块进行分类，未分类的都在 default',
    )
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('lectures')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  if (DEV_GUARD_ALLOW_ACCESS) {
    SwaggerModule.setup('api', app, document);
  }

  if (DEV_GUARD_ALLOW_ACCESS) {
    // see https://stackoverflow.com/questions/19917401/error-request-entity-too-large
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ limit: '50mb', extended: true }));
  }

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.listen(3000);
}
bootstrap();
