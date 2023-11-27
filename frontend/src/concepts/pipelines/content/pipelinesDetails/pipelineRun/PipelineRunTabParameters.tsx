import * as React from 'react';
import {
  Spinner,
  EmptyStateVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
} from '@patternfly/react-core';
import { PipelineRunKF } from '~/concepts/pipelines/kfTypes';
import {
  DetailItem,
  renderDetailItems,
} from '~/concepts/pipelines/content/pipelinesDetails/pipelineRun/utils';
type PipelineRunTabParametersProps = {
  pipelineRunKF?: PipelineRunKF;
};

const PipelineRunTabParameters: React.FC<PipelineRunTabParametersProps> = ({ pipelineRunKF }) => {
  if (!pipelineRunKF) {
    return (
      <EmptyState variant={EmptyStateVariant.lg} data-id="loading-empty-state">
        <Spinner size="xl" />
        <EmptyStateHeader titleText="Loading" headingLevel="h4" />
      </EmptyState>
    );
  }

  if (
    !pipelineRunKF?.pipeline_spec.parameters ||
    pipelineRunKF.pipeline_spec.parameters.length === 0
  ) {
    return (
      <EmptyState variant={EmptyStateVariant.lg} data-id="parameters-empty-state">
        <EmptyStateHeader titleText="No parameters" headingLevel="h4" />
        <EmptyStateBody>This pipeline run does not have any parameters defined.</EmptyStateBody>
      </EmptyState>
    );
  }

  const details: DetailItem[] = pipelineRunKF.pipeline_spec.parameters.map((param) => ({
    key: param.name,
    value: param.value,
  }));

  return <>{renderDetailItems(details)}</>;
};

export default PipelineRunTabParameters;
