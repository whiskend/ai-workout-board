import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { signup } from '../api/auth';

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    try {
      await signup({
        email,
        password,
        nickname,
      });

      navigate('/login');
    } catch (error) {
      setError(error instanceof Error ? error.message : '회원가입에 실패했습니다.');
    }
  }

  return (
    <main>
      <h1>회원가입</h1>

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

        <label>
          닉네임
          <input value={nickname} onChange={(event) => setNickname(event.target.value)} />
        </label>

        <button type="submit">가입하기</button>
      </form>

      {error && <p>{error}</p>}
    </main>
  );
}