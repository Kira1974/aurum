"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const envs_config_1 = require("./config/envs.config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: common_1.VersioningType.URI });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true
    }));
    await app.listen(envs_config_1.envs.port);
    logger.log(`Application is running on: localhost:${envs_config_1.envs.port}`);
}
if (require.main === module) {
    void bootstrap();
}
//# sourceMappingURL=main.js.map