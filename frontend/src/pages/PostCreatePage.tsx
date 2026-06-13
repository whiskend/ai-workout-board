import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { createPost } from '../api/posts';

export default function PostCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  const [memo, setMemo] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [targetReps, setTargetReps] = useState('');
  const [set1Reps, setSet1Reps] = useState('');
  const [set2Reps, setSet2Reps] = useState('');
  const [set3Reps, setSet3Reps] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    try {
      const post = await createPost({
        title,
        date,
        bodyPart,
        memo,
        exercises: [
          {
            exerciseName,
            weightKg: Number(weightKg),
            targetReps: targetReps ? Number(targetReps) : undefined,
            sets: [
              { setNumber: 1, reps: Number(set1Reps) },
              { setNumber: 2, reps: Number(set2Reps) },
              { setNumber: 3, reps: Number(set3Reps) },
            ],
          },
        ],
      });

      navigate(`/posts/${post.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : '게시글 작성에 실패했습니다.');
    }
  }

  return (
    <main>
      <h1>운동 기록 작성</h1>

      <form onSubmit={handleSubmit}>
        <label>
          제목
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>

        <label>
          운동 날짜
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>

        <label>
          운동 부위
          <input value={bodyPart} onChange={(event) => setBodyPart(event.target.value)} />
        </label>

        <label>
          메모
          <textarea value={memo} onChange={(event) => setMemo(event.target.value)} />
        </label>

        <label>
          운동명
          <input value={exerciseName} onChange={(event) => setExerciseName(event.target.value)} />
        </label>

        <label>
          무게 kg
          <input value={weightKg} onChange={(event) => setWeightKg(event.target.value)} />
        </label>

        <label>
          목표 반복 수
          <input value={targetReps} onChange={(event) => setTargetReps(event.target.value)} />
        </label>

        <label>
          1세트 반복 수
          <input value={set1Reps} onChange={(event) => setSet1Reps(event.target.value)} />
        </label>

        <label>
          2세트 반복 수
          <input value={set2Reps} onChange={(event) => setSet2Reps(event.target.value)} />
        </label>

        <label>
          3세트 반복 수
          <input value={set3Reps} onChange={(event) => setSet3Reps(event.target.value)} />
        </label>

        <button type="submit">저장하기</button>
      </form>

      {error && <p>{error}</p>}
    </main>
  );
}
