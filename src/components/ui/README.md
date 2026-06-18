# components/ui — shadcn primitives

> ⚠️ **Chỉ tầng `components/common/*` được import từ đây.**
> Page/feature trong `app/*` **KHÔNG** được import trực tiếp `@/components/ui/*` (ESLint sẽ báo lỗi).

Thư mục này chứa component shadcn gốc, thêm bằng:

```bash
npx shadcn@latest add button table dialog input form ...
```

Khi cần dùng một primitive ở app: thêm vào đây → tạo wrapper trong `components/common/` → page dùng wrapper.
