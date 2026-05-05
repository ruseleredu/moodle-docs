import { ThemeConfig } from "@docusaurus/preset-classic";

const formatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23", // Use 24-hour format
});

// Using consistent styling for links
const currentYear = new Date().getFullYear();
const utc3Time = formatter.format(new Date());
const linkStyle =
    'style="color: #ffffff; font-weight: bold;" target="_blank" rel="noopener noreferrer"';
const gitlink = `<a href="https://github.com/ruseleredu/moodle-docs" ${linkStyle}>moodle-docs</a>`;
const docusaurusVersion = require("@docusaurus/core/package.json").version;
const doclink = `<a href="https://docusaurus.io/" ${linkStyle}>Docusaurus</a>  v${docusaurusVersion}`;

const COPYRIGHT_STRING = `Copyright © ${currentYear} ${gitlink}. Built with ${doclink} at ${utc3Time} (UTC-3).`;

const footer: ThemeConfig["footer"] = {
    style: "dark",
    links: [
        {
            title: "Docs",
            items: [
                {
                    label: "Tutorial",
                    href: "https://docusaurus.io/docs",
                },
                {
                    label: "devdocs",
                    href: "https://github.com/moodle/devdocs",
                },
            ],
        },
        {
            title: "Development",
            items: [
                {
                    label: "Roadmap",
                    href: "https://moodledev.io/general/community/roadmap",
                },
                {
                    label: "MDK",
                    href: "https://moodledev.io/general/development/tools/mdk",
                },
                {
                    label: "QA testing",
                    href: "https://moodledev.io/general/development/process/testing/qa",
                },
                {
                    label: "DiceBear",
                    href: "https://www.dicebear.com/",
                },
            ],
        },
        {
            title: "Plugins",
            items: [
                {
                    label: "moodle502",
                    href: "https://github.com/AdrianoRuseler/moodle502-plugins",
                },
                {
                    label: "moodle501",
                    href: "https://github.com/AdrianoRuseler/moodle501-plugins",
                },
                {
                    label: "moodle500",
                    href: "https://github.com/AdrianoRuseler/moodle500-plugins",
                },
                {
                    label: "moodle405",
                    href: "https://github.com/AdrianoRuseler/moodle405-plugins",
                },
                {
                    label: "mdldev",
                    href: "https://github.com/AdrianoRuseler/mdldev-plugins",
                },
            ],
        },
        {
            title: "Docker",
            items: [
                {
                    label: "alpine-moodle",
                    href: "https://erseco.github.io/alpine-moodle/",
                },
                {
                    label: "moodle-docker",
                    href: "https://github.com/moodlehq/moodle-docker",
                },
                {
                    label: "Bitnami",
                    href: "https://github.com/bitnami/containers/tree/main/bitnami/moodle",
                },
                {
                    label: "mdlbkp-bitnami",
                    href: "https://github.com/AdrianoRuseler/mdlbkp-bitnami",
                },
                {
                    label: "moodle-dev",
                    href: "https://github.com/kabalin/moodle-dev-compose",
                },
                {
                    label: "jobcespedes",
                    href: "https://github.com/jobcespedes/docker-compose-moodle",
                },
            ],
        },

        {
            title: "Self-hosting",
            items: [
                {
                    label: "Moodle Dev",
                    href: "https://integration.adrianoruseler.com",
                },
                {
                    label: "Moodle 5.2+",
                    href: "https://mdl52.adrianoruseler.com/",
                },
                {
                    label: "Moodle 5.1+",
                    href: "https://mdl51.adrianoruseler.com/",
                },
                {
                    label: "Moodle 5.0+",
                    href: "https://mdl50.adrianoruseler.com/",
                },
                {
                    label: "Moodle 4.5+",
                    href: "https://mdl45.adrianoruseler.com/",
                },
            ],
        },

        {
            title: "Academy",
            items: [
                {
                    label: "Educator",
                    href: "https://moodle.academy/course/index.php?categoryid=2",
                },
                {
                    label: "Administrator",
                    href: "https://moodle.academy/course/index.php?categoryid=3",
                },
                {
                    label: "Developer",
                    href: "https://moodle.academy/course/index.php?categoryid=4",
                },
                {
                    label: "YouTube",
                    href: "https://www.youtube.com/@moodle",
                },
                {
                    label: "MoodleNet",
                    href: "https://moodle.net",
                },
            ],
        },
        {
            title: "Moodle LMS",
            items: [
                {
                    label: "Releases",
                    href: "https://moodledev.io/general/releases",
                },
                {
                    label: "Development",
                    href: "https://moodledev.io/",
                },
                {
                    label: "Documentation",
                    href: "https://docs.moodle.org/",
                },
                {
                    label: "Tracker",
                    href: "https://moodle.atlassian.net/",
                },
                {
                    label: "Plugins",
                    href: "https://moodle.org/plugins/",
                },
            ],
        },
        {
            title: "More",
            items: [
                {
                    label: "moodle.org",
                    href: "https://moodle.org",
                },
                {
                    label: "moodle.com",
                    href: "https://moodle.com",
                },
                {
                    label: "Academy",
                    href: "https://moodle.academy/",
                },
                {
                    label: "SVG Repo",
                    href: "https://www.svgrepo.com/",
                },
            ],
        },
    ],
    copyright: COPYRIGHT_STRING,
};

export default footer;
