import React from 'react';
import { useMobxStore, observer } from 'umi';

function Index() {
  const { foo } = useMobxStore();
  return (
    <div>
      record: {JSON.stringify(foo)}
      <input value={foo.bar} onChange={(event) => foo.setBar(event.target.value)} />
      <button onClick={foo.clearBar}>Clear</button>
    </div>
  );
}

export default observer(Index);
