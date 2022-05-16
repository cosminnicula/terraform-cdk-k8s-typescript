import { Construct } from "constructs";
import * as kubernetes from '@cdktf/provider-kubernetes'

import { IK8sConfig } from "../config/IK8sConfig";

export class WordStack extends Construct {
  public readonly deployment: kubernetes.Deployment;
  public readonly service: kubernetes.Service;

  constructor(scope: Construct, name: string, config: IK8sConfig) {
    super(scope, name);

    const { namespace } = config;

    this.deployment = new kubernetes.Deployment(this, "words", {
        metadata: {
          namespace,
          labels:
          {
            app: "words-api",
          },
          name: "words",
        },
        spec: {
          replicas: '5',
          selector: {
            matchLabels:
            {
              app: "words-api",
            },
          },
          template: {
            metadata: {
              labels:
              {
                app: "words-api",
              },
            },
            spec: {
              container: [
                {
                  image: "dockersamples/k8s-wordsmith-api",
                  name: "words",
                  port: [
                    {
                      containerPort: 8080,
                      name: "api",
                    },
                  ],
                },
              ],
            },
          },
        },
      });
      
      this.service = new kubernetes.Service(this, "words_5", {
        metadata: {
          namespace,
          labels:
          {
            app: "words-api",
          },
          name: "words",
        },
        spec: {
          clusterIp: "None",
          port: [
            {
              name: "api",
              port: 8080,
              targetPort: "8080",
            },
          ],
          selector:
          {
            app: "words-api",
          },
        },
      });
  
      /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
      this.service.overrideLogicalId("words");
  }
}