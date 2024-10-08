import {
  Controller,
  Post,
  Request,
  Get,
  Param,
  Body,
  Patch,
} from '@nestjs/common';
import { RequestService } from './request.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { GeneratePdfDto } from './dto/generate-pdf.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@ApiTags('requests')
@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @ApiOperation({
    description:
      'Retorna todas as solicitações de declarações realizadas. Apenas o usuário com privilégio de administrador pode visualizar as solicitações.',
  })
  @ApiBearerAuth('access-token')
  @Get()
  async getRequests(@Request() req) {
    return this.requestService.getRequests(req.user.sub);
  }

  @ApiOperation({
    description:
      'Permite que um usuário solicite a geração de uma nova declaração. O usuário deve estar autenticado para fazer a solicitação e não deve ser um admin.',
  })
  @ApiParam({
    name: 'declarationId',
    type: 'string',
    description: 'ID da declaração',
  })
  @ApiBearerAuth('access-token')
  @Post('create/:declarationId')
  async createRequest(@Request() req, @Param() param) {
    return this.requestService.createRequest(param.declarationId, req.user.sub);
  }

  @ApiOperation({
    description:
      'Retorna todas as solicitações de declarações realizadas pelo usuário logado. Apenas o próprio usuário autenticado pode visualizar suas solicitações, proporcionando um histórico completo de suas declarações.',
  })
  @ApiBearerAuth('access-token')
  @Get('my-requests')
  async getUserRequests(@Request() req) {
    return this.requestService.getRequestsByUser(req.user.sub);
  }

  @ApiOperation({
    summary: 'Geração de declarações em PDF',
    description:
      'Permite a geração de declarações em formato PDF. Somente usuários com privilégios de administradores podem realizar esta ação.',
  })
  @ApiBody({ type: GeneratePdfDto, description: 'Request body.' })
  @ApiBearerAuth('access-token')
  @Post('/generate-pdf')
  async update(@Body() generatePdfDto: GeneratePdfDto, @Request() req) {
    return this.requestService.generatePdf(req.user.sub, generatePdfDto);
  }

  @ApiOperation({
    summary: 'Atualizar status das solicitações',
    description:
      'Permite a alteração do status de uma ou mais solicitações, podendo ser completada ou rejeitada.',
  })
  @Patch('update-status')
  async updateRequestStatus(
    @Body() updateStatusDto: UpdateStatusDto,
    @Request() req,
  ) {
    return this.requestService.updateStatus(req.user.sub, updateStatusDto);
  }
}
