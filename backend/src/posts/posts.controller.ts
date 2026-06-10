import { Body, Controller, Get, Param, ParseIntPipe, Post, Patch } from '@nestjs/common';
import { CreateWorkoutPostDto } from './dto/create-workout-post.dto';
import { PostsService } from './posts.service';
import { UpdateWorkoutPostDto } from './dto/update-workout-post.dto';

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

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkoutPostDto: UpdateWorkoutPostDto,
  ) {
    return this.postsService.update(id, updateWorkoutPostDto);
  }
}
