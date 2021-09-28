import {
  ComponentInstance, getCurrentInstance, reactive,
} from '@vue/composition-api';

export interface ComponentInstanceExtension extends ComponentInstance {
  $moment: any;
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
