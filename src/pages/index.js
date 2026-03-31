import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/api/data-manager">
            Start Reading 📚
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Enterprise API Documentation">
      <HomepageHeader />
      <main>
        <div className="container" style={{ paddingTop: '2rem' }}>
          <div className="row">
            <div className="col col--6">
              <h2>🔌 plugins</h2>
              <p>
                Comprehensive API documentation for all Countly Enterprise plugins
              </p>
            </div>
            <div className="col col--6">
              <h2>📖 Endpoints</h2>
              <p>
                Over 800+ endpoints documented with request/response examples
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
