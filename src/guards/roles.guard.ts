import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRoles } from 'src/auth/schemas/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const userId = request.user.id;
    const userRole = request.user.role;

    if (!userId || userRole !== UserRoles.ADMIN) {
      return false;
    }

    return true;
  }
}
