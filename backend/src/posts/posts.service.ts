import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePostDto } from './dto/update-post.dto';

const postInclude = {
  author: {
    select: {
      id: true,
      email: true,
      nickname: true,
    },
  },
  exercises: {
    orderBy: {
      orderIndex: 'asc' as const,
    },
    include: {
      sets: {
        orderBy: {
          setNumber: 'asc' as const,
        },
      },
    },
  },
};

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getDemoUser() {
    return this.prisma.user.upsert({
      where: {
        email: 'demo@board.local',
      },
      update: {},
      create: {
        email: 'demo@board.local',
        nickname: '데모 사용자',
        passwordHash: 'not-used-yet',
      },
    });
  }

  async create(createPostDto: CreatePostDto) {
    const author = await this.getDemoUser();

    return this.prisma.post.create({
      data: {
        authorId: author.id,
        title: createPostDto.title,
        date: new Date(createPostDto.date),
        bodyPart: createPostDto.bodyPart,
        memo: createPostDto.memo,
        exercises: {
          create: createPostDto.exercises.map((exercise, index) => ({
            exerciseName: exercise.exerciseName,
            normalizedName: exercise.exerciseName.trim().toLowerCase(),
            weightKg: exercise.weightKg,
            targetReps: exercise.targetReps,
            orderIndex: exercise.orderIndex ?? index,
            memo: exercise.memo,
            sets: {
              create: exercise.sets.map((set) => ({
                setNumber: set.setNumber,
                reps: set.reps,
                perceivedDifficulty: set.perceivedDifficulty,
              })),
            },
          })),
        },
      },
      include: postInclude,
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: postInclude,
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
      include: postInclude,
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (updatePostDto.exercises) {
      await this.prisma.exercise.deleteMany({
        where: { postId: id },
      });
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        title: updatePostDto.title,
        date: updatePostDto.date ? new Date(updatePostDto.date) : undefined,
        bodyPart: updatePostDto.bodyPart,
        memo: updatePostDto.memo,
        exercises: updatePostDto.exercises
          ? {
              create: updatePostDto.exercises.map((exercise, index) => ({
                exerciseName: exercise.exerciseName,
                normalizedName: exercise.exerciseName.trim().toLowerCase(),
                weightKg: exercise.weightKg,
                targetReps: exercise.targetReps,
                orderIndex: exercise.orderIndex ?? index,
                memo: exercise.memo,
                sets: {
                  create: exercise.sets.map((set) => ({
                    setNumber: set.setNumber,
                    reps: set.reps,
                    perceivedDifficulty: set.perceivedDifficulty,
                  })),
                },
              })),
            }
          : undefined,
      },
      include: postInclude,
    });
  }

  async remove(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    await this.prisma.post.delete({
      where: { id },
    });

    return {
      deleted: true,
      id,
    };
  }
}
