// pages/survey.tsx
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { FiSmile } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

interface Option { key: string; text: string; }
interface Question { qid: string; text: string; options: Option[]; }

// Simple email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Simple phone regex: digits, spaces, dashes, plus
const phoneRegex = /^[+]?\d{1,3}?[- .]?\d{1,14}([-. ]?\d{1,13})*$/;

export default function SurveyPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showThankYou, setShowThankYou] = useState(false);
  const [resultData, setResultData] = useState<{ meter: number; result: string; feedback: string } | null>(null);

  // Validation flags
  const isEmailValid = useMemo(() => emailRegex.test(email), [email]);
  const isPhoneValid = useMemo(() => phoneRegex.test(phone), [phone]);

  // Fetch questions
  useEffect(() => {
    axios.get<Question[]>('/api/survey/questions')
      .then(res => setQuestions(res.data))
      .catch(() => toast.error('Failed to load questions.'));
  }, []);

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const isFormComplete = useMemo(() => {
    return questions.every(q => !!answers[q.qid]);
  }, [answers, questions]);
  

  const handleChoice = (qid: string, choice: string) => {
    setAnswers(prev => ({ ...prev, [qid]: choice }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) {
      toast.error('Please answer all questions.');
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post('/api/survey', { answers });
      setResultData(data);
      setShowThankYou(true);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Submission failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Toaster position="top-right" />

      <div className="font-poppins">
        {/* Splash Screen */}
        <AnimatePresence>
          {showSplash && (
            <motion.div
              className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="flex flex-col items-center"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <FiSmile className="text-6xl text-blue-500 mb-4" />
                <h1 className="text-3xl font-semibold mb-2 text-gray-800">Welcome!</h1>
                <p className="text-gray-600">Let&apos;s begin your mental health check.</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Thank You Modal */}
        <AnimatePresence>
          {showThankYou && resultData && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-xl relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => setShowThankYou(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
                >×</button>
                <h2 className="text-2xl font-semibold mb-4">Thank you!</h2>
                <p className="mb-2">🧠 Your Score: <span className="font-medium">{resultData.meter}%</span></p>
                <p className="mb-2">Result: <span className="font-medium">{resultData.result}</span></p>
                <p className="mb-4 text-gray-600">{resultData.feedback}</p>
                {resultData.result !== 'Healthy' && (
                  <div className="mt-4 space-y-2 text-left text-gray-700">
                    <p>If you need help, call <a href="tel:1-800-123-4567" className="text-blue-500 underline">1-800-123-4567</a></p>
                    <p>or email <a href="mailto:support@mentalhealth.org" className="text-blue-500 underline">support@mentalhealth.org</a></p>
                  </div>
                )}
                <button
                  onClick={() => setShowThankYou(false)}
                  className="mt-6 w-full px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                >Close</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form */}
        {!showSplash && !showThankYou && (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="max-w-3xl mx-auto p-6">
              <header className="mb-8 flex items-center space-x-3">
                <FiSmile className="text-4xl text-blue-500 animate-bounce" />
                <h1 className="text-4xl font-semibold text-gray-800">Mental Health Survey</h1>
              </header>
              <p className="text-gray-600 mb-6">Help us understand your current psychological well-being. Your responses are confidential.</p>

              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Survey Questions */}
                <div className="space-y-6">
                  {questions.map((q, idx) => (
                    <motion.div
                      key={q.qid}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <p className="font-medium text-gray-800 mb-2">{q.text}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {q.options.map(opt => (
                          <label
                            key={opt.key}
                            className={`cursor-pointer border rounded-lg p-3 text-center transition ${answers[q.qid] === opt.key ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'}`}
                          >
                            <input
                              type="radio"
                              name={q.qid}
                              value={opt.key}
                              className="hidden"
                              onChange={() => handleChoice(q.qid, opt.key)}
                            />
                            {opt.text}
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={!isFormComplete || loading}
                  className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={!loading && isFormComplete ? { scale: 1.02 } : {}}
                  whileTap={!loading && isFormComplete ? { scale: 0.98 } : {}}
                >
                  {loading ? 'Submitting…' : 'Submit'}
                </motion.button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
