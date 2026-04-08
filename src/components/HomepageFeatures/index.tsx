import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Administrator",
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

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
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
