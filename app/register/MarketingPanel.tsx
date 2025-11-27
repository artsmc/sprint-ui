/**
 * MarketingPanel Component
 *
 * Server Component displaying value propositions for the Create Account page.
 * Features 3 key benefits with icons and descriptions.
 */

import { FeatherRocket, FeatherUsers, FeatherStar } from '@subframe/core';
import { IconWithBackground } from '@/app/ui/components/IconWithBackground';

interface ValueProposition {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const valuePropositions: ValueProposition[] = [
  {
    icon: <FeatherRocket />,
    title: 'Biweekly Challenges',
    description:
      'Push your design skills with curated prompts every two weeks. Build a portfolio while you learn.',
  },
  {
    icon: <FeatherUsers />,
    title: 'Anonymous Feedback',
    description:
      'Get honest, constructive feedback from peers without bias. Focus on the work, not the name.',
  },
  {
    icon: <FeatherStar />,
    title: 'Community Voting',
    description:
      'Vote on submissions and see how your work stacks up. Learn what resonates with real designers.',
  },
];

export default function MarketingPanel() {
  return (
    <div className="flex h-full flex-col justify-center bg-brand-50 px-8 py-12 lg:px-12">
      <div className="max-w-md">
        <h2 className="text-heading-2 font-heading-2 text-default-font mb-2">
          Design Better Together
        </h2>
        <p className="text-body font-body text-subtext-color mb-8">
          Join thousands of designers improving their craft through practice and peer feedback.
        </p>

        <div className="flex flex-col gap-6">
          {valuePropositions.map((prop, index) => (
            <div key={index} className="flex items-start gap-4">
              <IconWithBackground
                icon={prop.icon}
                variant="brand"
                size="medium"
              />
              <div className="flex flex-col gap-1">
                <h3 className="text-body-bold font-body-bold text-default-font">
                  {prop.title}
                </h3>
                <p className="text-body font-body text-subtext-color">
                  {prop.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
