export const translations = {
  en: {
    // App header
    appTitle: 'BIT240197 Food Manager',
    studentId: 'MSSV: BIT240197',
    
    // Navigation & Tabs
    dishesTab: 'Dishes',
    categoriesTab: 'Categories',
    settingsTab: 'Sync & Settings',
    
    // Screens
    dishListTitle: 'Food Menu',
    dishDetailTitle: 'Dish Details',
    addDishTitle: 'Add New Dish',
    editDishTitle: 'Edit Dish',
    categoriesTitle: 'Dish Categories',
    addCategoryTitle: 'Add Category',
    filterModalTitle: 'Search & Filter',
    
    // Dish Fields
    name: 'Dish Name',
    namePlaceholder: 'Enter dish name...',
    price: 'Price (VND)',
    pricePlaceholder: 'e.g. 50000',
    prepTime: 'Prep Time (minutes)',
    prepTimePlaceholder: 'e.g. 15',
    category: 'Category',
    selectCategory: 'Select a category',
    status: 'Status',
    available: 'Available',
    unavailable: 'Unavailable',
    isAvailableSwitch: 'Available for Sale',
    description: 'Description',
    descriptionPlaceholder: 'Enter delicious details...',
    
    // Images
    imagesSection: 'Dish Images',
    addImageUrl: 'Add Image URL',
    imageUrlPlaceholder: 'https://example.com/image.jpg',
    addImageBtn: 'Add Image',
    noImages: 'No images added yet. Add at least one image.',
    setAsThumbnail: 'Set as Thumbnail',
    isThumbnailBadge: '★ Main Image',
    removeImage: 'Remove',
    
    // Prep time badge
    quickBadge: 'Quick (≤15 min)',
    regularBadge: 'Regular (>15 min)',
    
    // Buttons
    createBtn: 'Create Dish',
    updateBtn: 'Save Changes',
    cancelBtn: 'Cancel',
    deleteBtn: 'Delete',
    editBtn: 'Edit',
    backBtn: 'Back',
    applyBtn: 'Apply',
    resetBtn: 'Reset',
    closeBtn: 'Close',
    
    // Filters & Sorting
    searchPlaceholder: 'Search by dish name...',
    allCategories: 'All Categories',
    filterByPrice: 'Price Range',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    statusFilter: 'Status Filter',
    allStatuses: 'All',
    onlyAvailable: 'Available Only',
    sortBy: 'Sort By',
    sortDefault: 'Default',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    sortPrepAsc: 'Prep Time: Fast first',
    activeFilters: 'Active Filters',
    clearFilters: 'Clear Filters',
    
    // Categories Screen
    categoryName: 'Category Name',
    categoryNamePlaceholder: 'e.g. Appetizer',
    categoryDescription: 'Description',
    categoryDescriptionPlaceholder: 'Description of this category...',
    createCategoryBtn: 'Add Category',
    dishCount: 'dishes',
    noCategories: 'No categories available.',
    
    // Validation & Alerts
    validationError: 'Validation Error',
    nameRequired: 'Dish name cannot be empty.',
    priceInvalid: 'Price must be greater than 0.',
    prepTimeInvalid: 'Preparation time must be greater than 0.',
    categoryRequired: 'Please select a valid category.',
    duplicateNameInCategory: 'A dish with this name already exists in this category.',
    invalidPriceRange: 'Min price cannot be greater than Max price.',
    deleteDishConfirmTitle: 'Delete Dish',
    deleteDishConfirmMsg: 'Are you sure you want to delete "{name}"? This action cannot be undone.',
    deleteCategoryConfirmTitle: 'Delete Category',
    deleteCategoryConfirmMsg: 'Are you sure you want to delete "{name}"?',
    cannotDeleteCategoryInUse: 'Cannot delete this category because {count} dish(es) are currently using it.',
    success: 'Success',
    dishCreatedSuccess: 'Dish created successfully.',
    dishUpdatedSuccess: 'Dish updated successfully.',
    dishDeletedSuccess: 'Dish deleted successfully.',
    categoryCreatedSuccess: 'Category created successfully.',
    categoryDeletedSuccess: 'Category deleted successfully.',
    
    // Empty states
    noDishesFound: 'No dishes found matching your criteria.',
    emptyMenuMsg: 'Menu is currently empty. Tap "+" to add a dish.',
    
    // Sync & Network (Advanced requirement)
    networkStatus: 'Network Status',
    statusOnline: 'Online',
    statusOffline: 'Offline',
    simulatedOfflineTitle: 'Simulate Offline Mode (For Demo)',
    simulatedOfflineDesc: 'Turn this on to test adding/editing dishes offline, then turn off to observe automatic background sync.',
    syncStatusTitle: 'Sync Status',
    syncAllSynced: 'All data is synchronized with MockAPI.',
    syncPending: '{count} change(s) waiting to auto-sync when online.',
    syncingNow: 'Auto-syncing changes with MockAPI...',
    syncOfflineWarning: 'Device is offline. Changes are saved locally and will auto-sync once online.',
    mockApiEndpoint: 'MockAPI Endpoint',
    saveEndpoint: 'Save Endpoint',
    offlineBannerMsg: '⚠️ Working Offline - Changes saved locally to AsyncStorage',
    syncSuccessBannerMsg: '✓ Automatically synchronized changes to MockAPI'
  },
  vi: {
    // App header
    appTitle: 'BIT240197 Quản Lý Món Ăn',
    studentId: 'MSSV: BIT240197',
    
    // Navigation & Tabs
    dishesTab: 'Món ăn',
    categoriesTab: 'Loại món',
    settingsTab: 'Đồng bộ & Cài đặt',
    
    // Screens
    dishListTitle: 'Thực Đơn Món Ăn',
    dishDetailTitle: 'Chi Tiết Món Ăn',
    addDishTitle: 'Thêm Món Ăn Mới',
    editDishTitle: 'Chỉnh Sửa Món Ăn',
    categoriesTitle: 'Danh Mục Loại Món',
    addCategoryTitle: 'Thêm Loại Món',
    filterModalTitle: 'Tìm Kiếm & Bộ Lọc',
    
    // Dish Fields
    name: 'Tên món ăn',
    namePlaceholder: 'Nhập tên món ăn...',
    price: 'Giá bán (VNĐ)',
    pricePlaceholder: 'Ví dụ: 50000',
    prepTime: 'Thời gian chế biến (phút)',
    prepTimePlaceholder: 'Ví dụ: 15',
    category: 'Loại món ăn',
    selectCategory: 'Chọn một loại món',
    status: 'Trạng thái',
    available: 'Đang bán',
    unavailable: 'Ngừng bán',
    isAvailableSwitch: 'Còn phục vụ (Đang bán)',
    description: 'Mô tả',
    descriptionPlaceholder: 'Nhập thông tin giới thiệu món ăn...',
    
    // Images
    imagesSection: 'Hình ảnh món ăn',
    addImageUrl: 'Thêm URL hình ảnh',
    imageUrlPlaceholder: 'https://example.com/anh.jpg',
    addImageBtn: 'Thêm ảnh',
    noImages: 'Chưa có ảnh nào. Vui lòng thêm ít nhất một ảnh.',
    setAsThumbnail: 'Đặt làm ảnh đại diện',
    isThumbnailBadge: '★ Ảnh đại diện',
    removeImage: 'Xóa',
    
    // Prep time badge
    quickBadge: 'Nhanh (≤15 phút)',
    regularBadge: 'Thông thường (>15 phút)',
    
    // Buttons
    createBtn: 'Tạo Món Ăn',
    updateBtn: 'Lưu Thay Đổi',
    cancelBtn: 'Hủy',
    deleteBtn: 'Xóa',
    editBtn: 'Sửa',
    backBtn: 'Quay lại',
    applyBtn: 'Áp dụng',
    resetBtn: 'Đặt lại',
    closeBtn: 'Đóng',
    
    // Filters & Sorting
    searchPlaceholder: 'Tìm theo tên món ăn...',
    allCategories: 'Tất cả loại món',
    filterByPrice: 'Khoảng giá',
    minPrice: 'Giá tối thiểu',
    maxPrice: 'Giá tối đa',
    statusFilter: 'Trạng thái bán',
    allStatuses: 'Tất cả',
    onlyAvailable: 'Chỉ món đang bán',
    sortBy: 'Sắp xếp theo',
    sortDefault: 'Mặc định',
    sortPriceAsc: 'Giá: Tăng dần',
    sortPriceDesc: 'Giá: Giảm dần',
    sortPrepAsc: 'Thời gian chế biến: Nhanh nhất',
    activeFilters: 'Bộ lọc đang áp dụng',
    clearFilters: 'Xóa bộ lọc',
    
    // Categories Screen
    categoryName: 'Tên loại món',
    categoryNamePlaceholder: 'Ví dụ: Khai vị',
    categoryDescription: 'Mô tả',
    categoryDescriptionPlaceholder: 'Mô tả về loại món này...',
    createCategoryBtn: 'Thêm Loại Món',
    dishCount: 'món',
    noCategories: 'Chưa có loại món nào.',
    
    // Validation & Alerts
    validationError: 'Lỗi Dữ Liệu',
    nameRequired: 'Tên món ăn không được để trống.',
    priceInvalid: 'Giá bán phải lớn hơn 0.',
    prepTimeInvalid: 'Thời gian chế biến phải lớn hơn 0.',
    categoryRequired: 'Vui lòng chọn loại món ăn hợp lệ.',
    duplicateNameInCategory: 'Tên món này đã tồn tại trong cùng một loại món.',
    invalidPriceRange: 'Giá tối thiểu không được lớn hơn giá tối đa.',
    deleteDishConfirmTitle: 'Xác Nhận Xóa Món',
    deleteDishConfirmMsg: 'Bạn có chắc chắn muốn xóa món "{name}"? Thao tác này không thể hoàn tác.',
    deleteCategoryConfirmTitle: 'Xác Nhận Xóa Loại Món',
    deleteCategoryConfirmMsg: 'Bạn có chắc chắn muốn xóa loại món "{name}"?',
    cannotDeleteCategoryInUse: 'Không thể xóa loại món này vì đang có {count} món ăn sử dụng.',
    success: 'Thành Công',
    dishCreatedSuccess: 'Đã thêm món ăn thành công.',
    dishUpdatedSuccess: 'Đã cập nhật món ăn thành công.',
    dishDeletedSuccess: 'Đã xóa món ăn thành công.',
    categoryCreatedSuccess: 'Đã thêm loại món thành công.',
    categoryDeletedSuccess: 'Đã xóa loại món thành công.',
    
    // Empty states
    noDishesFound: 'Không tìm thấy món ăn nào phù hợp với điều kiện lọc.',
    emptyMenuMsg: 'Danh sách món ăn đang trống. Bấm "+" để thêm món.',
    
    // Sync & Network (Advanced requirement)
    networkStatus: 'Trạng thái mạng',
    statusOnline: 'Trực tuyến (Online)',
    statusOffline: 'Ngoại tuyến (Offline)',
    simulatedOfflineTitle: 'Chế độ giả lập Ngoại tuyến (Để quay Demo)',
    simulatedOfflineDesc: 'Bật tùy chọn này để demo thao tác thêm/sửa món khi mất mạng, sau đó tắt đi để xem ứng dụng tự động đồng bộ lên MockAPI.',
    syncStatusTitle: 'Trạng thái đồng bộ',
    syncAllSynced: 'Toàn bộ dữ liệu đã được đồng bộ với MockAPI.',
    syncPending: 'Có {count} thay đổi đang chờ tự động đồng bộ khi có mạng.',
    syncingNow: 'Đang tự động đồng bộ dữ liệu với MockAPI...',
    syncOfflineWarning: 'Thiết bị đang ngoại tuyến. Dữ liệu được lưu an toàn tại máy và sẽ tự đồng bộ khi có mạng.',
    mockApiEndpoint: 'Địa chỉ MockAPI Endpoint',
    saveEndpoint: 'Lưu Endpoint',
    offlineBannerMsg: '⚠️ Đang làm việc Ngoại tuyến - Dữ liệu đã lưu vào AsyncStorage',
    syncSuccessBannerMsg: '✓ Đã tự động đồng bộ dữ liệu lên MockAPI'
  }
};
