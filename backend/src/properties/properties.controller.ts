import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { PropertiesService } from './properties.service';

@Controller('api/properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  /**
   * Get all properties
   * @returns Array of properties
   */
  @Get()
  async getAllProperties() {
    try {
      return await this.propertiesService.getAllProperties();
    } catch (error) {
      throw new HttpException(
        error || 'Failed to fetch properties',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get a specific property by ID
   * @param id Property ID
   * @returns Detailed property information
   */
  @Get(':id')
  async getPropertyById(@Param('id') id: string) {
    try {
      return await this.propertiesService.getPropertyById(id);
    } catch (error) {
      throw new HttpException(
        error || 'Failed to fetch property',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
