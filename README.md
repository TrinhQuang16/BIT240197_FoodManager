# BIT240197_FoodManager - Ứng Dụng Quản Lý Món Ăn

> **Bài kiểm tra giữa kỳ - Môn Phát triển ứng dụng di động**  
> **Sinh viên thực hiện (MSSV):** `BIT240197`  
> **Tên đề tài:** Quản lý món ăn (Food Manager)  
> **Công nghệ:** React Native (Expo SDK 58, TypeScript, AsyncStorage, NetInfo, MockAPI REST)

---

## 1. Kiến Trúc & Thiết Kế Dữ Liệu (Bắt buộc tiền tố `BIT240197_`)

Theo đúng quy định của đề thi (tránh bị trừ 1–3 điểm): toàn bộ bảng và trường dữ liệu lưu trữ đều có tiền tố `BIT240197_`.

### 1.1. Bảng `BIT240197_DishCategory`
- `BIT240197_Id`: Mã định danh loại món (string)
- `BIT240197_Name`: Tên loại món (string, không rỗng)
- `BIT240197_Description`: Mô tả loại món

### 1.2. Bảng `BIT240197_Dish`
- `BIT240197_Id`: Mã định danh món ăn (string)
- `BIT240197_Name`: Tên món ăn (string, không trùng trong cùng 1 loại)
- `BIT240197_Price`: Giá bán (> 0)
- `BIT240197_PreparationTime`: Thời gian chế biến tính bằng phút (> 0)
- `BIT240197_IsAvailable`: Trạng thái phục vụ (boolean - Đang bán / Ngừng bán)
- `BIT240197_Description`: Mô tả chi tiết món ăn
- `BIT240197_DishCategoryId`: Khóa ngoại tham chiếu đến `BIT240197_DishCategory`
- `BIT240197_DishImage`: Danh sách ảnh gồm:
  - `BIT240197_ImageUrl`: Đường dẫn ảnh
  - `BIT240197_IsThumbnail`: Đánh dấu ảnh đại diện (Tối đa 01 ảnh true)

### 1.3. Khóa lưu trữ Local (AsyncStorage)
- `@BIT240197_DishCategory`: Danh sách loại món
- `@BIT240197_Dish`: Danh sách món ăn
- `@BIT240197_SyncQueue`: Hàng đợi đồng bộ khi ngoại tuyến
- `@BIT240197_Language`: Ngôn ngữ đã chọn (Mặc định `en`, hỗ trợ `vi`)
- `@BIT240197_FilterState`: Lưu trạng thái bộ lọc khi quay lại màn hình
- `@BIT240197_MockApiUrl`: Cấu hình MockAPI endpoint

---

## 2. Đáp Ứng Đầy Đủ Các Yêu Cầu Đề Thi

| Yêu cầu | Điểm | Hiện thực trong ứng dụng |
| :--- | :---: | :--- |
| **Thiết kế 2 model, dữ liệu tối thiểu, validation** | **0,75** | Seed sẵn 3 loại món, 5 món ăn. Validation: Tên không rỗng, Giá > 0, Thời gian > 0, Tên không trùng trong cùng category. |
| **Giao diện danh sách, chi tiết, thêm, sửa, xóa** | **1,25** | Màn hình List, Detail, Form thêm/sửa, dialog xác nhận xóa món. Form chọn category từ danh sách. |
| **Tìm kiếm, lọc nhiều điều kiện, sắp xếp, giữ bộ lọc** | **0,75** | Phối hợp đồng thời: tìm theo tên, lọc category, lọc đang bán, khoảng giá (min - max). Sắp xếp theo giá tăng/giảm, thời gian chế biến. Giữ bộ lọc khi quay lại màn hình danh sách. |
| **Quản lý nhiều ảnh, thay đổi ảnh đại diện** | **0,50** | Thêm ảnh qua URL, gallery nhiều ảnh ở màn hình chi tiết, chuyển đổi ảnh đại diện (`IsThumbnail = true`), tối đa 1 thumbnail. |
| **Phân loại thời gian & ràng buộc nghiệp vụ** | **0,50** | Nhãn "Quick / Nhanh" (≤15 phút) và "Regular / Thông thường" (>15 phút) tính dynamic. Chặn xóa category đang có món sử dụng. Món ngừng bán vẫn ở list nhưng ẩn khi lọc "Đang bán". |
| **Đa ngôn ngữ (English mặc định ↔ Tiếng Việt)** | **0,75** | Mặc định khởi động là English, nút chuyển sang Tiếng Việt ngay trên header, dịch nhãn, nút, trạng thái, validation, lưu giữ ngôn ngữ. |
| **Nâng cao: Hoạt động offline & Tự động đồng bộ** | **1,50** | Khi mất mạng (hoặc bật toggle Giả lập Ngoại tuyến): dữ liệu lưu vào local AsyncStorage + ghi vào queue. Khi có mạng trở lại: tự động đồng bộ lên MockAPI qua NetInfo listener (KHÔNG cần bấm nút "Đồng bộ"). |
| **Video 1: Demo ứng dụng** | **2,00** | Quay màn hình trong ca học. |
| **Video 2: Thuyết minh mã nguồn** | **2,00** | Hạn 23/10/2026. |

---

## 3. Hướng Dẫn Chạy Ứng Dụng

### Khởi động dự án:
```bash
# Chạy ứng dụng Expo
npm start

# Hoặc chạy trên Android Emulator:
npm run android
```

