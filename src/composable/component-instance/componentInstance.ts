/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ComponentInstance, getCurrentInstance, reactive,
} from '@vue/composition-api';
import moment from 'moment';

export interface ComponentInstanceExtension extends ComponentInstance {
  $moment: typeof moment;
  $refs: any;
}

export const getInstance = () => {
  const InternalInstance = getCurrentInstance();
  const instance = reactive<ComponentInstanceExtension>(
    InternalInstance?.proxy as ComponentInstanceExtension,
  );

  return {
    instance,
  };
};
