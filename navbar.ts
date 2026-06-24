import { NavbarItem } from "@docusaurus/theme-common";

const navbarItems: NavbarItem[] = [
    {
        type: 'docSidebar',
        sidebarId: 'tutorialSidebar',
        position: 'left',
        label: 'Tutorial',
    },
    {
        to: "/adm/intro", // Link to a page in your Dev docs
        label: "Administrator",
        type: "dropdown",
        position: "left",
        activeBaseRegex: `/adm/`, // Highlight when any Dev doc is active
        items: [
            {
                to: "/adm/category/docker", // Link to a page in your adm docs
                label: "Docker",
            },
            {
                to: "/adm/category/github", // Link to a page in your adm docs
                label: "GitHub",
            },
            {
                to: "/adm/category/coderunner", // Link to a page in your adm docs
                label: "CodeRunner",
            },
            {
                to: "/adm/category/stack", // Link to a page in your adm docs
                label: "STACK",
            },
            {
                to: "/adm/category/vpl", // Link to a page in your adm docs
                label: "VPL",
            },
            {
                to: "/adm/category/moosh-v2x", // Link to a page in your adm docs
                label: "Moosh",
            },
        ],
    },
    {
        to: "/dev/intro", // Link to a page in your Dev docs
        label: "Developer",
        type: "dropdown",
        position: "left",
        activeBaseRegex: `/dev/`, // Highlight when any Dev doc is active
        items: [
            {
                to: "/dev/category/alpine-php-webserver", // Link to a page in your Dev docs
                label: "Alpine PHP Webserver",
            },
            {
                to: "/dev/category/alpine-moodle", // Link to a page in your Dev docs
                label: "Alpine Moodle",
            },
            {
                to: "/dev/category/jobeinabox", // Link to a page in your Dev docs
                label: "JobeInABox",
            },
        ],
    },
    {
        to: "/edu/intro", // Link to a page in your Dev docs
        label: "Educator",
        type: "dropdown",
        position: "left",
        activeBaseRegex: `/edu/`, // Highlight when any Dev doc is active
        items: [
            {
                to: "/edu/intro", // Link to a page in your edu docs
                label: "Intro",
            },
        ],
    },
    {
        to: "/qa/intro", // Link to a page in your QA docs
        label: "QA",
        type: "dropdown",
        position: "left",
        activeBaseRegex: `/qa/`, // Highlight when any QA doc is active
        items: [
            {
                to: "/qa/intro", // Link to a page in your QA docs
                label: "Intro",
            },
        ],
    },
    { to: '/blog', label: 'Blog', position: 'left' },
    {
        href: "https://moodledev.io/",
        label: "Development",
        position: "right",
    },
    {
        href: 'https://github.com/ruseleredu/moodle-docs',
        label: 'GitHub',
        position: 'right',
    },
];

export default navbarItems;