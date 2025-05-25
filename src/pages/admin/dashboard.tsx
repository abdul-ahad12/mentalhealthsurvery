// pages/admin/dashboard.tsx
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {
  FiUsers,
  FiList,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiSmile,
  FiAlertCircle,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface Entry {
  _id: string;
  email: string;
  phone: string;
  result: string;
  meter: number;
  createdAt: string;
  answers: Record<string, string>;
}

interface Question {
  qid: string;
  text: string;
  options: { key: string; text: string }[];
}

interface AdminUser {
  _id: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<'entries' | 'admins'>('entries');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [loadingEntries, setLoadingEntries] = useState(false);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    loadData();
  }, [router, token]);

  const loadData = () => {
    // load entries
    setLoadingEntries(true);
    axios
      .get<Entry[]>('/api/admin/entries', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setEntries(res.data))
      .catch(() => toast.error('Failed to load entries.'))
      .finally(() => setLoadingEntries(false));

    // load admins
    setLoadingAdmins(true);
    axios
      .get<AdminUser[]>('/api/admin/list', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setAdmins(res.data))
      .catch(() => toast.error('Failed to load admins.'))
      .finally(() => setLoadingAdmins(false));

    // load questions for detail view
    axios
      .get<Question[]>('/api/survey/questions')
      .then(res => setQuestions(res.data))
      .catch(() => toast.error('Failed to load questions.'));
  };

  const handleReview = (adminId: string, approve: boolean) => {
    axios
      .post(
        '/api/admin/review',
        { adminId, approve },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success(`Admin ${approve ? 'approved' : 'rejected'}.`);
        loadData();
      })
      .catch(() => toast.error('Action failed.'));
  };

  // icon for entry status
  const StatusIcon = ({ meter }: { meter: number }) => {
    if (meter >= 80) return <FiSmile className="text-green-500" title="Healthy" />;
    if (meter >= 50) return <FiAlertCircle className="text-yellow-500" title="Mild Concerns" />;
    return <FiAlertTriangle className="text-red-500" title="At Risk" />;
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-100 font-poppins">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/admin/login');
            }}
            className="text-red-500 hover:underline"
          >
            Logout
          </button>
        </header>
        <main className="p-6 max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setTab('entries')}
              className={`flex items-center space-x-2 px-5 py-2 rounded-lg transition ${
                tab === 'entries'
                  ? 'bg-white shadow text-blue-600'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <FiList className="text-xl" />
              <span className="font-medium">Entries</span>
            </button>
            <button
              onClick={() => setTab('admins')}
              className={`flex items-center space-x-2 px-5 py-2 rounded-lg transition ${
                tab === 'admins'
                  ? 'bg-white shadow text-blue-600'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <FiUsers className="text-xl" />
              <span className="font-medium">Admins</span>
            </button>
          </div>

          {/* Entries Tab */}
          {tab === 'entries' && (
            <div className="bg-white rounded-lg shadow">
              {loadingEntries ? (
                <div className="flex justify-center p-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {entries.map(e => (
                        <tr
                          key={e._id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedEntry(e)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusIcon meter={e.meter} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {e.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {e.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                            {e.meter}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(e.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Entry Details Modal */}
          <AnimatePresence>
            {selectedEntry && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-70 flex items-start justify-center pt-20 z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-2xl w-full max-w-3xl h-[80vh] shadow-xl overflow-auto relative p-8"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                  <h2 className="text-2xl font-semibold mb-4">Response Details</h2>
                  <div className="space-y-6">
                    <p className="text-sm text-gray-500">
                      Submitted on: {new Date(selectedEntry.createdAt).toLocaleString()}
                    </p>
                    {questions.map((q, idx) => {
                      const answerKey = selectedEntry.answers[q.qid];
                      const option = q.options.find(o => o.key === answerKey);
                      return (
                        <div key={q.qid} className="p-4 bg-gray-50 rounded-lg">
                          <p className="font-medium mb-1">
                            {idx + 1}. {q.text}
                          </p>
                          <p className="text-gray-700">
                            Answer:{' '}
                            <span className="font-semibold">{option?.text || answerKey}</span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Admins Tab */}
          {tab === 'admins' && (
            <div className="bg-white rounded-lg shadow">
              {loadingAdmins ? (
                <div className="flex justify-center p-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {admins.map(a => (
                        <tr key={a._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {a.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                            {a.status}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(a.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-4">
                            {a.status === 'pending' ? (
                              <>
                                <button
                                  onClick={() => handleReview(a._id, true)}
                                  className="text-green-500 hover:text-green-700"
                                  title="Approve"
                                >
                                  <FiCheckCircle size={20} />
                                </button>
                                <button
                                  onClick={() => handleReview(a._id, false)}
                                  className="text-red-500 hover:text-red-700"
                                  title="Reject"
                                >
                                  <FiXCircle size={20} />
                                </button>
                              </>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
