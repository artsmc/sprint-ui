"use client";

import React from "react";
import { Avatar } from "@/ui/components/Avatar";
import { Badge } from "@/ui/components/Badge";
import { Button } from "@/ui/components/Button";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { LinkButton } from "@/ui/components/LinkButton";
import { Progress } from "@/ui/components/Progress";
import { FeatherActivity } from "@subframe/core";
import { FeatherArrowRight } from "@subframe/core";
import { FeatherAward } from "@subframe/core";
import { FeatherBarChart2 } from "@subframe/core";
import { FeatherBookOpen } from "@subframe/core";
import { FeatherClock } from "@subframe/core";
import { FeatherFileText } from "@subframe/core";
import { FeatherLightbulb } from "@subframe/core";
import { FeatherMessageCircle } from "@subframe/core";
import { FeatherMessageSquare } from "@subframe/core";
import { FeatherPenTool } from "@subframe/core";
import { FeatherPlayCircle } from "@subframe/core";
import { FeatherStar } from "@subframe/core";
import { FeatherThumbsUp } from "@subframe/core";
import { FeatherTrophy } from "@subframe/core";
import { FeatherUpload } from "@subframe/core";
import { FeatherUserPlus } from "@subframe/core";
import { FeatherUsers } from "@subframe/core";
import { FeatherZap } from "@subframe/core";

