import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor() {}
  @Get()
  @ApiOperation({ summary: 'Get API root' })
  getRoot() {
    return {
      name: 'Alysia Backend API',
      version: '1.0.0',
      message: 'Welcome to the Alysia Backend API',
      docs: `/docs`,
    };
  }

  @Get('ping')
  @ApiOperation({ summary: 'Ping the server' })
  @HttpCode(HttpStatus.OK)
  ping() {
    return { message: 'pong 🔔', timestamp: new Date().toISOString() };
  }

  @Get('health')
  @ApiOperation({ summary: 'Check server health' })
  @HttpCode(HttpStatus.OK)
  getHealth() {
    return {
      status: 'healthy',
      uptime: `${process.uptime().toFixed(2)} seconds`,
      timestamp: new Date().toISOString(),
    };
  }
}
