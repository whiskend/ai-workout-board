import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AiService } from '../ai/ai.service';
import type { AiPostRecord } from '../ai/types';
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
} satisfies Prisma.PostInclude;

type PostWithRelations = Prisma.PostGetPayload<{
  include: typeof postInclude;
}>;

function toAiPostRecord(post: PostWithRelations): AiPostRecord {
  return {
    id: post.id,
    title: post.title,
    date: post.date.toISOString().slice(0, 10),
    bodyPart: post.bodyPart,
    memo: post.memo,
    exercises: post.exercises.map((exercise) => ({
      exerciseName: exercise.exerciseName,
      weightKg: exercise.weightKg,
      targetReps: exercise.targetReps,
      sets: exercise.sets.map((set) => ({
        setNumber: set.setNumber,
        reps: set.reps,
        perceivedDifficulty: set.perceivedDifficulty,
      })),
    })),
  };
}

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  async create(userId: number, createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        authorId: userId,
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

  async findAll(keyword?: string) {
    const trimmedKeyword = keyword?.trim();

    return this.prisma.post.findMany({
      where: trimmedKeyword
        ? {
            OR: [
              {
                title: {
                  contains: trimmedKeyword,
                  mode: 'insensitive',
                },
              },
              {
                exercises: {
                  some: {
                    exerciseName: {
                      contains: trimmedKeyword,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                exercises: {
                  some: {
                    normalizedName: {
                      contains: trimmedKeyword.toLowerCase(),
                    },
                  },
                },
              },
            ],
          }
        : undefined,
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

  async update(userId: number, id: number, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('게시글을 수정할 권한이 없습니다.');
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

  async remove(userId: number, id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('게시글을 삭제할 권한이 없습니다.');
    }

    await this.prisma.post.delete({
      where: { id },
    });

    return {
      deleted: true,
      id,
    };
  }

  async analyze(userId: number, id: number) {
    const currentPost = await this.prisma.post.findUnique({
      where: { id },
      include: postInclude,
    });

    if (!currentPost) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (currentPost.authorId !== userId) {
      throw new ForbiddenException('게시글을 분석할 권한이 없습니다.');
    }

    const exerciseNames = currentPost.exercises
      .map((exercise) => exercise.exerciseName)
      .filter(Boolean);
    const normalizedResult = exerciseNames.length
      ? await this.aiService.normalizeExerciseNames(exerciseNames)
      : {
          normalizedNames: [],
          toolCalls: [],
        };
    const normalizedNames = Array.from(
      new Set(
        [
          ...currentPost.exercises
            .map((exercise) => exercise.normalizedName)
            .filter((name): name is string => Boolean(name)),
          ...normalizedResult.normalizedNames.map((name) =>
            name.trim().toLowerCase(),
          ),
        ].filter(Boolean),
      ),
    );

    const previousPosts = normalizedNames.length
      ? await this.prisma.post.findMany({
          where: {
            authorId: userId,
            date: {
              lt: currentPost.date,
            },
            id: {
              not: id,
            },
            exercises: {
              some: {
                normalizedName: {
                  in: normalizedNames,
                },
              },
            },
          },
          orderBy: {
            date: 'desc',
          },
          take: 3,
          include: postInclude,
        })
      : [];

    return this.aiService.analyzePost({
      currentPost: toAiPostRecord(currentPost),
      previousPosts: previousPosts.map(toAiPostRecord),
      toolCalls: normalizedResult.toolCalls,
    });
  }
}
