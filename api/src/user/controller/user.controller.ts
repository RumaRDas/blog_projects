import { RolesGuard } from './../../auth/guards/roles.guard';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User, UserRole } from '../models/user.interface';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() user: User): Observable<User | Object> {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError((err) => of({ error: err.message })),
    );
  }
  @Post('login')
  login(@Body() user: User): Observable<Object> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      }),
    );
  }

  @Get(':id')
  findOne(@Param() params): Observable<User> {
    return this.userService.findOne(params.id);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Observable<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;

    return this.userService.paginate({
      page: Number(page),
      limit: Number(limit),
      route: 'http://localhost:3000/api/user',
    });
  }

  @Get('search/by/username/:username')
  findAllByUsername(
    @Param('username') username: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ): Observable<Pagination<User>> {
    return this.userService.paginateFilterByUsername(
      {
        page: Number(page),
        limit: Number(limit),
        route: `http://localhost:3000/api/user/search/by/username/${username}`,
      },
      { username },
    );
  }
  // @Get()
  // index(
  //   @Query('page') page: number = 1,
  //   @Query('limit') limit: number = 10,
  //   @Query('username') username: string,
  // ): Observable<Pagination<User>> {
  //   limit = limit > 100 ? 100 : limit;
  //   console.log(username);
  //   if (username === null || username === undefined) {
  //     return this.userService.paginate({
  //       page: Number(page),
  //       limit: Number(limit),
  //       route: 'http://localhost:3000/api/user',
  //     });
  //   } else {
  //     return this.userService.paginateFilterByUsername(
  //       {
  //         page: Number(page),
  //         limit: Number(limit),
  //         route: 'http://localhost:3000/api/user',
  //       },
  //       { username },
  //     );
  //   }
  // }

  @Delete(':id')
  deleteOne(@Param('id') id: string): Observable<any> {
    return this.userService.deleteOne(Number(id));
  }
  @Put(':id')
  updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
    return this.userService.updateOne(Number(id), user);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  updateRoleOfUser(
    @Param('id') id: string,
    @Body() user: User,
  ): Observable<User> {
    return this.userService.updateRoleOfUser(Number(id), user);
  }
}
