import { Metadata } from 'next';
import SignInForm from './SignInForm';
import MarketingPanel from './MarketingPanel';

export const metadata: Metadata = {
  title: 'Sign In | Sprint UI',
  description: 'Sign in to Sprint UI to access design challenges, get feedback, and grow your skills.',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Marketing Panel - Hidden on mobile, visible on large screens */}
      <div className="hidden lg:flex lg:w-1/2">
        <MarketingPanel />
      </div>

      {/* SignIn Form - Full width on mobile, half width on large screens */}
      <div className="flex w-full items-center justify-center lg:w-1/2">
        <SignInForm />
      </div>
    </div>
  );
}
