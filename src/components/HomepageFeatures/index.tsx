import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from '@docusaurus/Link'; // Import this at the top

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>> | string;
  description: ReactNode;
  className?: string;
  link?: string; // Add this optional property
};


const FeatureList: FeatureItem[] = [
  {
    title: "Administrator",
    link: '/adm/intro', // Internal path or url
    Svg: require("@site/static/img/build-design-game-svgrepo-com.svg").default,
    description: (
      <>
        This role is vital for organizations, schools, and universities that use
        Moodle for their e-learning and training needs, as the administrator
        ensures the platform runs smoothly and effectively.
      </>
    ),
  },
  {
    title: "Developer",
    link: '/dev/intro', // Internal path or url
    Svg: require("@site/static/img/development-web-development-svgrepo-com.svg")
      .default,
    description: (
      <>
        Due to Moodle's open-source nature, developers often engage with the
        Moodle community through forums, contributing to projects, and staying
        up-to-date with the latest developments.
      </>
    ),
  },
  {
    title: "Educator",
    link: '/edu/intro', // Internal path or url
    Svg: require("@site/static/img/blackboard-svgrepo-com.svg").default,
    description: (
      <>
        It goes beyond simply knowing how to use Moodle's features. Teaching
        practices use Moodle's tools to create effective and engaging learning
        experiences.
      </>
    ),
  },
];

// UPDATE: Explicitly type the function props using FeatureItem
function Feature({ Svg, title, description, className, link }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {typeof Svg === 'string' ? (
          <img
            src={Svg}
            // Uses your custom hilImage style, falls back to default if not provided
            className={className ?? styles.featureSvg}
            alt={title}
          />
        ) : (
          <Svg className={styles.featureSvg} role="img" />
        )}
      </div>
      <div className="text--center padding-horiz--md">
        {/* If link exists, wrap the title. Otherwise, just show the title. */}
        {link ? (
          <Link to={link}>
            <Heading as="h3">{title}</Heading>
          </Link>
        ) : (
          <Heading as="h3">{title}</Heading>
        )}
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
