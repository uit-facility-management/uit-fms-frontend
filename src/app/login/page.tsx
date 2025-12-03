'use client';

import { use, useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const canSubmit = username.trim() !== '' && password.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '123456') {
      alert('Đăng nhập thành công 2');
      window.location.href = '/homepage';
    } else {
      alert('Sai tài khoản hoặc mật khẩu');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-semibold tracking-tight text-[#696969]">Login</h1>
        <p className="text-gray-500 mt-3">Hi, Welcome back 👋</p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#696969]">Tài khoản</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100 px-3 py-2 outline-none text-gray-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#696969]">Mật khẩu</label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100 px-3 py-2 outline-none text-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full mt-5 rounded-lg py-2.5 font-medium transition
              ${canSubmit
                ? 'bg-[#FD735D] text-white hover:bg-[#ffa79a]'
                : 'bg-[#ffa79a] text-white cursor-not-allowed'}
            `}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
