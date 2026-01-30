import {
  Alert,
  Button,
  Input,
  InputNumber,
  Modal,
  message,
  Popconfirm,
  Upload,
} from 'antd';
import { useEffect, useState } from 'react';
import { LuckyDrawStorage } from '@/helpers/lucky-draw-storage';
import type { AwardCategory, Employee } from '@/types/lucky-draw.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function AdminPanel({ isOpen, onClose, onUpdate }: Props) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState<AwardCategory[]>([]);
  const [hasSpun, setHasSpun] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      const state = LuckyDrawStorage.getState();
      setCategories(state.categories);
      setHasSpun(state.hasSpun);
    }
  }, [isAuthenticated, isOpen]);

  const handleLogin = () => {
    if (password === 'djoy2025') {
      setIsAuthenticated(true);
      message.success('Đăng nhập admin thành công');
    } else {
      message.error('Sai mật khẩu');
    }
  };

  const handleFileUpload = (file: any) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const employees: Employee[] = [];

        lines.forEach((line, index) => {
          const name = line.trim();
          if (name) {
            employees.push({
              id: index + 1,
              name,
              isWinner: false,
              award: null,
            });
          }
        });

        LuckyDrawStorage.initializeWithEmployees(employees);
        message.success(`Đã nhập ${employees.length} nhân viên`);
        onUpdate();
      } catch (error) {
        message.error('Lỗi đọc file');
      }
    };
    reader.readAsText(file);
    return false;
  };

  const handleReset = () => {
    LuckyDrawStorage.resetState();
    onUpdate();
    onClose();
  };

  const handleExport = () => {
    LuckyDrawStorage.exportWinnersCSV();
  };

  const handleCategoryCountChange = (categoryId: string, value: number) => {
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return;

    const currentWinners = cat.winners.length;

    if (value < currentWinners) {
      setValidationErrors({
        ...validationErrors,
        [categoryId]: `Số giải thưởng tối thiểu là ${currentWinners} (số người đã trúng)`,
      });
      return;
    }

    if (value < 1) {
      setValidationErrors({
        ...validationErrors,
        [categoryId]: 'Số lượng tối thiểu là 1',
      });
      return;
    }

    const newErrors = { ...validationErrors };
    delete newErrors[categoryId];
    setValidationErrors(newErrors);

    const updatedCategories = categories.map((cat) =>
      cat.id === categoryId
        ? { ...cat, total: value, remaining: value - cat.winners.length }
        : cat,
    );
    setCategories(updatedCategories);
  };

  const handleSaveCategoryCounts = () => {
    const counts = categories.map((cat) => ({
      id: cat.id,
      total: cat.total,
    }));

    LuckyDrawStorage.updateCategoryCounts(counts);
    onUpdate();
    message.success('Đã cập nhật số lượng giải thưởng');
  };

  return (
    <Modal
      title="Quản trị hệ thống"
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      {!isAuthenticated ? (
        <div className="flex flex-col gap-4">
          <Input.Password
            placeholder="Nhập mật khẩu admin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPressEnter={handleLogin}
          />
          <Button type="primary" onClick={handleLogin}>
            Đăng nhập
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="rounded border p-4">
            <h4 className="mb-3 font-bold">Cấu hình giải thưởng</h4>
            {hasSpun && (
              <Alert
                message="Không thể chỉnh sửa sau khi đã quay. Nhấn Reset để thay đổi."
                type="warning"
                showIcon
                className="mb-3"
              />
            )}
            <div className="flex flex-col gap-3">
              {categories.map((cat) => (
                <div key={cat.id}>
                  <div className="flex items-center gap-2">
                    <span className="flex-1 text-sm">{cat.name}</span>
                    <InputNumber
                      min={1}
                      value={cat.total}
                      disabled={hasSpun}
                      onChange={(value) =>
                        handleCategoryCountChange(cat.id, value || 1)
                      }
                      className="w-24"
                    />
                  </div>
                  {validationErrors[cat.id] && (
                    <div className="text-xs text-red-500 mt-1">
                      {validationErrors[cat.id]}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="primary"
              block
              className="mt-3"
              disabled={hasSpun || Object.keys(validationErrors).length > 0}
              onClick={handleSaveCategoryCounts}
            >
              Lưu cấu hình giải thưởng
            </Button>
          </div>

          <div className="rounded border p-4">
            <h4 className="mb-2 font-bold">Quản lý dữ liệu</h4>
            <Upload
              beforeUpload={handleFileUpload}
              showUploadList={false}
              accept=".txt,.csv"
            >
              <Button block>Nhập danh sách nhân viên (.txt)</Button>
            </Upload>
            <div className="text-xs text-gray-500 mt-1">
              File .txt, mỗi tên một dòng
            </div>
          </div>

          <div className="rounded border p-4">
            <h4 className="mb-2 font-bold">Xuất kết quả</h4>
            <Button block onClick={handleExport}>
              Xuất CSV người trúng giải
            </Button>
          </div>

          <div className="rounded border border-red-200 bg-red-50 p-4">
            <h4 className="mb-2 font-bold text-red-600">Vùng nguy hiểm</h4>
            <Popconfirm
              title="Xóa toàn bộ dữ liệu?"
              description="Hành động này không thể hoàn tác"
              onConfirm={handleReset}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button danger block>
                Reset toàn bộ hệ thống
              </Button>
            </Popconfirm>
          </div>
        </div>
      )}
    </Modal>
  );
}
