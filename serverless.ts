import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'desafioignite7',
  frameworkVersion: '2',
  plugins: [
    'serverless-esbuild',
    "serverless-dynamodb-local" ,
    "serverless-offline"
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:*"],
        Resource: ["*"]
      }
    ]
  },
  package: {individually: false},
  // import the function via paths
  functions: { 
    createToDo: {
      handler: "src/functions/createtodo.handler",
      events: [
        {
          http: {
            path: "todo/{user_id}",
            method: "post",

            cors: true
          }
        }
      ]
    },
    getToDo: {
      handler: "src/functions/gettodo.handler",
      events: [
        {
          http: {
            path: "todo/{user_id}",
            method: "get",

            cors: true
          }
        }
      ]
    }
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      stages: ["dev", "local"],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true
      }
    }
  },
  resources: {
    Resources: {
      //criação da tabela é feita só com index, sk e pk.
      dbToDo: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "todo",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S"
            },
            {
              AttributeName: "user_id",
              AttributeType: "S"
            }
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH"
            }
          ],
          BillingMode: "PAY_PER_REQUEST",
          GlobalSecondaryIndexes: [
            {
              IndexName: "user_id_index",
              KeySchema: [
                {
                  AttributeName: "user_id",
                  KeyType: "HASH"
                }
              ],
              Projection: {
                ProjectionType: "ALL"
              },
              ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
              }
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          },
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;