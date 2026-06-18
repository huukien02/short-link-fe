import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // ⭐ Quy ước Component Wrapper Layer (xem CLAUDE.md):
  // Cấm import shadcn primitives (@/components/ui/*) trực tiếp ngoài tầng wrapper.
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/components/ui/*"],
              message:
                "Không import shadcn ui/* trực tiếp. Hãy dùng component trong @/components/common/* (xem CLAUDE.md).",
            },
          ],
        },
      ],
    },
  },
  // Ngoại lệ: chính tầng wrapper được phép đụng tới ui/*.
  {
    files: ["src/components/ui/**", "src/components/common/**"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
