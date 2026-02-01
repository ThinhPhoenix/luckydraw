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
    setFormData({
      name: '',
      tier: Math.min(categories.length + 1, 4),
      total: 1,
    });
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
      title={
        <div className="flex items-center gap-2 text-tet-deep-red font-playfair">
          <span className="text-xl">🏮</span>
          <span>Quản trị hệ thống</span>
          <span className="text-xl">🏮</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      className="tet-modal"
      style={{
        background: '#fffdf5',
        border: '2px solid #d2042d',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(210, 4, 45, 0.3)',
      }}
    >
      {!isAuthenticated ? (
        <div className="flex flex-col gap-6 py-8 px-4">
          {/* Red Envelope Login Style */}
          <div className="relative mx-auto w-full max-w-xs">
            <div
              className="rounded-lg bg-gradient-to-br from-tet-red to-tet-deep-red p-6 shadow-lg"
              style={{ boxShadow: '0 8px 24px rgba(210, 4, 45, 0.4)' }}
            >
              <div className="mb-4 text-center">
                <span className="text-4xl">🧧</span>
              </div>
              <div className="text-center mb-4">
                <span className="text-tet-cream font-playfair text-lg">
                  Nhập mật khẩu để tiếp tục
                </span>
              </div>
              <Input.Password
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onPressEnter={handleLogin}
                className="mb-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ffd700',
                }}
              />
              <Button
                type="primary"
                onClick={handleLogin}
                block
                style={{
                  background:
                    'linear-gradient(135deg, #ffd700 0%, #ffbf00 100%)',
                  border: 'none',
                  color: '#8b0000',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(255, 191, 0, 0.5)',
                }}
              >
                Đăng nhập
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 bg-gradient-to-b from-tet-cream/30 to-transparent p-4 rounded-lg">
          {/* Award Management Section - Scrollable */}
          <div
            className="rounded-xl border-2 border-tet-gold/50 bg-white/80 p-4 shadow-lg"
            style={{ boxShadow: '0 4px 20px rgba(255, 215, 0, 0.2)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🏆</span>
              <h4 className="font-bold text-tet-deep-red font-playfair text-lg">
                Quản lý giải thưởng
              </h4>
            </div>
            {hasSpun && (
              <Alert
                message="Không thể chỉnh sửa sau khi đã quay. Nhấn Reset để thay đổi."
                type="warning"
                showIcon
                className="mb-3 border-tet-amber bg-gradient-to-r from-tet-amber/10 to-transparent"
                style={{ borderLeft: '4px solid #ffbf00' }}
              />
            )}

            {/* Award List - Scrollable */}
            <div className="mb-4 max-h-[200px] overflow-y-auto rounded-lg border border-tet-gold/30 bg-gradient-to-b from-tet-cream/20 to-white p-2 shadow-inner">
              {categories.length === 0 ? (
                <div className="p-4 text-center text-tet-deep-red/70">
                  <span className="text-2xl block mb-2">🎁</span>
                  Chưa có giải thưởng nào. Hãy thêm giải thưởng mới!
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-white to-tet-cream/30 p-3 shadow-sm border border-tet-gold/20"
                      style={{ boxShadow: '0 2px 8px rgba(255, 215, 0, 0.15)' }}
                    >
                      {/* Coin-style tier badge */}
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md ${getTierBadgeColor(cat.tier)}`}
                        style={{
                          boxShadow:
                            '0 2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.3)',
                          border: '2px solid rgba(255,255,255,0.4)',
                        }}
                      >
                        {cat.tier}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium text-tet-deep-red">
                          {cat.name}
                        </div>
                        <div className="text-xs text-tet-deep-red/60">
                          <span className="font-semibold">
                            {getTierName(cat.tier)}
                          </span>
                          {' • '}
                          <span className="text-tet-amber font-bold">
                            {cat.total} giải
                          </span>
                          {' ('}
                          <span className="text-green-600">
                            {cat.remaining} còn lại
                          </span>
                          {')'}
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
            <div className="rounded-xl border border-tet-gold/30 bg-gradient-to-br from-tet-cream/40 to-white p-4 shadow-md">
              <div className="mb-3 font-medium text-tet-deep-red flex items-center gap-2">
                <span className="text-lg">{isEditing ? '✏️' : '➕'}</span>
                <span className="font-playfair">
                  {isEditing ? 'Chỉnh sửa giải thưởng' : 'Thêm giải thưởng mới'}
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="award-name"
                    className="mb-1 block text-sm font-medium text-tet-deep-red/80"
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
                    style={{ borderColor: 'rgba(255, 215, 0, 0.5)' }}
                  />
                  {formErrors.name && (
                    <div className="mt-1 text-xs text-tet-red font-medium">
                      {formErrors.name}
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label
                      htmlFor="award-tier"
                      className="mb-1 block text-sm font-medium text-tet-deep-red/80"
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
                              className={`h-3 w-3 rounded-full shadow-sm ${opt.color}`}
                              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
                            />
                            <span className="font-medium">{opt.label}</span>
                          </div>
                        ),
                      }))}
                    />
                    {formErrors.tier && (
                      <div className="mt-1 text-xs text-tet-red font-medium">
                        {formErrors.tier}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="award-total"
                      className="mb-1 block text-sm font-medium text-tet-deep-red/80"
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
                      style={{ borderColor: 'rgba(255, 215, 0, 0.5)' }}
                    />
                    {formErrors.total && (
                      <div className="mt-1 text-xs text-tet-red font-medium">
                        {formErrors.total}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  {isEditing ? (
                    <>
                      <Button
                        type="primary"
                        onClick={handleUpdateAward}
                        disabled={hasSpun}
                        className="flex-1"
                        style={{
                          background:
                            'linear-gradient(135deg, #ffd700 0%, #ffbf00 100%)',
                          border: 'none',
                          color: '#8b0000',
                          fontWeight: 'bold',
                        }}
                      >
                        ✓ Cập nhật
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        className="flex-1"
                        style={{
                          border: '1px solid #d2042d',
                          color: '#d2042d',
                        }}
                      >
                        ✕ Hủy
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddAward}
                      disabled={hasSpun}
                      block
                      style={{
                        background:
                          'linear-gradient(135deg, #ffd700 0%, #ffbf00 100%)',
                        border: 'none',
                        color: '#8b0000',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(255, 191, 0, 0.4)',
                      }}
                    >
                      Thêm giải thưởng
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Data Management Section */}
          <div className="rounded-xl border border-tet-amber/30 bg-gradient-to-r from-tet-cream/30 to-white p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📋</span>
              <h4 className="font-bold text-tet-deep-red font-playfair">
                Quản lý dữ liệu
              </h4>
            </div>
            <Upload
              beforeUpload={handleFileUpload}
              showUploadList={false}
              accept=".txt,.csv"
            >
              <Button
                block
                style={{
                  background:
                    'linear-gradient(135deg, #fff8e7 0%, #fffdd0 100%)',
                  border: '1px solid #d2042d',
                  color: '#8b0000',
                }}
              >
                📥 Nhập danh sách nhân viên (.txt)
              </Button>
            </Upload>
            <div className="mt-2 text-xs text-tet-deep-red/60 flex items-center gap-1">
              <span>💡</span>
              File .txt, mỗi tên một dòng
            </div>
          </div>

          {/* Export Section */}
          <div className="rounded-xl border border-tet-gold/40 bg-gradient-to-r from-tet-cream/40 to-white p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📊</span>
              <h4 className="font-bold text-tet-deep-red font-playfair">
                Xuất kết quả
              </h4>
            </div>
            <Button
              block
              onClick={handleExport}
              style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #ffbf00 100%)',
                border: 'none',
                color: '#8b0000',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(255, 191, 0, 0.4)',
              }}
            >
              📤 Xuất CSV người trúng giải
            </Button>
          </div>

          {/* Danger Zone - Styled with Tet warning elements */}
          <div
            className="rounded-xl border-2 border-tet-red bg-gradient-to-br from-red-50 to-tet-red/10 p-4 shadow-md"
            style={{ boxShadow: '0 4px 16px rgba(210, 4, 45, 0.2)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl animate-pulse">⚠️</span>
              <h4 className="font-bold text-tet-red font-playfair text-lg">
                Vùng nguy hiểm
              </h4>
            </div>
            <div className="mb-3 p-2 rounded bg-white/60 border border-tet-red/20 text-sm text-tet-deep-red">
              <span className="font-bold">⚡ Cẩn thận:</span> Hành động này sẽ
              xóa tất cả dữ liệu và không thể hoàn tác!
            </div>
            <Popconfirm
              title={
                <span className="text-tet-red font-bold">
                  Xóa toàn bộ dữ liệu?
                </span>
              }
              description={
                <span className="text-tet-deep-red">
                  Hành động này không thể hoàn tác
                </span>
              }
              onConfirm={handleReset}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{
                style: { background: '#d2042d', borderColor: '#d2042d' },
              }}
            >
              <Button
                danger
                block
                style={{
                  background:
                    'linear-gradient(135deg, #d2042d 0%, #8b0000 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(210, 4, 45, 0.4)',
                }}
              >
                🗑️ Reset toàn bộ hệ thống
              </Button>
            </Popconfirm>
          </div>
        </div>
      )}
    </Modal>
  );
}
