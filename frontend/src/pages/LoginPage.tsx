import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { login } from '../api/auth';
import { storeToken } from '../api/client';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    try {
      const result = await login({
        email,
        password,
      });

      storeToken(result.accessToken);
      navigate('/posts');
    } catch (error) {
      setError(error instanceof Error ? error.message : '로그인에 실패했습니다.');
    }
  }

  return (
    <main>
      <h1>로그인</h1>

      <form onSubmit={handleSubmit}>
        <label>
          이메일
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>

        <label>
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <button type="submit">로그인</button>
      </form>

      {error && <p>{error}</p>}
    </main>
  );
}