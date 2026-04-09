import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import footer from "./footer"; // No need for .ts extension here
import navbarItems from "./navbar"; // Import your new navbar file

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Moodle Docs",
  tagline: "Moodle is cool",
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
    faster: true, // Enable all the optimizations that will be part of Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://ruseleredu.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/moodle-docs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ruseleredu', // Usually your GitHub org/user name.
  projectName: 'moodle-docs', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn", // or 'throw'
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://ruseleredu.github.io/moodle-docs/edit/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://ruseleredu.github.io/moodle-docs/edit/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],


  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      {
        id: "adm", // Unique ID for this docs instance
        path: "adm-docs", // Path to your adm docs folder
        routeBasePath: "adm", // Base URL for these docs (e.g., yoursite.com/adm/...)
        sidebarPath: require.resolve("./sidebarsAdm.js"), // Separate sidebar for ADM docs
        // 👇 Add this line for the last update time
        showLastUpdateTime: true,
        showLastUpdateAuthor: true,
        // ... other options specific to your ADM docs
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      {
        id: "dev", // Unique ID for this docs instance
        path: "dev-docs", // Path to your Developer docs folder
        routeBasePath: "dev", // Base URL for these docs (e.g., yoursite.com/dev/...)
        sidebarPath: require.resolve("./sidebarsDev.js"), // Separate sidebar for Developer docs
        // 👇 Add this line for the last update time
        showLastUpdateTime: true,
        showLastUpdateAuthor: true,
        // ... other options specific to your Dev docs
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      {
        id: "edu", // Unique ID for this docs instance
        path: "edu-docs", // Path to your Edu docs folder
        routeBasePath: "edu", // Base URL for these docs (e.g., yoursite.com/dev/...)
        sidebarPath: require.resolve("./sidebarsEdu.js"), // Separate sidebar for Edu docs
        // 👇 Add this line for the last update time
        showLastUpdateTime: true,
        showLastUpdateAuthor: true,
        // ... other options specific to your Edu docs
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      {
        id: "qa", // Unique ID for this docs instance
        path: "qa-docs", // Path to your QA docs folder
        routeBasePath: "qa", // Base URL for these docs (e.g., yoursite.com/dev/...)
        sidebarPath: require.resolve("./sidebarsQA.js"), // Separate sidebar for QA docs
        // 👇 Add this line for the last update time
        showLastUpdateTime: true,
        showLastUpdateAuthor: true,
        // ... other options specific to your QA docs
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Moodle Docs",
      logo: {
        alt: "Moodle Docs Logo",
        src: "img/logo.svg",
      },
      items: navbarItems, // Use the imported navbar items
    },
    footer: footer,
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    announcementBar: {
      id: 'welcome_new_site', // Update this id when you launch a new major feature or make significant changes to the site
      content: '🚀 New site is live! Looking for the old version? <a href="https://adrianoruseler.github.io/moodle-docs/">Access the Archive here!</a>.',
      backgroundColor: '#f5f6f7', // Use a neutral "archival" grey
      textColor: '#444444', // A darker color for better contrast with the background
      isCloseable: true, // Let users dismiss it once they've read it
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