function Homepage() {
  return (
    <div className="flex w-full flex-col items-center bg-default-background">
      <div className="flex h-144 w-full flex-none items-center justify-center overflow-hidden relative">
        <img
          className="grow shrink-0 basis-0 self-stretch object-cover absolute"
          src="https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=800&fit=crop"
        />
        <div className="flex items-start absolute inset-0 bg-gradient-to-br" />
        <div className="container max-w-none flex grow shrink-0 basis-0 items-center justify-center relative z-10">
          <div className="flex max-w-[1024px] flex-col items-center gap-8 px-12 py-16">
            <div className="flex flex-col items-center gap-4">
              <Badge variant="success" icon={<FeatherZap />}>
                Live Now - Sprint #42
              </Badge>
              <span className="w-full font-['Inter'] text-[64px] font-[700] leading-[72px] text-white text-center -tracking-[0.04em]">
                Design Challenge: To-do List
              </span>
              <span className="w-full text-heading-1 font-heading-1 text-white text-center">
                Create a task management interface that is clear, intuitive, and
                helps users stay organized without overwhelming them.
              </span>
            </div>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 rounded-full px-4 py-2 border border-solid backdrop-blur-md">
                <FeatherClock className="text-body font-body text-white" />
                <span className="text-body-bold font-body-bold text-white">
                  6 days, 11 hours left
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full px-4 py-2 border border-solid backdrop-blur-md">
                <FeatherUsers className="text-body font-body text-white" />
                <span className="text-body-bold font-body-bold text-white">
                  42 submissions
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full px-4 py-2 border border-solid backdrop-blur-md">
                <FeatherTrophy className="text-body font-body text-white" />
                <span className="text-body-bold font-body-bold text-white">
                  Win XP &amp; Recognition
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="inverse"
                size="large"
                icon={<FeatherUpload />}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              >
                Submit Your Design
              </Button>
              <Button
                variant="brand-secondary"
                size="large"
                icon={<FeatherBookOpen />}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              >
                Read Brief
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="container max-w-none flex w-full items-start gap-8 py-12">
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-12">
          <div className="flex w-full flex-col items-start gap-6">
            <div className="flex w-full items-end justify-between">
              <div className="flex flex-col items-start gap-2">
                <span className="font-['Inter'] text-[48px] font-[700] leading-[56px] text-default-font -tracking-[0.035em]">
                  Featured Submissions
                </span>
                <span className="text-body font-body text-subtext-color">
                  Top-rated designs from the current sprint
                </span>
              </div>
              <LinkButton
                variant="brand"
                iconRight={<FeatherArrowRight />}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              >
                View All
              </LinkButton>
            </div>
            <div className="flex w-full flex-col items-start gap-6 rounded-2xl border border-solid border-neutral-border bg-neutral-50 px-8 py-8 shadow-md">
              <img
                className="h-112 w-full flex-none rounded-xl object-cover shadow-lg"
                src="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1200&h=800&fit=crop"
              />
              <div className="flex w-full items-start justify-between">
                <div className="flex flex-col items-start gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      size="large"
                      image="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/fychrij7dzl8wgq2zjq9.avif"
                    >
                      S
                    </Avatar>
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-heading-2 font-heading-2 text-default-font">
                        Sarah Chen
                      </span>
                      <span className="text-body font-body text-subtext-color">
                        Senior Product Designer at Stripe
                      </span>
                    </div>
                  </div>
                  <span className="text-heading-3 font-heading-3 text-default-font">
                    &quot;A minimal approach to task management that focuses on
                    what matters most&quot;
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <FeatherStar className="text-body font-body text-brand-600" />
                      <span className="text-heading-3 font-heading-3 text-default-font">
                        4.9
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FeatherThumbsUp className="text-body font-body text-subtext-color" />
                      <span className="text-body font-body text-subtext-color">
                        32 votes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FeatherMessageSquare className="text-body font-body text-subtext-color" />
                      <span className="text-body font-body text-subtext-color">
                        18 comments
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant="warning" icon={<FeatherTrophy />}>
                  Current Leader
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-6">
            <span className="text-heading-1 font-heading-1 text-default-font">
              Latest Submissions
            </span>
            <div className="w-full items-start gap-6 grid grid-cols-2">
              <div className="flex flex-col items-start gap-4 overflow-hidden rounded-xl border border-solid border-neutral-border bg-default-background transition-shadow">
                <img
                  className="h-64 w-full flex-none object-cover"
                  src="https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=500&fit=crop"
                />
                <div className="flex w-full flex-col items-start gap-3 px-4 pb-4">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="small"
                        image="https://res.cloudinary.com/subframe/image/upload/v1711417512/shared/m0kfajpwkfief00it4v.jpg"
                      >
                        M
                      </Avatar>
                      <span className="text-body-bold font-body-bold text-default-font">
                        Mike Johnson
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FeatherStar className="text-caption font-caption text-brand-600" />
                      <span className="text-body-bold font-body-bold text-default-font">
                        4.7
                      </span>
                    </div>
                  </div>
                  <span className="text-body font-body text-subtext-color">
                    Clean and focused design with great use of whitespace
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start gap-4 overflow-hidden rounded-xl border border-solid border-neutral-border bg-default-background transition-shadow">
                <img
                  className="h-64 w-full flex-none object-cover"
                  src="https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=500&fit=crop"
                />
                <div className="flex w-full flex-col items-start gap-3 px-4 pb-4">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="small"
                        image="https://res.cloudinary.com/subframe/image/upload/v1711417513/shared/kwut7rhuyivweg8tmyzl.jpg"
                      >
                        A
                      </Avatar>
                      <span className="text-body-bold font-body-bold text-default-font">
                        Alex Rivera
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FeatherStar className="text-caption font-caption text-brand-600" />
                      <span className="text-body-bold font-body-bold text-default-font">
                        4.6
                      </span>
                    </div>
                  </div>
                  <span className="text-body font-body text-subtext-color">
                    Bold colors and excellent visual hierarchy throughout
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start gap-4 overflow-hidden rounded-xl border border-solid border-neutral-border bg-default-background transition-shadow">
                <img
                  className="h-64 w-full flex-none object-cover"
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=500&fit=crop"
                />
                <div className="flex w-full flex-col items-start gap-3 px-4 pb-4">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="small"
                        image="https://res.cloudinary.com/subframe/image/upload/v1711417512/shared/btvntvzhdbhpulae3kzk.jpg"
                      >
                        J
                      </Avatar>
                      <span className="text-body-bold font-body-bold text-default-font">
                        Jordan Lee
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FeatherStar className="text-caption font-caption text-brand-600" />
                      <span className="text-body-bold font-body-bold text-default-font">
                        4.5
                      </span>
                    </div>
                  </div>
                  <span className="text-body font-body text-subtext-color">
                    Innovative interaction patterns for task completion
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start gap-4 overflow-hidden rounded-xl border border-solid border-neutral-border bg-default-background transition-shadow">
                <img
                  className="h-64 w-full flex-none object-cover"
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=500&fit=crop"
                />
                <div className="flex w-full flex-col items-start gap-3 px-4 pb-4">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="small"
                        image="https://res.cloudinary.com/subframe/image/upload/v1711417514/shared/ubsk7cs5hnnaj798efej.jpg"
                      >
                        E
                      </Avatar>
                      <span className="text-body-bold font-body-bold text-default-font">
                        Emily Park
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FeatherStar className="text-caption font-caption text-brand-600" />
                      <span className="text-body-bold font-body-bold text-default-font">
                        4.4
                      </span>
                    </div>
                  </div>
                  <span className="text-body font-body text-subtext-color">
                    Thoughtful micro-interactions and delightful animations
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-12 rounded-2xl px-12 py-16 bg-gradient-to-br from-brand-50 to-neutral-50">
            <div className="flex flex-col items-center gap-4">
              <Badge icon={<FeatherLightbulb />}>How It Works</Badge>
              <span className="font-['Inter'] text-[48px] font-[700] leading-[56px] text-default-font text-center -tracking-[0.035em]">
                Join the Design Sprint
              </span>
              <span className="max-w-[576px] text-heading-2 font-heading-2 text-subtext-color text-center">
                Participate in biweekly challenges, get feedback from the
                community, and level up your design skills
              </span>
            </div>
            <div className="flex w-full items-start gap-6">
              <div className="flex grow shrink-0 basis-0 flex-col items-center gap-4">
                <IconWithBackground
                  size="x-large"
                  icon={<FeatherFileText />}
                  square={true}
                />
                <div className="flex flex-col items-center gap-2">
                  <span className="text-heading-2 font-heading-2 text-brand-600">
                    1. Get the Brief
                  </span>
                  <span className="text-body font-body text-subtext-color text-center">
                    Every two weeks, receive a new design challenge prompt with
                    clear requirements
                  </span>
                </div>
              </div>
              <div className="flex grow shrink-0 basis-0 flex-col items-center gap-4">
                <IconWithBackground
                  size="x-large"
                  icon={<FeatherPenTool />}
                  square={true}
                />
                <div className="flex flex-col items-center gap-2">
                  <span className="text-heading-2 font-heading-2 text-brand-600">
                    2. Design &amp; Submit
                  </span>
                  <span className="text-body font-body text-subtext-color text-center">
                    Create your solution and submit it before the sprint
                    deadline
                  </span>
                </div>
              </div>
              <div className="flex grow shrink-0 basis-0 flex-col items-center gap-4">
                <IconWithBackground
                  size="x-large"
                  icon={<FeatherMessageCircle />}
                  square={true}
                />
                <div className="flex flex-col items-center gap-2">
                  <span className="text-heading-2 font-heading-2 text-brand-600">
                    3. Give Feedback
                  </span>
                  <span className="text-body font-body text-subtext-color text-center">
                    Vote and provide constructive feedback on other submissions
                  </span>
                </div>
              </div>
              <div className="flex grow shrink-0 basis-0 flex-col items-center gap-4">
                <IconWithBackground
                  size="x-large"
                  icon={<FeatherTrophy />}
                  square={true}
                />
                <div className="flex flex-col items-center gap-2">
                  <span className="text-heading-2 font-heading-2 text-brand-600">
                    4. Win &amp; Grow
                  </span>
                  <span className="text-body font-body text-subtext-color text-center">
                    Earn XP, recognition, and improve your design skills with
                    each sprint
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-96 flex-none flex-col items-start gap-6 sticky top-6">
          <div className="flex w-full flex-col items-start gap-4 rounded-xl border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
            <div className="flex w-full items-center gap-2">
              <FeatherActivity className="text-heading-2 font-heading-2 text-brand-600" />
              <span className="text-heading-2 font-heading-2 text-default-font">
                Live Activity
              </span>
            </div>
            <div className="flex w-full flex-col items-start gap-3">
              <div className="flex w-full items-start gap-3 rounded-md bg-neutral-50 px-3 py-3">
                <Avatar
                  size="small"
                  image="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/fychrij7dzl8wgq2zjq9.avif"
                >
                  S
                </Avatar>
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                  <span className="text-caption-bold font-caption-bold text-default-font">
                    Sarah Chen submitted a design
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    2 minutes ago
                  </span>
                </div>
              </div>
              <div className="flex w-full items-start gap-3 rounded-md bg-neutral-50 px-3 py-3">
                <Avatar
                  size="small"
                  image="https://res.cloudinary.com/subframe/image/upload/v1711417512/shared/m0kfajpwkfief00it4v.jpg"
                >
                  M
                </Avatar>
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                  <span className="text-caption-bold font-caption-bold text-default-font">
                    Mike Johnson voted on 3 designs
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    15 minutes ago
                  </span>
                </div>
              </div>
              <div className="flex w-full items-start gap-3 rounded-md bg-neutral-50 px-3 py-3">
                <Avatar
                  size="small"
                  image="https://res.cloudinary.com/subframe/image/upload/v1711417513/shared/kwut7rhuyivweg8tmyzl.jpg"
                >
                  A
                </Avatar>
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                  <span className="text-caption-bold font-caption-bold text-default-font">
                    Alex Rivera left feedback
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    1 hour ago
                  </span>
                </div>
              </div>
              <div className="flex w-full items-start gap-3 rounded-md bg-neutral-50 px-3 py-3">
                <Avatar
                  size="small"
                  image="https://res.cloudinary.com/subframe/image/upload/v1711417512/shared/btvntvzhdbhpulae3kzk.jpg"
                >
                  J
                </Avatar>
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                  <span className="text-caption-bold font-caption-bold text-default-font">
                    Jordan Lee submitted a design
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    2 hours ago
                  </span>
                </div>
              </div>
              <div className="flex w-full items-start gap-3 rounded-md bg-neutral-50 px-3 py-3">
                <Avatar
                  size="small"
                  image="https://res.cloudinary.com/subframe/image/upload/v1711417514/shared/ubsk7cs5hnnaj798efej.jpg"
                >
                  E
                </Avatar>
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
                  <span className="text-caption-bold font-caption-bold text-default-font">
                    Emily Park joined the sprint
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    3 hours ago
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-4 rounded-xl border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
            <div className="flex w-full items-center gap-2">
              <FeatherBarChart2 className="text-heading-2 font-heading-2 text-brand-600" />
              <span className="text-heading-2 font-heading-2 text-default-font">
                Sprint Stats
              </span>
            </div>
            <div className="flex w-full flex-col items-start gap-4">
              <div className="flex w-full items-center justify-between">
                <span className="text-body font-body text-subtext-color">
                  Total Submissions
                </span>
                <span className="text-heading-3 font-heading-3 text-default-font">
                  42
                </span>
              </div>
              <div className="flex w-full flex-col items-start gap-2">
                <div className="flex w-full items-center justify-between">
                  <span className="text-body font-body text-subtext-color">
                    Participation
                  </span>
                  <span className="text-body-bold font-body-bold text-brand-600">
                    84%
                  </span>
                </div>
                <Progress value={84} />
              </div>
              <div className="flex w-full items-center justify-between">
                <span className="text-body font-body text-subtext-color">
                  Votes Cast
                </span>
                <span className="text-heading-3 font-heading-3 text-default-font">
                  328
                </span>
              </div>
              <div className="flex w-full items-center justify-between">
                <span className="text-body font-body text-subtext-color">
                  Comments
                </span>
                <span className="text-heading-3 font-heading-3 text-default-font">
                  156
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-4 rounded-xl border border-solid border-success-200 bg-success-50 px-6 py-6">
            <div className="flex w-full items-center gap-2">
              <FeatherAward className="text-heading-2 font-heading-2 text-success-700" />
              <span className="text-heading-2 font-heading-2 text-success-800">
                Top Contributors
              </span>
            </div>
            <div className="flex w-full flex-col items-start gap-3">
              <div className="flex w-full items-center gap-3">
                <Badge variant="warning" icon={<FeatherTrophy />}>
                  #1
                </Badge>
                <Avatar
                  size="small"
                  image="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/fychrij7dzl8wgq2zjq9.avif"
                >
                  S
                </Avatar>
                <div className="flex grow shrink-0 basis-0 flex-col items-start">
                  <span className="text-caption-bold font-caption-bold text-default-font">
                    Sarah Chen
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    2,450 XP
                  </span>
                </div>
              </div>
              <div className="flex w-full items-center gap-3">
                <Badge variant="neutral">#2</Badge>
                <Avatar
                  size="small"
                  image="https://res.cloudinary.com/subframe/image/upload/v1711417512/shared/m0kfajpwkfief00it4v.jpg"
                >
                  M
                </Avatar>
                <div className="flex grow shrink-0 basis-0 flex-col items-start">
                  <span className="text-caption-bold font-caption-bold text-default-font">
                    Mike Johnson
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    2,180 XP
                  </span>
                </div>
              </div>
              <div className="flex w-full items-center gap-3">
                <Badge variant="neutral">#3</Badge>
                <Avatar
                  size="small"
                  image="https://res.cloudinary.com/subframe/image/upload/v1711417513/shared/kwut7rhuyivweg8tmyzl.jpg"
                >
                  A
                </Avatar>
                <div className="flex grow shrink-0 basis-0 flex-col items-start">
                  <span className="text-caption-bold font-caption-bold text-default-font">
                    Alex Rivera
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    1,890 XP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-8 px-6 py-20 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800">
        <div className="container max-w-none flex w-full flex-col items-center gap-8">
          <Badge variant="success" icon={<FeatherZap />}>
            Join 500+ Designers
          </Badge>
          <div className="flex max-w-[768px] flex-col items-center gap-4">
            <span className="w-full font-['Inter'] text-[56px] font-[700] leading-[64px] text-white text-center -tracking-[0.04em]">
              Ready to level up your design skills?
            </span>
            <span className="w-full text-heading-1 font-heading-1 text-white text-center">
              Join the next biweekly sprint and start building your portfolio
              with real-world design challenges
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              variant="inverse"
              size="large"
              icon={<FeatherUserPlus />}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              Join Next Sprint
            </Button>
            <Button
              variant="brand-secondary"
              size="large"
              icon={<FeatherPlayCircle />}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              Watch Demo
            </Button>
          </div>
          <div className="flex items-center justify-center gap-8 pt-6 flex-wrap">
            <div className="flex flex-col items-center gap-2">
              <span className="font-['Inter'] text-[32px] font-[700] leading-[36px] text-white">
                500+
              </span>
              <span className="text-body font-body text-default-font">
                Active Designers
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-['Inter'] text-[32px] font-[700] leading-[36px] text-white">
                2,000+
              </span>
              <span className="text-body font-body text-default-font">
                Submissions
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-['Inter'] text-[32px] font-[700] leading-[36px] text-white">
                100+
              </span>
              <span className="text-body font-body text-default-font">
                Challenges
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-['Inter'] text-[32px] font-[700] leading-[36px] text-white">
                50K+
              </span>
              <span className="text-body font-body text-default-font">
                Feedback Given
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
