import React, {FC, useCallback, useEffect, useMemo, useState} from "react";
import './Table.scss';

type TWorker = {
  id: number;
  isActive: boolean;
  isMaster: boolean;
  sent: number;
  processed: number;
}

export const Table: FC = props => {
  const [ workers, setWorkers ] = useState<Array<TWorker>>([]);

  useEffect(() => {
    if (!workers.length) {
      fetch('http://localhost:8000/workers')
        .then(response => response.json())
        .then(items => { setWorkers(items)})
    }
  });

  const handleClick = useCallback((id: number, state: boolean) => {
    return () => {
      fetch(`http://localhost:8000/workers/${id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({isActive: state})}
        )
        .then(response => response.json())
        .then(items => { setWorkers(items)})
    }
  }, []);

  const sentTotal = useMemo(() => {
    return workers.reduce((sum, item) => {return sum + item.sent}, 0)
  }, [workers])
  const processedTotal = useMemo(() => {
    return workers.reduce((sum, item) => {return sum + item.sent}, 0)
  }, [workers])

  return (
    <div className="table">
      <Row>
        <Column>ID</Column>
        <Column>IsActive</Column>
        <Column>IsMaster</Column>
        <Column>Sent</Column>
        <Column>Processed</Column>
        <Column>Stop/Run</Column>
      </Row>
      {workers.map(worker => (
        <Row>
          <Column>{worker.id}</Column>
          <Column>{worker.isActive ? 'active' : 'stopped'}</Column>
          <Column>{worker.isMaster ? 'master' : 'worker'}</Column>
          <Column>{worker.sent}</Column>
          <Column>{worker.processed}</Column>
          <Column>
            <button onClick={handleClick(worker.id, !worker.isActive)}>{worker.isActive ? 'Stop' : 'Run'}</button>
          </Column>
        </Row>
      ))}
      <Row>
        <Column>Total</Column>
        <Column/>
        <Column/>
        <Column>{sentTotal}</Column>
        <Column>{processedTotal}</Column>
        <Column/>
      </Row>
    </div>
  )
}

const Column: FC = ({children}) => {
  return <div className="column">{children}</div>
}

const Row: FC = ({children}) => {
  return (
    <div className="row">
      {children}
    </div>
  )
}