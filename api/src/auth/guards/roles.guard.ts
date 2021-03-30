import { Observable } from 'rxjs';
import { User } from '../../User/models/user.interface';
import { map } from 'rxjs/operators';
import { UserService } from './../../user/service/user.service';

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SimpleConsoleLogger } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    //console.log(request);
    const user: User = request.user.user;

    return this.userService.findOne(user.id).pipe(
      map((user: User) => {
        const hasRole = () => roles.indexOf(user.role) > -1;
        let hasPermission: boolean = false;
        if (hasRole()) {
          // console.log('has role true');
          hasPermission = true;
        }
        return user && hasPermission;
      }),
    );
    // console.log(user);
    // return true;
  }
}
