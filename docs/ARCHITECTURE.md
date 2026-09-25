# Architecture

This application uses Next.js App Router, TypeScript, React, Tailwind CSS 4 and next-intl. Routes live under `src/app/[locale]`; the client workspace shell provides tenant selection, navigation, language selection and theme state. Page features live in `src/features`, shared UI in `src/components`, typed entities in `src/domain/models.ts`, deterministic seed records in `src/data/demo`, and calculation/service logic in `src/lib` and `src/services`.

Repository adapters persist demo findings, evaluation records, metrics and audit entries in browser localStorage under an `iaa-v1:` prefix. This is demo persistence, not server-side authorization or production tenant isolation. UI permissions are role-based demo checks only. The evaluation runner is deterministic and does not call external AI systems. Project checks are `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build`.
