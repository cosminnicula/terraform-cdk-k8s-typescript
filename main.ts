import { App } from "cdktf";
import * as dotenv from "dotenv";
import * as path from 'path'

import { K8sStack } from './k8s-stack/K8sStack';
import { IK8sConfig } from './k8s-stack/config/IK8sConfig';

dotenv.config();

const validateEnvironmentVariables = () => {
  if (!process.env.K8S_NAMESPACE) {
    throw new Error('Missing K8S_NAMESPACE environment variable.');
  }

  if (!process.env.WEB_PORT) {
    throw new Error('Missing WEB_PORT environment variable.');
  }
};

const createStack = () => { 
  const app = new App();
  const k8sConfig: IK8sConfig = {
    namespace: process.env.K8S_NAMESPACE!,
    webPort: Number(process.env.WEB_PORT!),
    kubeConfigPath: path.join(__dirname, '/', process.env.KUBE_CONFIG_RELATIVE_PATH!)
  }

  new K8sStack(app, "k8s-stack", k8sConfig);
  app.synth();

  return app;
};

(() => {
  validateEnvironmentVariables();
  createStack();
})();

