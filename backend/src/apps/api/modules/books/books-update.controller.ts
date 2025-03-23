import { Controller, Delete, Post, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BearerTokenAuth } from '../auth/decorators/bearer-token-auth.decorator';
import { EUserRole } from '../users/types/user.enum';

@Controller('books-updates')
@ApiTags('books / update proposals')
@ApiBearerAuth()
export class BooksUpdateController {
  constructor() {}

  @Post('propose-update')
  @ApiOperation({ summary: 'Publish update proposals for a book by ID' })
  @BearerTokenAuth()
  async publishUpdateProposals() {}

  @Put(':proposalId')
  @ApiOperation({ summary: 'Update an "update proposal" for a book by ID' })
  @ApiParam({ name: 'proposalId' })
  @BearerTokenAuth()
  async updateUpdateProposal() {}

  @Delete(':proposalId')
  @ApiOperation({ summary: 'Delete an update proposal for a book by ID' })
  @ApiParam({ name: 'proposalId' })
  @BearerTokenAuth()
  async deleteUpdateProposal() {}

  @Post('accept-update')
  @ApiOperation({ summary: 'Accept update proposals for a book by ID' })
  @BearerTokenAuth(EUserRole.ADMIN)
  async acceptUpdateProposals() {}

  @Post('reject-update')
  @ApiOperation({ summary: 'Reject update proposals for a book by ID' })
  @BearerTokenAuth(EUserRole.ADMIN)
  async rejectUpdateProposals() {}
}
