import { Table } from 'antd';
import type { TableProps } from 'antd';

interface DataTableProps<T = Record<string, any>> extends Omit<TableProps<T>, 'pagination'> {
  total?: number;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  showPagination?: boolean;
}

const DataTable = <T extends Record<string, any>>({
  columns,
  dataSource,
  loading = false,
  rowKey = 'id',
  total = 0,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  showPagination = true,
  ...rest
}: DataTableProps<T>) => {
  const paginationConfig = showPagination ? {
    current: currentPage,
    pageSize,
    total,
    onChange: onPageChange,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条记录`,
    pageSizeOptions: ['10', '20', '50', '100']
  } : false;

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowKey={rowKey}
      pagination={paginationConfig}
      bordered={false}
      {...rest}
    />
  );
};

export default DataTable;
