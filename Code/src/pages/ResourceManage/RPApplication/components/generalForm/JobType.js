import React, { memo } from 'react';

import JobTypea from './JobTypea';
import JobTypeb from './JobTypeb';
import JobTypec from './JobTypec';

const Index = () => (
  <>
    <JobTypea />
    <JobTypeb />
    <JobTypec />
  </>
);
export default memo(Index);
