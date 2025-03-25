import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.schema';
import { CreateCategoryDto } from './category.dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly productService: ProductService,
  ) {}

  async findOneById(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const createdCategory = new this.categoryModel(createCategoryDto);
      return createdCategory.save();
    } catch (error) {
      throw new HttpException('Erro ao criar produto', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async update(
    id: string,
    updateCategoryDto: CreateCategoryDto,
  ): Promise<Category | null> {
    return this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
    const category = await this.categoryModel.findById(id).exec();

    if (!category) {
      throw new Error('Categoria não encontrada');
    }

    const products = await this.productService.find({
      categoryId: id,
    });

    if (products.length > 0) {
      throw new Error('Existem produtos associados a esta categoria');
    }
    await this.categoryModel.findByIdAndDelete(id).exec();
  }
}
