import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Button, Col, Row } from 'antd';
import { div } from 'framer-motion/client';
import { useEffect, useState } from 'react';
import i18n from '@/helpers/i18n';
import { useListTodos } from '@/services/hooks/todo/use-list-todos';
import type { TodoDto } from '@/types/dto/todo.dto';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  useEffect(() => {
    router.navigate({
      to: '/lucky-draw',
    });
  }, []);
  return <div></div>;
}
