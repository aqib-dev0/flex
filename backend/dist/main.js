"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.enableCors();
    const port = process.env.PORT || 3001;
    try {
        await app.listen(port);
        console.log(`Application is running on: ${await app.getUrl()}`);
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === 'EADDRINUSE') {
            const fallbackPort = parseInt(port.toString()) + 1000;
            console.log(`Port ${port} is already in use, trying port ${fallbackPort} instead...`);
            await app.listen(fallbackPort);
            console.log(`Application is running on: ${await app.getUrl()}`);
        }
        else {
            throw error;
        }
    }
}
bootstrap();
//# sourceMappingURL=main.js.map