
export const PAGE_CONFIG: any = {
    home: {
        label: 'Trang chủ (Home)',
        sections: {
            hero: {
                label: 'Hero Section (Đầu trang)',
                fields: [
                    { key: 'badge', label: 'Badge (Thẻ nhỏ)', type: 'text' },
                    { key: 'title_1', label: 'Dòng tiêu đề 1', type: 'text' },
                    { key: 'title_highlight', label: 'Dòng tiêu đề nổi bật (Màu)', type: 'text' },
                    { key: 'description', label: 'Mô tả ngắn', type: 'textarea' },
                    { key: 'btn_primary', label: 'Nút chính', type: 'text' },
                    { key: 'btn_secondary', label: 'Nút phụ', type: 'text' }
                ]
            },
            services: {
                label: 'Services Intro (Giới thiệu dịch vụ)',
                fields: [
                    { key: 'subtitle', label: 'Tiêu đề phụ', type: 'text' },
                    { key: 'title', label: 'Tiêu đề chính', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' }
                ]
            },
            about: {
                label: 'About Section (Giới thiệu ngắn)',
                fields: [
                    { key: 'subtitle', label: 'Tiêu đề phụ', type: 'text' },
                    { key: 'title_1', label: 'Tiêu đề dòng 1', type: 'text' },
                    { key: 'title_highlight', label: 'Tiêu đề nổi bật', type: 'text' },
                    { key: 'desc_1', label: 'Đoạn văn 1', type: 'textarea' },
                    { key: 'desc_2', label: 'Đoạn văn 2', type: 'textarea' },
                    { key: 'stat_1_val', label: 'Số liệu 1 (Dự án)', type: 'text' },
                    { key: 'stat_2_val', label: 'Số liệu 2 (Hài lòng)', type: 'text' }
                ]
            },
            cta: {
                label: 'Call to Action (Cuối trang)',
                fields: [
                    { key: 'title', label: 'Tiêu đề', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' },
                    { key: 'btn_text', label: 'Nút bấm', type: 'text' }
                ]
            }
        }
    },
    about: {
        label: 'Về chúng tôi (About)',
        sections: {
            hero: {
                label: 'Hero Section',
                fields: [
                    { key: 'since_text', label: 'Dòng Since', type: 'text' },
                    { key: 'title_main', label: 'Tiêu đề chính', type: 'text' },
                    { key: 'title_sub', label: 'Tiêu đề phụ (Màu)', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' },
                    { key: 'stat_1', label: 'Số liệu 1', type: 'text' },
                    { key: 'stat_2', label: 'Số liệu 2', type: 'text' },
                    { key: 'stat_3', label: 'Số liệu 3', type: 'text' }
                ]
            },
            mission: {
                label: 'Tầm nhìn & Sứ mệnh',
                fields: [
                    { key: 'subtitle', label: 'Tiêu đề nhỏ', type: 'text' },
                    { key: 'title', label: 'Tiêu đề lớn', type: 'text' },
                    { key: 'desc_1', label: 'Mô tả 1', type: 'textarea' },
                    { key: 'desc_2', label: 'Mô tả 2', type: 'textarea' },
                    { key: 'vision_title', label: 'Tiêu đề Tầm nhìn', type: 'text' },
                    { key: 'vision_desc', label: 'Nội dung Tầm nhìn', type: 'textarea' },
                    { key: 'mission_title', label: 'Tiêu đề Sứ mệnh', type: 'text' },
                    { key: 'mission_desc', label: 'Nội dung Sứ mệnh', type: 'textarea' }
                ]
            },
            core_values: {
                label: 'Giá trị cốt lõi',
                fields: [
                    { key: 'subtitle', label: 'Tiêu đề nhỏ', type: 'text' },
                    { key: 'title', label: 'Tiêu đề lớn', type: 'text' },
                    { key: 'desc', label: 'Mô tả', type: 'textarea' }
                ]
            },
            cta: {
                label: 'CTA Cuối trang',
                fields: [
                    { key: 'title', label: 'Tiêu đề', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' },
                    { key: 'btn_text', label: 'Nút bấm', type: 'text' }
                ]
            }
        }
    },
    services: {
        label: 'Dịch vụ (Tổng quan)',
        sections: {
            hero: {
                label: 'Hero Section',
                fields: [
                    { key: 'badge', label: 'Badge', type: 'text' },
                    { key: 'title', label: 'Tiêu đề', type: 'text' },
                    { key: 'title_highlight', label: 'Tiêu đề nổi bật', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' }
                ]
            },
            cta: {
                label: 'CTA Cuối trang',
                fields: [
                    { key: 'title', label: 'Tiêu đề', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' },
                    { key: 'btn_text', label: 'Nút bấm', type: 'text' }
                ]
            }
        }
    },
    website_design: {
        label: 'DV: Thiết kế Website',
        sections: {
            hero: {
                label: 'Hero Section',
                fields: [
                    { key: 'badge', label: 'Badge', type: 'text' },
                    { key: 'title', label: 'Tiêu đề', type: 'text' },
                    { key: 'title_highlight', label: 'Tiêu đề nổi bật', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' },
                    { key: 'btn_primary', label: 'Nút chính', type: 'text' },
                    { key: 'btn_secondary', label: 'Nút phụ', type: 'text' }
                ]
            },
            features: {
                label: 'Tính năng nổi bật',
                fields: [
                    { key: 'subtitle', label: 'Tiêu đề nhỏ', type: 'text' },
                    { key: 'title', label: 'Tiêu đề lớn', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' }
                ]
            },
            tech_stack: {
                label: 'Tech Stack',
                fields: [
                    { key: 'subtitle', label: 'Tiêu đề nhỏ', type: 'text' },
                    { key: 'title', label: 'Tiêu đề lớn', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' }
                ]
            },
            configurator: {
                label: 'Cấu hình Website',
                fields: [
                    { key: 'subtitle', label: 'Tiêu đề nhỏ', type: 'text' },
                    { key: 'title', label: 'Tiêu đề lớn', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' }
                ]
            },
            cta: {
                label: 'CTA Cuối trang',
                fields: [
                    { key: 'title', label: 'Tiêu đề', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' },
                    { key: 'btn_text', label: 'Nút bấm', type: 'text' }
                ]
            }
        }
    },
    email_service: {
        label: 'DV: Email Doanh nghiệp',
        sections: {
            hero: {
                label: 'Hero Section',
                fields: [
                    { key: 'title_1', label: 'Dòng 1', type: 'text' },
                    { key: 'title_highlight', label: 'Dòng 2 (Màu)', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' },
                    { key: 'btn_text', label: 'Nút bấm', type: 'text' }
                ]
            },
            features: {
                label: 'Tính năng',
                fields: [
                    { key: 'subtitle', label: 'Tiêu đề nhỏ', type: 'text' },
                    { key: 'title', label: 'Tiêu đề lớn', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' }
                ]
            },
            pricing: {
                label: 'Bảng giá',
                fields: [
                    { key: 'subtitle', label: 'Tiêu đề nhỏ', type: 'text' },
                    { key: 'title', label: 'Tiêu đề lớn', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' }
                ]
            }
        }
    },
    branding: {
        label: 'DV: Branding',
        sections: {
            hero: {
                label: 'Hero Section',
                fields: [
                    { key: 'title_1', label: 'Dòng 1', type: 'text' },
                    { key: 'title_highlight', label: 'Phần màu', type: 'text' },
                    { key: 'title_2', label: 'Dòng 2', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' },
                    { key: 'btn_primary', label: 'Nút chính', type: 'text' },
                    { key: 'btn_secondary', label: 'Nút phụ', type: 'text' }
                ]
            },
            philosophy: {
                label: 'Triết lý',
                fields: [
                    { key: 'title', label: 'Tiêu đề lớn', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' }
                ]
            },
            services_list: {
                label: 'Danh sách dịch vụ',
                fields: [
                    { key: 'subtitle', label: 'Tiêu đề nhỏ', type: 'text' },
                    { key: 'title', label: 'Tiêu đề lớn', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' }
                ]
            },
            simulator: {
                label: 'Mô phỏng (Simulator)',
                fields: [
                    { key: 'subtitle', label: 'Tiêu đề nhỏ', type: 'text' },
                    { key: 'title', label: 'Tiêu đề lớn', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' }
                ]
            },
            process: {
                label: 'Quy trình',
                fields: [
                    { key: 'subtitle', label: 'Tiêu đề nhỏ', type: 'text' },
                    { key: 'title', label: 'Tiêu đề lớn', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' }
                ]
            },
            cta: {
                label: 'CTA Cuối trang',
                fields: [
                    { key: 'title', label: 'Dòng 1', type: 'text' },
                    { key: 'title_highlight', label: 'Phần màu', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' },
                    { key: 'btn_text', label: 'Nút bấm', type: 'text' }
                ]
            }
        }
    },
    digital_marketing: {
        label: 'DV: Digital Marketing',
        sections: {
            hero: {
                label: 'Hero Section',
                fields: [
                    { key: 'badge', label: 'Badge', type: 'text' },
                    { key: 'title_1', label: 'Dòng 1', type: 'text' },
                    { key: 'title_highlight', label: 'Phần màu', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' },
                    { key: 'btn_primary', label: 'Nút chính', type: 'text' },
                    { key: 'btn_secondary', label: 'Nút phụ', type: 'text' }
                ]
            },
            services: {
                label: 'Dịch vụ chính',
                fields: [
                    { key: 'subtitle', label: 'Tiêu đề nhỏ', type: 'text' },
                    { key: 'title', label: 'Tiêu đề lớn', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' }
                ]
            },
            cta: {
                label: 'CTA Cuối trang',
                fields: [
                    { key: 'title', label: 'Tiêu đề', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' },
                    { key: 'btn_text', label: 'Nút bấm', type: 'text' }
                ]
            }
        }
    },
    tech_solutions: {
        label: 'DV: Giải pháp Công nghệ',
        sections: {
            hero: {
                label: 'Hero Section',
                fields: [
                    { key: 'badge', label: 'Badge', type: 'text' },
                    { key: 'title_1', label: 'Dòng 1', type: 'text' },
                    { key: 'title_highlight', label: 'Phần màu', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' },
                    { key: 'btn_primary', label: 'Nút chính', type: 'text' },
                    { key: 'btn_secondary', label: 'Nút phụ', type: 'text' }
                ]
            },
            solutions: {
                label: 'Danh sách Giải pháp',
                fields: [
                    { key: 'subtitle', label: 'Tiêu đề nhỏ', type: 'text' },
                    { key: 'title', label: 'Tiêu đề lớn', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' }
                ]
            },
            cta: {
                label: 'CTA Cuối trang',
                fields: [
                    { key: 'title', label: 'Tiêu đề', type: 'text' },
                    { key: 'description', label: 'Mô tả', type: 'textarea' },
                    { key: 'btn_text', label: 'Nút bấm', type: 'text' }
                ]
            }
        }
    }
};
