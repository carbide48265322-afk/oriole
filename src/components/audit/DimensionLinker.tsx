/* eslint-disable no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Transfer } from 'antd';
import type { AuditDimension } from '@/types/audit';
import type { Key } from 'antd/es/table/interface';

export interface DimensionLinkerProps {
  dimensions: AuditDimension[];
  selectedIds: string[];
  onConfirm: (ids: string[]) => void;
  onCancel: () => void;
  open: boolean;
  confirmLoading?: boolean;
}

export default function DimensionLinker({
  dimensions,
  selectedIds,
  onConfirm,
  onCancel,
  open,
  confirmLoading = false,
}: DimensionLinkerProps) {
  const [targetKeys, setTargetKeys] = useState<string[]>(selectedIds);

  useEffect(() => {
    setTargetKeys(selectedIds);
  }, [selectedIds, open]);

  const dataSource = dimensions.map((dim) => ({
    key: dim.id,
    title: dim.name,
    disabled: false,
  }));

  const handleChange = (newTargetKeys: Key[]) => {
    setTargetKeys(newTargetKeys as string[]);
  };

  const handleConfirm = () => {
    onConfirm(targetKeys);
  };

  const handleCancel = () => {
    setTargetKeys(selectedIds);
    onCancel();
  };

  return (
    <Modal
      title="关联维度"
      open={open}
      onOk={handleConfirm}
      onCancel={handleCancel}
      okText="保存"
      cancelText="取消"
      destroyOnHidden
    >
      <Transfer
        dataSource={dataSource}
        titles={['可选维度', '已选维度']}
        targetKeys={targetKeys}
        onChange={handleChange}
        render={(item) => item.title}
        styles={{
          section: {
            width: 200,
            height: 300,
          },
        }}
      />
    </Modal>
  );
}
