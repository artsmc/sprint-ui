import { FeatherZap, FeatherUsers, FeatherTrendingUp } from '@subframe/core';
import IconWithBackground from '@/ui/components/IconWithBackground';

export default function MarketingPanel() {
  return (
    <div className="flex w-full flex-col justify-center bg-brand-50 px-8 py-12 lg:px-12">
      <div className="mx-auto max-w-md space-y-8">
        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-heading-1 font-heading-1 text-default-font">
            Design Better Together
          </h1>
          <p className="text-body-bold font-body-bold text-subtext-color">
            Join a community of designers who challenge themselves, share feedback, and grow through biweekly design sprints.
          </p>
        </div>

        {/* Value Propositions */}
        <div className="space-y-6">
          {/* Value Prop 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <IconWithBackground variant="brand" size="medium">
                <FeatherZap className="text-brand-600" />
              </IconWithBackground>
            </div>
            <div className="space-y-1">
              <h3 className="text-body-bold font-body-bold text-default-font">
                Biweekly design challenges
              </h3>
              <p className="text-body font-body text-subtext-color">
                Push your skills with curated design prompts every two weeks.
              </p>
            </div>
          </div>

          {/* Value Prop 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <IconWithBackground variant="brand" size="medium">
                <FeatherUsers className="text-brand-600" />
              </IconWithBackground>
            </div>
            <div className="space-y-1">
              <h3 className="text-body-bold font-body-bold text-default-font">
                Learn from your peers
              </h3>
              <p className="text-body font-body text-subtext-color">
                Get anonymous feedback from fellow designers to grow faster.
              </p>
            </div>
          </div>

          {/* Value Prop 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <IconWithBackground variant="brand" size="medium">
                <FeatherTrendingUp className="text-brand-600" />
              </IconWithBackground>
            </div>
            <div className="space-y-1">
              <h3 className="text-body-bold font-body-bold text-default-font">
                Build your portfolio
              </h3>
              <p className="text-body font-body text-subtext-color">
                Track your progress with XP, badges, and a growing portfolio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
