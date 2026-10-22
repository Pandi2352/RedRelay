import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiEnvelopedResponse,
  ApiPaginatedResponse,
  ApiStandardErrors,
  type PaginatedResult,
  ParseObjectIdPipe,
} from '../../common';
import {
  CreateRequestDto,
  QueryRequestsDto,
  RequestResponseDto,
  UpdateRequestDto,
} from './dto';
import { RequestsService } from './requests.service';

@ApiTags('requests')
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Post an urgent blood request' })
  @ApiEnvelopedResponse(RequestResponseDto, { status: HttpStatus.CREATED })
  @ApiStandardErrors()
  create(@Body() dto: CreateRequestDto): Promise<RequestResponseDto> {
    return this.requestsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List blood requests with pagination and filters' })
  @ApiPaginatedResponse(RequestResponseDto)
  @ApiStandardErrors()
  findAll(@Query() query: QueryRequestsDto): Promise<PaginatedResult<RequestResponseDto>> {
    return this.requestsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get blood request details by ID' })
  @ApiEnvelopedResponse(RequestResponseDto)
  @ApiStandardErrors()
  findById(@Param('id', ParseObjectIdPipe) id: string): Promise<RequestResponseDto> {
    return this.requestsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update request status or metadata' })
  @ApiEnvelopedResponse(RequestResponseDto)
  @ApiStandardErrors()
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateRequestDto,
  ): Promise<RequestResponseDto> {
    return this.requestsService.update(id, dto);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Atomically confirm one unit for this request' })
  @ApiEnvelopedResponse(RequestResponseDto)
  @ApiStandardErrors()
  confirmUnit(@Param('id', ParseObjectIdPipe) id: string): Promise<RequestResponseDto> {
    return this.requestsService.confirmUnit(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a blood request' })
  @ApiStandardErrors()
  remove(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    return this.requestsService.remove(id);
  }
}
