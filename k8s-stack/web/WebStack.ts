import { Construct } from "constructs";
import * as kubernetes from '@cdktf/provider-kubernetes'

import { IK8sConfig } from "../config/IK8sConfig";

export class WebStack extends Construct {
  public readonly deployment: kubernetes.Deployment;
  public readonly service: kubernetes.Service;

  constructor(scope: Construct, name: string, config: IK8sConfig) {
    super(scope, name);

    const { namespace, webPort } = config;

    this.deployment = new kubernetes.Deployment(this, "web", {
      metadata: {
        namespace,
        labels:
        {
          app: "words-web",
        },
        name: "web",
      },
      spec: {
        selector: {
          matchLabels:
          {
            app: "words-web",
          },
        },
        template: {
          metadata: {
            labels:
            {
              app: "words-web",
            },
          },
          spec: {
            container: [
              {
                image: "dockersamples/k8s-wordsmith-web",
                name: "web",
                port: [
                  {
                    containerPort: 80,
                    name: "words-web",
                  },
                ],
              },
            ],
          },
        },
      },
    });

    this.service = new kubernetes.Service(this, "web_4", {
      metadata: {
        namespace,
        labels:
        {
          app: "words-web",
        },
        name: "web",
      },
      spec: {
        port: [
          {
            name: "web",
            nodePort: webPort,
            port: 8081,
            targetPort: "80",
          },
        ],
        selector:
        {
          app: "words-web",
        },
        type: "NodePort",
      },
    });

    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    this.service.overrideLogicalId("web");
  }
}