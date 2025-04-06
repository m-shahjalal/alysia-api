import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AppLogger } from 'src/global/logger/logger.service';
import { JwtAuthGuard } from 'src/global/guards/jwt-auth.guard';
import { ReqContext } from 'src/global/request/req-context.decorator';
import { RequestContext } from 'src/global/request/request-context.dto';
import { User } from './user.entity';
import { BaseApiResponse } from 'src/global/request/base-api-response.dto';
import { CreateUserDto } from './create-user.dto';
import { PaginationParamsDto } from 'src/global/request/pagination-params.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(UserController.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyProfile(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<User>> {
    const user = await this.userService.findById(ctx.user!.id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  async createUser(
    @ReqContext() ctx: RequestContext,
    @Body() createUserDto: CreateUserDto,
  ): Promise<BaseApiResponse<User>> {
    const user = await this.userService.create(createUserDto);
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      data: user,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
    type: User,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Users not found' })
  async getUsers(
    @ReqContext() ctx: RequestContext,
    @Query() query: PaginationParamsDto,
  ): Promise<BaseApiResponse<{ users: User[]; count: number }>> {
    const { limit = 10, offset = 0 } = query;
    const { users, count } = await this.userService.getUsers(
      ctx,
      limit,
      offset,
    );
    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(count / limit);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: { users, count },
      meta: { page, limit, total: count, totalPages },
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  async getUserById(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
  ): Promise<BaseApiResponse<User>> {
    const user = await this.userService.findById(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User updated', type: User })
  async updateUser(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
    @Body() updateData: Partial<User>,
  ): Promise<BaseApiResponse<User>> {
    const user = await this.userService.update(id, updateData);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: user,
    };
  }
}
