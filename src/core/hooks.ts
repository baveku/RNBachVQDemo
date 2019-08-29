import { shallowEqual, useSelector } from 'react-redux';
import { IRootState } from './types';
import { useMemo } from 'react';

export * from './modules/task/hooks';

// const getShallowMemoizedSelector = (selector: ()) => {
//   let latestResult: any;
//   return (state: any) => {
//     const result = selector(state);
//     if (shallowEqual(result, latestResult) {
//       return latestResult;
//     }
//     return (latestlResult = result);
//   }
// }

// const useObjectSelector = (selector: (state: IRootState) => void) => {
//   const memoizedSelector = useMemo(
//     () => getShallowMemoizedSelector(selector),
//     [selector]
//   );
//   return useSelector(memoizedSelector);
// }