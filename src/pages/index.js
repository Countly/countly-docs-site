import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const pluginCategories = [
  {
    title: 'Analytics & Insights',
    icon: '📊',
    items: [
      { label: 'Drill', link: '/api/drill' },
      { label: 'Funnels', link: '/api/funnels' },
      { label: 'Flows', link: '/api/flows' },
      { label: 'Retention Segments', link: '/api/retention_segments' },
      { label: 'Formulas', link: '/api/formulas' },
      { label: 'Active Users', link: '/api/active_users' },
      { label: 'Concurrent Users', link: '/api/concurrent_users' },
    ],
  },
  {
    title: 'User Engagement',
    icon: '🎯',
    items: [
      { label: 'Surveys', link: '/api/surveys' },
      { label: 'Remote Config', link: '/api/remote-config' },
      { label: 'AB Testing', link: '/api/ab-testing' },
      { label: 'Content', link: '/api/content' },
      { label: 'Journey Engine', link: '/api/journey_engine' },
      { label: 'Push Approver', link: '/api/push_approver' },
    ],
  },
  {
    title: 'Security & Auth',
    icon: '🔐',
    items: [
      { label: 'LDAP', link: '/api/ldap' },
      { label: 'OIDC', link: '/api/oidc' },
      { label: 'Okta', link: '/api/okta' },
      { label: 'Active Directory', link: '/api/active_directory' },
      { label: 'Cognito', link: '/api/cognito' },
      { label: 'Two-Factor Auth', link: '/api/two-factor-auth' },
      { label: 'reCAPTCHA', link: '/api/recaptcha' },
    ],
  },
  {
    title: 'Data & Infrastructure',
    icon: '🗄️',
    items: [
      { label: 'ClickHouse', link: '/api/clickhouse' },
      { label: 'Kafka', link: '/api/kafka' },
      { label: 'Data Manager', link: '/api/data-manager' },
      { label: 'Data Migration', link: '/api/data_migration' },
      { label: 'Config Transfer', link: '/api/config-transfer' },
      { label: 'DBViewer', link: '/api/dbviewer' },
    ],
  },
];

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
            to="/api">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

function QuickLinks() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Quick Links</h2>
        <div className={clsx('row', styles.quickLinks)}>
          <div className="col col--3">
            <Link to="/api" className={styles.quickLink}>
              <span>📖</span>
              <strong>API Overview</strong>
              <small>Start here</small>
            </Link>
          </div>
          <div className="col col--3">
            <Link to="/api#authentication" className={styles.quickLink}>
              <span>🔑</span>
              <strong>Authentication</strong>
              <small>API keys & tokens</small>
            </Link>
          </div>
          <div className="col col--3">
            <Link to="/api/sdk" className={styles.quickLink}>
              <span>📡</span>
              <strong>SDK Integration</strong>
              <small>Client & server SDKs</small>
            </Link>
          </div>
          <div className="col col--3">
            <a href="https://support.countly.com/hc/en-us" target="_blank" rel="noopener noreferrer" className={styles.quickLink}>
              <span>📚</span>
              <strong>Documentation</strong>
              <small>Help center</small>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function PluginCategories() {
  return (
    <section className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Enterprise Plugins</h2>
        <p className={styles.sectionSubtitle}>
          Extend Countly with powerful plugins for analytics, engagement, security, and infrastructure.
        </p>
        <div className="row">
          {pluginCategories.map((cat, idx) => (
            <div className="col col--6" key={idx}>
              <div className={styles.pluginCard}>
                <div className={styles.pluginCardHeader}>
                  <span className={styles.pluginIcon}>{cat.icon}</span>
                  <h3>{cat.title}</h3>
                </div>
                <div className={styles.pluginTags}>
                  {cat.items.map((item, i) => (
                    <Link to={item.link} className={styles.tag} key={i}>{item.label}</Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="Comprehensive API reference for Countly Enterprise">
      <HomepageHeader />
      <main>
        <QuickLinks />
        <PluginCategories />
      </main>
    </Layout>
  );
}
