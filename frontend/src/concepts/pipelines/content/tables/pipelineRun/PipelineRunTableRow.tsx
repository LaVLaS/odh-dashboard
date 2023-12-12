import * as React from 'react';
import { ActionsColumn, TableText, Td, Tr } from '@patternfly/react-table';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from '@patternfly/react-core';
import { PipelineRunKF, PipelineRunStatusesKF } from '~/concepts/pipelines/kfTypes';
import { TableRowTitleDescription, CheckboxTd } from '~/components/table';
import {
  RunCreated,
  RunDuration,
  CoreResourceExperiment,
  CoreResourcePipeline,
  RunStatus,
} from '~/concepts/pipelines/content/tables/renderUtils';
import { usePipelinesAPI } from '~/concepts/pipelines/context';
import { GetJobInformation } from '~/concepts/pipelines/content/tables/pipelineRun/useJobRelatedInformation';
import useNotification from '~/utilities/useNotification';

type PipelineRunTableRowProps = {
  isChecked: boolean;
  onToggleCheck: () => void;
  onDelete: () => void;
  run: PipelineRunKF;
  getJobInformation: GetJobInformation;
};

const PipelineRunTableRow: React.FC<PipelineRunTableRowProps> = ({
  isChecked,
  onToggleCheck,
  onDelete,
  run,
  getJobInformation,
}) => {
  const { namespace, api, refreshAllAPI } = usePipelinesAPI();
  const { loading, data } = getJobInformation(run);
  const notification = useNotification();
  const navigate = useNavigate();

  const loadingState = <Skeleton />;

  return (
    <Tr>
      <CheckboxTd id={run.id} isChecked={isChecked} onToggle={onToggleCheck} />
      <Td>
        {loading ? (
          loadingState
        ) : (
          <TableRowTitleDescription
            title={
              <Link to={`/pipelineRuns/${namespace}/pipelineRun/view/${run.id}`}>
                <TableText wrapModifier="truncate">
                  {data ? `Run of ${data.name}` : run.name}
                </TableText>
              </Link>
            }
            description={
              data
                ? `${run.name}\n${run.description ?? ''}\n${data.description ?? ''}`
                : run.description
            }
            descriptionAsMarkdown
          />
        )}
      </Td>
      <Td>
        <CoreResourceExperiment resource={run} />
      </Td>
      <Td modifier="truncate">
        {loading ? (
          loadingState
        ) : (
          <CoreResourcePipeline resource={data || run} namespace={namespace} />
        )}
      </Td>
      <Td>
        <RunCreated run={run} />
      </Td>
      <Td>
        <RunDuration run={run} />
      </Td>
      <Td>
        <RunStatus justIcon run={run} />
      </Td>
      <Td isActionCell>
        <ActionsColumn
          items={[
            {
              title: 'Stop',
              isDisabled: run.status !== PipelineRunStatusesKF.RUNNING,
              onClick: () => {
                api
                  .stopPipelineRun({}, run.id)
                  .then(refreshAllAPI)
                  .catch((e) => notification.error('Unable to stop pipeline run', e.message));
              },
            },
            {
              title: 'Duplicate',
              onClick: () => {
                navigate(`/pipelineRuns/${namespace}/pipelineRun/clone/${run.id}`);
              },
            },
            {
              isSeparator: true,
            },
            {
              title: 'Delete',
              onClick: () => {
                onDelete();
              },
            },
          ]}
        />
      </Td>
    </Tr>
  );
};

export default PipelineRunTableRow;
