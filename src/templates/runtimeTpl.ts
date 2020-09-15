export default `import React from 'react';
import { Provider } from 'mobx-react';
import root from './root';
import { MobxStoreProvider } from './';

export function rootContainer(container) {
  return React.createElement(Provider, root, React.createElement(MobxStoreProvider, { value: root }, container));
}

`;
