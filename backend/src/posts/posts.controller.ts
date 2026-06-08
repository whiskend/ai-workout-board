import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateWorkoutPostDto } from './dto/create-workout-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createWorkoutPostDto: CreateWorkoutPostDto) {
    return this.postsService.create(createWorkoutPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }
}
