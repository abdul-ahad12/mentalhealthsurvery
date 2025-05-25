// pages/admin/login.tsx
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isEmailValid = /^\S+@\S+\.\S+$/.test(email);
  const isPasswordValid = password.length >= 6;
  const canSubmit = isEmailValid && isPasswordValid && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    try {
      const { data } = await axios.post('/api/admin/login', { email, password });
      localStorage.setItem('token', data.token);
      toast.success('Logged in!');
      setTimeout(() => router.push('/admin/dashboard'), 800);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>
      <Toaster position="top-center" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-poppins">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md space-y-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center flex items-center justify-center space-x-2">
            <FiLogIn className="text-blue-500" />
            <span>Admin Login</span>
          </h2>

          {/* Email */}
          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none ${
                isEmailValid
                  ? 'border-gray-300 focus:ring-2 focus:ring-blue-300'
                  : 'border-red-500'
              }`}
            />
            {!isEmailValid && email && (
              <p className="mt-1 text-sm text-red-500">Invalid email</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none ${
                isPasswordValid
                  ? 'border-gray-300 focus:ring-2 focus:ring-blue-300'
                  : 'border-red-500'
              }`}
            />
            {!isPasswordValid && password && (
              <p className="mt-1 text-sm text-red-500">Too short</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-2 bg-blue-500 text-white font-medium rounded-lg disabled:opacity-50 hover:bg-blue-600 transition"
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>

          <p className="text-center text-gray-600 text-sm">
            Need to sign up?{' '}
            <button
              type="button"
              onClick={() => router.push('/admin/signup')}
              className="text-blue-500 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </>
  );
}
