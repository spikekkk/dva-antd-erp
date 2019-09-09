import React from 'react';
import { connect, } from 'dva';
import HomeComponent from '../../components/home/Home';

function Home({ home, }) {
  // eslint-disable-next-line no-empty-pattern
  let {} = home;

  return (
    <div style={{ padding: 20, }}>
      <HomeComponent />
    </div>
  );
}

function mapStateToProps({ home, }) {
  return { home, };
}

export default connect(mapStateToProps)(Home);
