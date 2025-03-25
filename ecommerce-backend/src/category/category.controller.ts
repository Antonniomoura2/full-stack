import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './category.dto';
import { Category } from './category.schema';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOneById(id);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: CreateCategoryDto,
  ): Promise<Category | null> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.categoryService.delete(id);
  }
}
