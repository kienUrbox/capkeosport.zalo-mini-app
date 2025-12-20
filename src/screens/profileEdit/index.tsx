import { useNavigate } from 'react-router-dom'

import { ScreenWrapper } from '../../components/common'
import { FormInput, FormSelect, PrimaryButton } from '../../components/ui'

const EditProfileScreen = () => {
  const navigate = useNavigate()

  return (
    <ScreenWrapper title="Chỉnh sửa hồ sơ" subtitle="Cập nhật thông tin cá nhân">
      <div className="space-y-4">
        <FormInput label="Họ & tên" defaultValue="Nguyễn Tiến" />
        <FormSelect label="Vai trò chính" defaultValue="winger">
          <option value="winger">Tiền đạo cánh</option>
          <option value="midfielder">Tiền vệ</option>
          <option value="defender">Hậu vệ</option>
          <option value="goalkeeper">Thủ môn</option>
        </FormSelect>
        <FormInput label="Chiều cao" placeholder="Ví dụ: 1m75" />
        <FormInput label="Ghi chú" placeholder="Điểm mạnh, phong cách chơi..." />
      </div>
      <div className="mt-auto space-y-3">
        <PrimaryButton onClick={() => navigate('/profile')}>
          Lưu thay đổi
        </PrimaryButton>
      </div>
    </ScreenWrapper>
  )
}

export default EditProfileScreen

