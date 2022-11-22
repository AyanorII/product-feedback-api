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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('/planned')
  plannedProducts() {
    return this.productsService.plannedProducts();
  }

  @Get('/in-progress')
  inProgressProducts() {
    return this.productsService.inProgressProducts();
  }

  @Get('/live')
  liveProducts() {
    return this.productsService.liveProducts();
  }

  @Get('/count')
  async countProducts(): Promise<{
    planned: number;
    inProgress: number;
    live: number;
  }> {
    return this.productsService.countProducts();
  }

  @Get('/suggestions')
  productsSuggestions() {
    return this.productsService.productsSuggestions();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/upvote')
  async upvote(@Param('id') id: string) {
    return this.productsService.upvote(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
