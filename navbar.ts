import { NavbarItem } from "@docusaurus/theme-common";

const navbarItems: NavbarItem[] = [
    {
        type: 'docSidebar',
        sidebarId: 'tutorialSidebar',
        position: 'left',
        label: 'Tutorial',
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