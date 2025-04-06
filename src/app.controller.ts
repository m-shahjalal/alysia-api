import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}
  @Get()
  getRoot() {
    return {
      name: 'Alysia Backend API',
      version: '1.0.0',
      message: 'Welcome to the Alysia Backend API',
      docs: `/docs`,
    };
  }

  @Get('ping')
  ping() {
    return {
      message: 'pong 🔔',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'healthy',
      uptime: `${process.uptime().toFixed(2)} seconds`,
      timestamp: new Date().toISOString(),
    };
  }
}
