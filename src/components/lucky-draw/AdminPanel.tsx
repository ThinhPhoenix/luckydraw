import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Input,
  InputNumber,
  Modal,
  message,
  Popconfirm,
  Select,
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

interface AwardFormData {
  name: string;
  tier: number;
  total: number;
}

const TIER_OPTIONS = [
  { value: 1, label: 'Vàng (Tier 1)', color: 'bg-yellow-500' },
  { value: 2, label: 'Bạc (Tier 2)', color: 'bg-gray-400' },
  { value: 3, label: 'Đồng (Tier 3)', color: 'bg-orange-600' },
  { value: 4, label: 'Khuyến khích (Tier 4)', color: 'bg-blue-500' },
];

function getTierName(tier: number): string {
  const option = TIER_OPTIONS.find((opt) => opt.value === tier);
  return option?.label || `Tier ${tier}`;
}

export function AdminPanel({ isOpen, onClose, onUpdate }: Props) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState<AwardCategory[]>([]);
  const [hasSpun, setHasSpun] = useState(false);

  // Form state for adding/editing awards
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AwardFormData>({
    name: '',
    tier: 1,
    total: 1,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Tên giải thưởng không được để trống';
    }

    if (formData.tier < 1 || formData.tier > 4) {
      errors.tier = 'Cấp độ phải từ 1 đến 4';
    }

    if (formData.total < 1) {
      errors.total = 'Số lượng phải lớn hơn hoặc bằng 1';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAward = () => {
    if (!validateForm()) return;

    LuckyDrawStorage.addAward({
      name: formData.name.trim(),
      tier: formData.tier,
      total: formData.total,
    });

    const state = LuckyDrawStorage.getState();
    setCategories(state.categories);

    // Reset form
    setFormData({ name: '', tier: Math.min(categories.length + 1,4), total: 1 });
    setFormErrors({});
    message.success('Đã thêm giải thưởng mới');
    onUpdate();
  };

  const handleEditAward = (category: AwardCategory) => {
    setIsEditing(true);
    setEditingId(category.id);
    setFormData({
      name: category.name,
      tier: category.tier,
      total: category.total,
    });
    setFormErrors({});
  };

  const handleUpdateAward = () => {
    if (!editingId || !validateForm()) return;

    const category = categories.find((c) => c.id === editingId);
    if (!category) return;

    // Check if reducing total below current winners
    if (formData.total < category.winners.length) {
      setFormErrors({
        total: `Số lượng tối thiểu là ${category.winners.length} (số người đã trúng)`,
      });
      return;
    }

    LuckyDrawStorage.updateAward(editingId, {
      name: formData.name.trim(),
      tier: formData.tier,
      total: formData.total,
    });

    const state = LuckyDrawStorage.getState();
    setCategories(state.categories);

    // Reset form
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: '', tier: 1, total: 1 });
    setFormErrors({});
    message.success('Đã cập nhật giải thưởng');
    onUpdate();
  };

  const handleDeleteAward = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category && category.winners.length > 0) {
      message.error('Không thể xóa giải thưởng đã có người trúng');
      return;
    }

    LuckyDrawStorage.deleteAward(id);
    const state = LuckyDrawStorage.getState();
    setCategories(state.categories);
    message.success('Đã xóa giải thưởng');
    onUpdate();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: '', tier: 1, total: 1 });
    setFormErrors({});
  };

  const getTierBadgeColor = (tier: number) => {
    switch (tier) {
      case 1:
        return 'bg-yellow-500';
      case 2:
        return 'bg-gray-400';
      case 3:
        return 'bg-orange-600';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <Modal
      title="Quản trị hệ thống"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
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
          {/* Award Management Section - Scrollable */}
          <div className="rounded border p-4">
            <h4 className="mb-3 font-bold">Quản lý giải thưởng</h4>
            {hasSpun && (
              <Alert
                message="Không thể chỉnh sửa sau khi đã quay. Nhấn Reset để thay đổi."
                type="warning"
                showIcon
                className="mb-3"
              />
            )}

            {/* Award List - Scrollable */}
            <div className="mb-4 max-h-[200px] overflow-y-auto rounded border bg-gray-50 p-2">
              {categories.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Chưa có giải thưởng nào. Hãy thêm giải thưởng mới.
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center gap-2 rounded bg-white p-2 shadow-sm"
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${getTierBadgeColor(cat.tier)}`}
                      >
                        {cat.tier}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{cat.name}</div>
                        <div className="text-xs text-gray-500">
                          {getTierName(cat.tier)} • {cat.total} giải (
                          {cat.remaining} còn lại)
                        </div>
                      </div>
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        disabled={hasSpun}
                        onClick={() => handleEditAward(cat)}
                      />
                      <Popconfirm
                        title="Xóa giải thưởng?"
                        description="Hành động này không thể hoàn tác"
                        onConfirm={() => handleDeleteAward(cat.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        disabled={hasSpun || cat.winners.length > 0}
                      >
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          disabled={hasSpun || cat.winners.length > 0}
                        />
                      </Popconfirm>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add/Edit Form */}
            <div className="rounded border bg-gray-50 p-3">
              <div className="mb-2 font-medium">
                {isEditing ? 'Chỉnh sửa giải thưởng' : 'Thêm giải thưởng mới'}
              </div>
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="award-name"
                    className="mb-1 block text-sm text-gray-600"
                  >
                    Tên giải thưởng
                  </label>
                  <Input
                    id="award-name"
                    placeholder="Ví dụ: Giải Nhất"
                    value={formData.name}
                    disabled={hasSpun}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {formErrors.name && (
                    <div className="mt-1 text-xs text-red-500">
                      {formErrors.name}
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label
                      htmlFor="award-tier"
                      className="mb-1 block text-sm text-gray-600"
                    >
                      Cấp độ giải
                    </label>
                    <Select
                      id="award-tier"
                      value={formData.tier}
                      disabled={hasSpun}
                      onChange={(value) =>
                        setFormData({ ...formData, tier: value })
                      }
                      className="w-full"
                      options={TIER_OPTIONS.map((opt) => ({
                        value: opt.value,
                        label: (
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-3 w-3 rounded-full ${opt.color}`}
                            />
                            <span>{opt.label}</span>
                          </div>
                        ),
                      }))}
                    />
                    {formErrors.tier && (
                      <div className="mt-1 text-xs text-red-500">
                        {formErrors.tier}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="award-total"
                      className="mb-1 block text-sm text-gray-600"
                    >
                      Số lượng
                    </label>
                    <InputNumber
                      id="award-total"
                      min={1}
                      value={formData.total}
                      disabled={hasSpun}
                      onChange={(value) =>
                        setFormData({ ...formData, total: value || 1 })
                      }
                      className="w-full"
                    />
                    {formErrors.total && (
                      <div className="mt-1 text-xs text-red-500">
                        {formErrors.total}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        type="primary"
                        onClick={handleUpdateAward}
                        disabled={hasSpun}
                        className="flex-1"
                      >
                        Cập nhật
                      </Button>
                      <Button onClick={handleCancelEdit} className="flex-1">
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddAward}
                      disabled={hasSpun}
                      block
                    >
                      Thêm giải thưởng
                    </Button>
                  )}
                </div>
              </div>
            </div>
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
            <div className="mt-1 text-xs text-gray-500">
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
