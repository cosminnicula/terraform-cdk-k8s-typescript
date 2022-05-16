import { Construct } from "constructs";
import * as kubernetes from '@cdktf/provider-kubernetes'

import { IK8sConfig } from "../config/IK8sConfig";

export class DbStack extends Construct {
  public readonly deployment: kubernetes.Deployment;
  public readonly service: kubernetes.Service;

  constructor(scope: Construct, name: string, config: IK8sConfig) {
    super(scope, name);

    const { namespace } = config;

    this.deployment = new kubernetes.Deployment(this, "db", {
      metadata: {
        namespace,
        labels:
        {
          app: "words-db",
        },
        name: "db",
      },
      spec: {
        selector: {
          matchLabels:
          {
            app: "words-db",
          },
        },
        template: {
          metadata: {
            labels:
            {
              app: "words-db",
            },
          },
          spec: {
            container: [
              {
                image: "dockersamples/k8s-wordsmith-db",
                name: "db",
                port: [
                  {
                    containerPort: 5432,
                    name: "db",
                  },
                ],
              },
            ],
          },
        },
      },
    });

    this.service = new kubernetes.Service(this, "db_3", {
      metadata: {
        namespace,
        labels:
        {
          app: "words-db",
        },
        name: "db",
      },
      spec: {
        clusterIp: "None",
        port: [
          {
            name: "db",
            port: 5432,
            targetPort: "5432",
          },
        ],
        selector:
        {
          app: "words-db",
        },
      },
    });

    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    this.service.overrideLogicalId("db");
  }
}