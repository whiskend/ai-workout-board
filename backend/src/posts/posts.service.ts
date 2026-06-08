import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkoutPostDto } from './dto/create-workout-post.dto';
import { PrismaService } from '../prisma/prisma.service';

const workoutPostInclude = {
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
        email: 'demo@workout.local',
      },
      update: {},
      create: {
        email: 'demo@workout.local',
        nickname: '데모 사용자',
        passwordHash: 'not-used-yet',
      },
    });
  }

  async create(createWorkoutPostDto: CreateWorkoutPostDto) {
    const author = await this.getDemoUser();

    return this.prisma.workoutPost.create({
      data: {
        authorId: author.id,
        title: createWorkoutPostDto.title,
        workoutDate: new Date(createWorkoutPostDto.workoutDate),
        bodyPart: createWorkoutPostDto.bodyPart,
        memo: createWorkoutPostDto.memo,
        exercises: {
          create: createWorkoutPostDto.exercises.map((exercise, index) => ({
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
      include: workoutPostInclude,
    });
  }

  async findAll() {
    return this.prisma.workoutPost.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: workoutPostInclude,
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.workoutPost.findUnique({
      where: {
        id,
      },
      include: workoutPostInclude,
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return post;
  }
}
