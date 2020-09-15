export default `import { useContext, createContext } from 'react';
import root from './root';

export { observer, inject } from 'mobx-react';
export const MobxStoreContext = createContext(root);
export const MobxStoreConsumer = MobxStoreContext.Consumer;
export const MobxStoreProvider = MobxStoreContext.Provider;
export function useMobxStore() {
  return useContext(MobxStoreContext);
}

`;
