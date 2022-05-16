import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: "Share what I've learn",
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Sometimes I want to share what I've learn/share. No matter It's funny, interesting, changlenging or tough, extremly annoynce.
      </>
    ),
  },
  {
    title: "Share what I think",
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        I always ask myself <strong>WH</strong> question for which problem that I face with
      </>
    ),
  },
  {
    title: "Share what I wanna show",
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Sometimes, somewhere and somehow, I wanna show how cool my project is</>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
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
