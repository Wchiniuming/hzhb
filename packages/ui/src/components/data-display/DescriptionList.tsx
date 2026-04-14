import { Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';

interface DescriptionItem {
  label: string;
  value: React.ReactNode;
  span?: number;
}

interface DescriptionListProps extends Omit<DescriptionsProps, 'items'> {
  items: DescriptionItem[];
  column?: number;
  title?: string;
  bordered?: boolean;
}

const DescriptionList: React.FC<DescriptionListProps> = ({
  items,
  column = 2,
  title,
  bordered = false,
  ...rest
}) => {
  return (
    <Descriptions
      title={title}
      bordered={bordered}
      column={column}
      items={items.map(item => ({
        label: item.label,
        children: item.value,
        span: item.span
      }))}
      {...rest}
    />
  );
};

export default DescriptionList;
