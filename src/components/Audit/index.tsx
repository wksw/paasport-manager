import React from 'react';
import { Modal } from 'antd';

type AuditDetailProps = {
  auditDetail: AUDIT.AuditInfo;
  visible: boolean;
  cancel: (visible: boolean) => void;
};

export const AuditDetail: React.FC<AuditDetailProps> = (props) => {
  const { auditDetail, visible, cancel } = props;
  const detail = { ...auditDetail };
  if (detail) {
    if (detail.request) {
      detail.request = JSON.parse(atob(detail.request));
    }
    if (detail.resource) {
      detail.resource = JSON.parse(detail.resource);
    }
    if (detail.header) {
      detail.header = JSON.parse(atob(detail.header));
    }
  }

  return (
    <Modal
      bodyStyle={{ width: '100px' }}
      visible={visible}
      // onOk={() => setAuditDetailVisible(false)}
      onCancel={() => cancel(false)}
      closable={false}
      centered
      footer={null}
      maskClosable={true}
      width={800}
    >
      <pre style={{ width: '750px' }}>{JSON.stringify(detail, null, 2)}</pre>
    </Modal>
  );
};
