import {
  Controller,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
  Body,
  Put,
  BadRequestException,
  Patch,
  Inject,
} from '@nestjs/common';
import { MailTemplateType } from 'src/mail/template';
import { MailService } from 'src/mail/mail.service';
import { MAIL_VERIFICATION_ENABLED } from 'src/utils/config';
import { UserService } from 'src/user/user.service';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DevGuard } from 'src/utils/dev.guard';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthService } from './auth.service';
import { MailDto } from './dto/mail.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { HttpStatus, ConflictException } from '@nestjs/common';
import { mailRegex } from '../mail/template';
import { JwtMailVerifyDto } from './dto/jwt-mail-verify.dto';
import { JwtRetDto } from './dto/jwt-ret.dto';
import { ResetMailDto } from './dto/reset-mail.dto';
import { RoleType } from 'src/entities/user';
import { LoginDto } from './dto/login.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ElearningVerifyDto } from './dto/elearning-verify.dto';
import { SucceedDto } from './dto/succeed.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: Logger,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ description: '邮箱验证测试', type: LoginDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: JwtRetDto,
  })
  async login(@Request() req) {
    // local.strategy.ts handles the login, and authService only needs to sign the JWT
    return this.authService.sign(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('jwt/mail')
  @ApiBearerAuth('JWT')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SucceedDto,
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: '1.该邮箱地址申请了太多验证码，请检查邮箱或者耐心等待邮件\n2.系统繁忙中，请稍后再试',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '1.验证需绑定复旦学邮\n2.该学邮已激活\n3.已验证通过',
  })
  async sendJwtMail(@Request() req) {
    if (req.user.activated) {
      this.loggerService.warn(`user ${req.user.id} sendJwtMail after validation`);
      throw new ConflictException('已验证通过');
    }
    const user = await this.userService.findUserById(req.user.id);
    if (user.email.search(mailRegex) === -1) {
      this.loggerService.warn(`user ${req.user.id} sendJwtMail without valid email`);
      throw new ConflictException('验证需绑定复旦学邮');
    }
    const isActivated = await this.mailService.isActivated(user.email);
    if (isActivated) {
      this.loggerService.error(`user ${req.user.id} sendJwtMail after activation`);
      throw new ConflictException('该学邮已激活');
    }
    // requestVerification 已经实现了对于同一个邮箱地址不允许发送过多验证邮件，所以需要限制的是朝不同的邮箱发验证，这个需要结合 ip 地址和 mac 地址来限制
    await this.mailService.requestVerification(MailTemplateType.Activate, user.email);
  }

  @UseGuards(DevGuard)
  @Post('test-mail')
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: '1.该邮箱地址申请了太多验证码，请检查邮箱或者耐心等待邮件\n2.系统繁忙中，请稍后再试',
  })
  @ApiBody({ description: '邮箱验证测试', type: MailDto })
  async testMail(@Body(new ValidationPipe()) mail: MailDto) {
    await this.mailService.requestVerification(mail.type, mail.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('elearning-verify')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SucceedDto,
  })
  @ApiBearerAuth('JWT')
  async elearningVerify(@Body(new ValidationPipe()) dto: ElearningVerifyDto, @Request() req) {
    return this.authService.elearningVerify(dto.token, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('jwt/verify')
  @ApiBearerAuth('JWT')
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '1.验证需绑定复旦学邮\n2.该学邮已激活\n3.已验证通过',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码错误，或者已经失效',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: JwtRetDto,
  })
  @ApiBody({ description: '邮箱验证', type: JwtMailVerifyDto })
  async jwtVerify(@Body(new ValidationPipe()) mail: JwtMailVerifyDto, @Request() req) {
    if (req.user.activated) {
      this.loggerService.warn(`user ${req.user.id} jwtVerify after validation`);
      throw new ConflictException('已验证通过');
    }
    const user = await this.userService.findUserById(req.user.id);
    if (user.email.search(mailRegex) === -1) {
      this.loggerService.warn(`user ${req.user.id} jwtVerify without valid email`);
      throw new ConflictException('验证需绑定复旦学邮');
    }
    const isActivated = await this.mailService.isActivated(user.email);
    if (isActivated) {
      this.loggerService.error(`user ${req.user.id} jwtVerify after activation`);
      throw new ConflictException('该学邮已激活');
    }
    if (MAIL_VERIFICATION_ENABLED) {
      const success = await this.mailService.verify(user.email, mail.code.toString());
      if (!success) {
        this.loggerService.warn(`user ${req.user.id} jwtVerify fails due to code or timeout`);
        throw new BadRequestException('验证码错误，或者已经失效');
      }
    }
    await this.userService.activateById(user.id);
    user.role = RoleType.Activated;
    return this.authService.sign(user);
  }

  @Post('register')
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '用户名或邮箱已经被占用',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SucceedDto,
  })
  @ApiBody({ description: '用户注册', type: RegisterDto })
  async register(@Body(new ValidationPipe()) regd: RegisterDto) {
    await this.authService.register(
      regd.name,
      regd.email,
      regd.password, // 靠HTTPS加密
    );
  }

  @Post('mail')
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: '1.该邮箱地址申请了太多验证码，请检查邮箱或者耐心等待邮件\n2.系统繁忙中，请稍后再试',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SucceedDto,
  })
  @ApiBody({ description: '通用邮箱验证', type: MailDto })
  async sendMail(@Body(new ValidationPipe()) mail: MailDto) {
    await this.mailService.requestVerification(mail.type, mail.email);
  }

  @Put('mail')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码错误，或者已经失效',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SucceedDto,
  })
  @ApiBody({ description: '修改邮箱', type: ResetMailDto })
  async resetMail(@Body(new ValidationPipe()) dto: ResetMailDto) {
    const user = await this.userService.findUserByNameOrMail(dto.oldEmail);
    if (MAIL_VERIFICATION_ENABLED) {
      const success = await this.mailService.verify(dto.oldEmail, dto.code.toString());
      if (!success) {
        this.loggerService.warn(`user ${user.id} resetMail fails due to code or timeout`);
        throw new BadRequestException('验证码错误，或者已经失效');
      }
    }
    return this.authService.resetMail(user.id, dto.newEmail);
  }

  // forget password and then change through mail verification
  @Put('password')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码错误，或者已经失效',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SucceedDto,
  })
  @ApiBody({ description: '忘记密码', type: ResetPasswordDto })
  async resetPassword(@Body(new ValidationPipe()) dto: ResetPasswordDto) {
    const user = await this.userService.findUserByNameOrMail(dto.email);
    if (MAIL_VERIFICATION_ENABLED) {
      const success = await this.mailService.verify(dto.email, dto.code.toString());
      if (!success) {
        this.loggerService.warn(`user ${user.id} resetPassword fails due to code or timeout`);
        throw new BadRequestException('验证码错误，或者已经失效');
      }
    }
    return this.authService.resetPassword(user.id, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  @ApiBearerAuth('JWT')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '旧密码错误',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SucceedDto,
  })
  @ApiBody({ description: '修改密码', type: ChangePasswordDto })
  async changePassword(@Body(new ValidationPipe()) dto: ChangePasswordDto, @Request() req) {
    return this.authService.changePassword(req.user.id, dto.oldPassword, dto.newPassword);
  }
}
