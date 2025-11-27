/**
 * Register Page
 *
 * Server Component that composes the Create Account page.
 * Features a two-column layout:
 * - Left: Marketing panel (Server Component)
 * - Right: Registration form (Client Component)
 */

import { Metadata } from 'next';
import CreateAccountForm from './CreateAccountForm';
import MarketingPanel from './MarketingPanel';

export const metadata: Metadata = {
  title: 'Create Account | Sprint UI',
  description: 'Join Sprint UI for biweekly design challenges and peer feedback.',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Marketing Panel - Hidden on mobile, visible on lg+ */}
      <div className="hidden lg:flex lg:w-1/2">
        <MarketingPanel />
      </div>

      {/* Registration Form - Full width on mobile, half on lg+ */}
      <div className="flex w-full items-center justify-center lg:w-1/2">
        <CreateAccountForm />
      </div>
    </div>
  );
}
