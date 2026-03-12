// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { LangProvider } from '@/context/LangContext';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import ExplorePage from '@/pages/ExplorePage';
import SkillPage from '@/pages/SkillPage';
import WritePage from '@/pages/WritePage';
import ProfilePage from '@/pages/ProfilePage';
import SavedPage from '@/pages/SavedPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import NotFoundPage from '@/pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster position="top-right" toastOptions={{
              style: { fontFamily: 'Hind, sans-serif', fontSize: '0.9rem', borderRadius: 10 },
              success: { iconTheme: { primary: '#E8621A', secondary: '#fff' } },
            }} />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="explore" element={<ExplorePage />} />
                <Route path="skills/:id" element={<SkillPage />} />
                <Route path="write" element={<WritePage />} />
                <Route path="write/:id" element={<WritePage />} />
                <Route path="profile/:id" element={<ProfilePage />} />
                <Route path="saved" element={<SavedPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LangProvider>
    </QueryClientProvider>
  );
}
