export const siteConfig = {
  name: "Refactor Coaching & Mentoring",
  url: "https://refactorcoach.com",
  ogImage: "https://ui.shadcn.com/og.jpg",
  locale: "us",
  titleStyle: SessionTitleStyle.CoachFirstCoacheeFirstDate,
  description: "Coaching and mentorship done right.",
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn-ui/ui",
  },
};

export type SiteConfig = typeof siteConfig;

import { MainNavItem, SidebarNavItem } from "./types/nav";
import { SessionTitleStyle } from "./types/session-title";

interface DocsConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
  ],
  sidebarNav: [
    {
      title: "User",
      items: [
        {
          title: "Profile",
          href: "/#",
          items: [],
        },
        {
          title: "Log out",
          href: "/#",
          items: [],
        },
        // {
        //   title: "Actions",
        //   items: [
        //     {
        //       title: "Log out",
        //       href: "/logout",
        //       items: [],
        //     },
        //   ],
        // },
      ],
    },
  ],
};
