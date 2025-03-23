import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EUserRole } from '../../users/types/user.enum';
import { AuthGuard } from '../guards/auth.guard';

export const BearerTokenAuth = (...roles: EUserRole[]) => {
  let description = `**Allowed roles:** \`${roles.join('\`, \`')}\``;

  if (roles.length <= 0) {
    description = `**Allowed roles:** \`${Object.values(EUserRole).join('\`, \`')}\``;
  }

  return applyDecorators(
    ApiOperation({ description }, { overrideExisting: true }),
    SetMetadata('roles', roles),
    ApiBearerAuth(),
    UseGuards(AuthGuard),
  );
};
