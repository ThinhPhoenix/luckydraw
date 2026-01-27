import { useState } from 'react';
import { Button, Input, Modal, Upload, message, Popconfirm } from 'antd';
import { LuckyDrawStorage } from '@/helpers/lucky-draw-storage';
import type { Employee } from '@/types/lucky-draw.types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export function AdminPanel({ isOpen, onClose, onUpdate }: Props) {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        if (password === 'djoy2025') { // Hardcoded simple password
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
                            award: null
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
    }

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
                        onChange={e => setPassword(e.target.value)}
                        onPressEnter={handleLogin}
                    />
                    <Button type="primary" onClick={handleLogin}>Đăng nhập</Button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="rounded border p-4">
                        <h4 className="mb-2 font-bold">Quản lý dữ liệu</h4>
                        <Upload beforeUpload={handleFileUpload} showUploadList={false} accept=".txt,.csv">
                            <Button block>Nhập danh sách nhân viên (.txt)</Button>
                        </Upload>
                        <div className="text-xs text-gray-500 mt-1">File .txt, mỗi tên một dòng</div>
                    </div>

                    <div className="rounded border p-4">
                        <h4 className="mb-2 font-bold">Xuất kết quả</h4>
                        <Button block onClick={handleExport}>Xuất CSV người trúng giải</Button>
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
                            <Button danger block>Reset toàn bộ hệ thống</Button>
                        </Popconfirm>
                    </div>
                </div>
            )}
        </Modal>
    );
}
