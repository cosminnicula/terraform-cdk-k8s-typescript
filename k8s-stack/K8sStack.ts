import { Construct } from "constructs";
import { TerraformStack } from "cdktf";
import * as kubernetes from '@cdktf/provider-kubernetes'

import { DbStack } from "./db/DbStack";
import { WebStack } from "./web/WebStack";
import { WordStack } from "./word/WordStack";
import { IK8sConfig } from "./config/IK8sConfig";

export class K8sStack extends TerraformStack {
  constructor(scope: Construct, name: string, config: IK8sConfig) {
    super(scope, name);

    const { kubeConfigPath } = config;

    new kubernetes.KubernetesProvider(this, 'minikube', {
      configPath: kubeConfigPath
    })

    new DbStack(this, 'db', config);
    new WebStack(this, 'web', config);
    new WordStack(this, 'word', config);
  }
}