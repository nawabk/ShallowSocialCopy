import React from 'react';
import { withNProgress } from '@tanem/react-nprogress';

import Bar from './Bar';
import Container from './Container';
import Spinner from './Spinner';

const Progress = ({ isFinished, progress, animationDuration }) => (
  <Container isFinished={isFinished} animationDuration={animationDuration}>
    <Bar progress={progress} animationDuration={animationDuration} />
    <Spinner />
  </Container>
);

export default withNProgress(Progress);
