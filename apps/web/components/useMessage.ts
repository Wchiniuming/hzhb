'use client';

import { useState, useEffect } from 'react';
import { message as antdMessage, App } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';

export function useMessage(): MessageInstance {
  const [staticMessage] = useState(() => antdMessage);
  const [instance, setInstance] = useState<MessageInstance | null>(null);

  useEffect(() => {
    const msg = App.useMessage();
    setInstance(msg);
  }, []);

  return (instance || staticMessage) as MessageInstance;
}
