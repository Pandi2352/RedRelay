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
  ParseUuidPipe,
} from '../../common';
import { CreateHospitalDto, HospitalResponseDto, QueryHospitalsDto, UpdateHospitalDto } from './dto';
import { HospitalsService } from './hospitals.service';

@ApiTags('hospitals')
@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new hospital or blood bank' })
  @ApiEnvelopedResponse(HospitalResponseDto, { status: HttpStatus.CREATED })
  @ApiStandardErrors()
  create(@Body() dto: CreateHospitalDto): Promise<HospitalResponseDto> {
    return this.hospitalsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List hospitals with pagination and optional filters' })
  @ApiPaginatedResponse(HospitalResponseDto)
  @ApiStandardErrors()
  findAll(@Query() query: QueryHospitalsDto): Promise<PaginatedResult<HospitalResponseDto>> {
    return this.hospitalsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hospital details by ID' })
  @ApiEnvelopedResponse(HospitalResponseDto)
  @ApiStandardErrors()
  findById(@Param('id', ParseUuidPipe) id: string): Promise<HospitalResponseDto> {
    return this.hospitalsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update hospital information or verification' })
  @ApiEnvelopedResponse(HospitalResponseDto)
  @ApiStandardErrors()
  update(
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: UpdateHospitalDto,
  ): Promise<HospitalResponseDto> {
    return this.hospitalsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a hospital record' })
  @ApiStandardErrors()
  remove(@Param('id', ParseUuidPipe) id: string): Promise<void> {
    return this.hospitalsService.remove(id);
  }
}
