import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import MoodleReleases from "@site/src/components/MoodleReleases/MoodleReleases";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--dark', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/intro"
          >
            Wiki
          </Link>
          <Link className="button button--primary button--lg" to="/adm/intro">
            Adm
          </Link>
          <Link className="button button--primary button--lg" to="/dev/intro">
            Dev
          </Link>
          <Link className="button button--primary button--lg" to="/edu/intro">
            Edu
          </Link>
          <Link className="button button--primary button--lg" to="/qa/intro">
            QA
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="MDLDocs"
      description="Some Moodle Resources for all users."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />

        <div className="container">
          <MoodleReleases />
        </div>
      </main>
    </Layout>
  );
}
