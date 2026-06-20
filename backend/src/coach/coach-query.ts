export const assignmentInclude = {
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

export const logInclude = {
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

export const routineCycleInclude = {
  routineDays: {
    orderBy: {
      dayIndex: 'asc' as const,
    },
    include: {
      exercises: {
        orderBy: {
          orderIndex: 'asc' as const,
        },
      },
    },
  },
};

export function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}