### Chạy kiểm tra chất lượng code:
```bash
# Typecheck TypeScript (0 lỗi)
npx tsc --noEmit

# Kiểm tra tương thích Expo (20/20 checks passed)
npx expo-doctor
```

---

## 4. Kịch Bản Quay Video 1: Demo Ứng Dụng (2,0 Điểm - Nộp trong ca học)
Thời lượng khuyến nghị: 2 - 3 phút.

1. **Mở đầu (15s):**
   - Mở app, chỉ vào Header hiển thị rõ: `BIT240197 Food Manager`, `MSSV: BIT240197`.
   - Giới thiệu ngôn ngữ mặc định là **English**.
2. **Demo Chuyển đổi ngôn ngữ (15s):**
   - Bấm nút `EN` trên Header để chuyển sang `VI` (Tiếng Việt) → toàn bộ nhãn, nút, trạng thái chuyển sang Tiếng Việt.
   - Bấm lại chuyển về English để chứng minh khả năng chuyển đổi hai chiều.
3. **Demo Danh sách & Chi tiết món ăn (30s):**
   - Lướt danh sách món ăn (đã seed sẵn 5 món thuộc 3 loại, có ảnh đẹp, hiển thị giá VND).
   - Chỉ vào nhãn phân loại thời gian: món `Phở Bò` (12 phút) có nhãn xanh **Quick (≤15 min)**, món `Bún Chả` (20 phút) có nhãn **Regular (>15 min)**.
   - Bấm vào 1 món ăn để vào màn hình **Chi tiết (Detail)**: xem gallery nhiều ảnh, bấm đổi ảnh đại diện (Set as Thumbnail).
4. **Demo Tìm kiếm, Lọc đa điều kiện & Sắp xếp (30s):**
   - Bấm vào icon Bộ lọc:
     - Nhập tìm kiếm tên: "Phở".
     - Chọn Category: "Main Courses".
     - Chọn chỉ món đang bán: "Available Only".
     - Nhập khoảng giá: 50000 - 80000.
     - Chọn sắp xếp: Giá tăng dần / Thời gian chế biến.
   - Bấm Áp dụng → Danh sách lọc chính xác kết hợp nhiều điều kiện.
   - Bấm vào chi tiết 1 món rồi bấm Quay lại (Back) → Các điều kiện lọc vẫn được giữ nguyên.
5. **Demo Thêm, Sửa, Xóa món & Ràng buộc nghiệp vụ (30s):**
   - Bấm nút `+` (Add Dish) để thêm món mới: thử để trống tên hoặc nhập giá âm → hiện thông báo Validation lỗi.
   - Thêm món mới với tên trùng trong cùng category → hiện cảnh báo trùng tên.
   - Thêm món hợp lệ → danh sách cập nhật ngay.
   - Chuyển sang Tab "Categories" (Loại món): Thử xóa loại món đang có món ăn trực thuộc → app hiện cảnh báo từ chối xóa vì đang có món sử dụng.
6. **Demo Phần nâng cao: Offline & Tự động đồng bộ (30s - Điểm 10):**
   - Vào Tab "Sync & Settings":
   - Bật công tắc **"Simulate Offline Mode (For Demo)"** (hoặc tắt Wifi emulator): Banner đỏ hiện lên báo "Working Offline - Changes saved locally".
   - Quay lại thêm 1 món mới hoặc chỉnh sửa giá 1 món → Dữ liệu lưu thành công vào máy, hàng đợi hiện `1 change pending`.
   - Quay lại Tab Settings, tắt công tắc Offline (bật mạng trở lại) → Quan sát app **TỰ ĐỘNG** thực hiện đồng bộ lên MockAPI, hàng đợi xóa dần về 0 mà **không hề cần bấm nút "Đồng bộ"**.

---

## 5. Kịch Bản Thuyết Minh Video 2: Mã Nguồn & Chức Năng (2,0 Điểm - Hạn 23/10/2026)

Khi quay Video 2 thuyết minh code, fen mở VS Code và trình bày theo thứ tự sau:

1. **Cấu trúc thư mục dự án:**
   - `src/types/index.ts`: Chỉ rõ các interface `BIT240197_Dish`, `BIT240197_DishCategory`, `BIT240197_DishImage`. Nhấn mạnh với giảng viên: **Mọi tên thuộc tính và bảng đều có tiền tố `BIT240197_`**.
   - `src/services/storageService.ts`: Sử dụng `AsyncStorage` với các key `@BIT240197_DishCategory`, `@BIT240197_Dish`, `@BIT240197_SyncQueue`, dữ liệu seed tối thiểu 3 loại món và 5 món.
   - `src/i18n/translations.ts`: Hệ thống từ điển đa ngôn ngữ EN và VI, mặc định `en`.
   - `src/services/syncService.ts` & `mockApiService.ts`: Cơ chế lắng nghe `NetInfo` để tự động kích hoạt `processSyncQueue()` khi phát hiện có mạng trở lại.
   - `src/context/AppContext.tsx`: Quản lý state tập trung, xử lý toàn bộ validation nghiệp vụ (không trùng tên cùng loại, chặn xóa category đang dùng, tối đa 1 thumbnail).
   - `src/screens/` & `src/components/`: Giao diện chia tách module rõ ràng, tối ưu trải nghiệm người dùng di động.
