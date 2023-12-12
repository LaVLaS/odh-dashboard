import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Route, Routes } from 'react-router-dom';
import { rest } from 'msw';
import GlobalPipelineCoreDetails from '~/pages/pipelines/global/GlobalPipelineCoreDetails';
import { mockK8sResourceList } from '~/__mocks__/mockK8sResourceList';
import { mockProjectK8sResource } from '~/__mocks__/mockProjectK8sResource';
import { mockNotebookK8sResource } from '~/__mocks__/mockNotebookK8sResource';
import GlobalPipelineCoreLoader from '~/pages/pipelines/global/GlobalPipelineCoreLoader';
import { mockDataSciencePipelineApplicationK8sResource } from '~/__mocks__/mockDataSciencePipelinesApplicationK8sResource';
import { mockSecretK8sResource } from '~/__mocks__/mockSecretK8sResource';
import { mockRouteK8sResource } from '~/__mocks__/mockRouteK8sResource';
import PipelineDetails from '~/concepts/pipelines/content/pipelinesDetails/pipeline/PipelineDetails';
import { mockPipelineKF } from '~/__mocks__/mockPipelineKF';
import { mockPipelinesTemplateResourceKF } from '~/__mocks__/mockPipelinesTemplateResourceKF';

export default {
  component: PipelineDetails,
  parameters: {
    reactRouter: {
      routePath: '/pipelines/:namespace/view/:pipelineId/*',
      routeParams: { namespace: 'test-project', pipelineId: 'test-pipeline' },
    },
    msw: {
      handlers: [
        rest.post('/api/proxy/apis/v1beta1/pipelines/test-pipeline', (req, res, ctx) =>
          res(ctx.json(mockPipelineKF({}))),
        ),
        rest.post('/api/proxy/apis/v1beta1/pipelines/test-pipeline/templates', (req, res, ctx) =>
          res(ctx.json(mockPipelinesTemplateResourceKF())),
        ),
        rest.get(
          '/api/k8s/apis/route.openshift.io/v1/namespaces/test-project/routes/ds-pipeline-pipelines-definition',
          (req, res, ctx) =>
            res(
              ctx.json(mockRouteK8sResource({ notebookName: 'ds-pipeline-pipelines-definition' })),
            ),
        ),
        rest.get(
          '/api/k8s/api/v1/namespaces/test-project/secrets/ds-pipeline-config',
          (req, res, ctx) => res(ctx.json(mockSecretK8sResource({ name: 'ds-pipeline-config' }))),
        ),
        rest.get(
          '/api/k8s/api/v1/namespaces/test-project/secrets/aws-connection-testdb',
          (req, res, ctx) =>
            res(ctx.json(mockSecretK8sResource({ name: 'aws-connection-testdb' }))),
        ),
        rest.get(
          'api/k8s/apis/datasciencepipelinesapplications.opendatahub.io/v1alpha1/namespaces/test-project/datasciencepipelinesapplications/pipelines-definition',
          (req, res, ctx) => res(ctx.json(mockDataSciencePipelineApplicationK8sResource({}))),
        ),
        rest.get(
          '/api/k8s/apis/kubeflow.org/v1/namespaces/test-project/notebooks',
          (req, res, ctx) => res(ctx.json(mockK8sResourceList([mockNotebookK8sResource({})]))),
        ),
        rest.get('/api/k8s/apis/project.openshift.io/v1/projects', (req, res, ctx) =>
          res(ctx.json(mockK8sResourceList([mockProjectK8sResource({})]))),
        ),
      ],
    },
  },
} as Meta<typeof PipelineDetails>;

export const Default: StoryObj = {
  render: () => (
    <Routes>
      <Route
        path="/:namespace?/*"
        element={
          <GlobalPipelineCoreLoader
            title={'Test Pipeline'}
            getInvalidRedirectPath={(namespace) => `${namespace}/pipeline/`}
          />
        }
      >
        <Route
          path="*"
          element={
            <GlobalPipelineCoreDetails
              BreadcrumbDetailsComponent={PipelineDetails}
              pageName="Runs"
              redirectPath={(namespace) => `${namespace}/pipeline/`}
            />
          }
        />
      </Route>
    </Routes>
  ),
};
