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
        position: "left",
        activeBaseRegex: `/adm/`, // Highlight when any Dev doc is active
    },
    {
        to: "/dev/intro", // Link to a page in your Dev docs
        label: "Developer",
        position: "left",
        activeBaseRegex: `/dev/`, // Highlight when any Dev doc is active
    },
    {
        to: "/edu/intro", // Link to a page in your Dev docs
        label: "Educator",
        position: "left",
        activeBaseRegex: `/edu/`, // Highlight when any Dev doc is active
    },
    {
        to: "/qa/intro", // Link to a page in your QA docs
        label: "QA",
        position: "left",
        activeBaseRegex: `/qa/`, // Highlight when any QA doc is active
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