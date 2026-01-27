# AGENTS.md

This document provides guidelines for AI coding agents working in this React TypeScript codebase.

## Build, Lint, and Test Commands

### Development

```bash
bun dev                    # Start development server (opens browser automatically)
bun preview                # Preview production build
```

### Build

```bash
bun build                  # Production build using Rsbuild
```

### Linting and Formatting

```bash
bun check                  # Run Biome linter and formatter with auto-fix
bun pretty                 # Run Prettier formatter
bun format                 # Custom format script for src
```

### Code Generation

```bash
bun run assets:gen         # Generate asset files
bun run i18n:gen           # Generate i18n translation files
```

### Testing

**Note:** This project does not currently have a test suite configured. When adding tests:

- Use a testing framework compatible with Bun (e.g., Bun's built-in test runner)
- Place test files alongside source files with `.test.ts` or `.test.tsx` extension
- Follow the naming pattern: `<filename>.test.ts` or `<filename>.test.tsx`

## Project Structure

```
src/
├── assets/              # Static assets
├── helpers/             # Utility functions and constants
│   ├── constants/       # Configuration constants (env-config.ts, etc.)
│   └── i18n/            # i18n configuration
├── locales/             # Translation files
│   ├── common/          # Common translations (en-US.ts, vi-VN.ts)
│   └── exception/       # Exception/error translations
├── providers/           # React context providers
├── routes/              # TanStack Router route components
├── services/            # API services and hooks
│   ├── endpoints.ts     # API endpoint definitions
│   └── hooks/           # React Query hooks
│       ├── common/      # Common hooks (use-toast.ts)
│       └── todo/        # Feature-specific hooks
├── types/               # TypeScript type definitions
│   ├── dto/             # Data transfer objects
│   └── enums/           # Enumerations
├── app.tsx              # Main App component
├── index.tsx            # Application entry point
└── global.css           # Global styles
```

## Code Style Guidelines

### TypeScript Configuration

- **Strict mode enabled:** All strict type checking rules are enforced
- **No unused locals/parameters:** Remove unused variables and parameters
- **ES2020 target:** Use modern JavaScript features
- **Module resolution:** Uses `bundler` mode with path aliases

### Import Conventions

- **Path aliases:** Use `@/` for imports from `src/` directory
  ```typescript
  import { envConfig } from '@/helpers/constants/env-config';
  import type { TodoDto } from '@/types/dto/todo.dto';
  ```
- **Import organization:** Biome auto-organizes imports (run `bun check`)
- **Type imports:** Use `type` keyword for type-only imports
  ```typescript
  import type { TodoDto } from '@/types/dto/todo.dto';
  ```
- **Import order:** External packages first, then internal imports with `@/` alias

### Formatting

- **Quotes:** Single quotes for JavaScript/TypeScript (`'` not `"`)
- **Indentation:** Spaces (configured in Biome)
- **Line endings:** LF (Unix-style)
- **Module syntax:** Use ESM (`import`/`export`, not `require`)

### Naming Conventions

- **Files:** kebab-case for files (`use-list-todos.ts`, `env-config.ts`)
- **Components:** PascalCase for React components (`RouteComponent`, `ToastProvider`)
- **Hooks:** camelCase with `use` prefix (`useListTodos`, `useToast`)
- **Types/Interfaces:** PascalCase with descriptive suffixes (`TodoDto`, `TokenStorageType`)
- **Constants:** camelCase for objects, SCREAMING_SNAKE_CASE for primitives
- **Functions:** camelCase (`handleClick`, `createRouter`)

### Type Definitions

- **Prefer interfaces for DTOs:** Use `interface` for data shapes
  ```typescript
  export interface TodoDto {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  }
  ```
- **Type annotations:** Include return types for exported functions
- **Generics:** Use for reusable components and utilities
- **Avoid `any`:** Use proper types or `unknown` if type is truly unknown

### React Conventions

- **Functional components:** Use function declarations, not arrow functions for named exports
  ```typescript
  function RouteComponent() {
    /* ... */
  }
  ```
- **Hooks:** Follow React hooks rules; custom hooks must start with `use`
- **TanStack Router:** Use `createFileRoute` for route definitions
  ```typescript
  export const Route = createFileRoute('/')({
    component: RouteComponent,
  });
  ```
- **State management:** Use TanStack Query for server state, React state for UI state

### API and Data Fetching

- **Endpoints:** Define all API endpoints in `src/services/endpoints.ts`
- **Custom hooks:** Create custom hooks in `src/services/hooks/` for queries
- **React Query:** Use `useQuery` for GET requests, return `{ data, error, isLoading }`
- **Axios instance:** Import from `@/helpers/axios-instance`
- **Type safety:** Always type API responses with DTO interfaces

### Error Handling

- **Try-catch:** Use for async operations that may fail
- **Error boundaries:** Consider adding for production-ready error handling
- **Toast notifications:** Use `useToast` hook for user-facing error messages
- **i18n errors:** Store error messages in `src/locales/exception/`

### Internationalization (i18n)

- **Translation files:** Organized by namespace in `src/locales/`
- **Default namespace:** `common`
- **Usage:** `i18n.t('common:loadTodos')` or `i18n.t('exception:errorMessage')`
- **Namespaces:** `common`, `exception` (add more as needed)
- **Code generation:** Run `bun run i18n:gen` after adding translations

### Environment Variables

- **Prefix:** Use `PUBLIC_` prefix for Rsbuild env vars
- **Access:** Via `import.meta.env.PUBLIC_*`
- **Configuration:** Centralize in `src/helpers/constants/env-config.ts`
- **Example:** `PUBLIC_API`, `PUBLIC_BASE`, `PUBLIC_PORT`

### Styling

- **Tailwind CSS:** Use utility classes for styling
- **Ant Design:** Use for UI components (Button, Col, Row, etc.)
- **Global styles:** Add to `src/global.css`
- **CSS Modules:** Supported via Biome configuration

## Best Practices

1. **Type safety first:** Always provide proper types, avoid `any`
2. **Component composition:** Keep components small and focused
3. **Custom hooks:** Extract reusable logic into custom hooks
4. **Separation of concerns:** Keep routing, state, and UI logic separate
5. **Consistent file structure:** Follow the established folder organization
6. **Code generation:** Use provided scripts for assets and i18n
7. **Linting before commits:** Run `bun check` before committing
8. **Path aliases:** Always use `@/` instead of relative imports
9. **Immutability:** Prefer immutable data patterns
10. **Documentation:** Add JSDoc comments for complex functions

## Common Patterns

### Creating a new route

1. Add file in `src/routes/` (e.g., `about.tsx`)
2. Use `createFileRoute` export pattern
3. TanStack Router auto-generates route tree

### Adding an API endpoint

1. Add endpoint to `src/services/endpoints.ts`
2. Create DTO in `src/types/dto/`
3. Create custom hook in `src/services/hooks/`
4. Use TanStack Query (`useQuery`/`useMutation`)

### Adding translations

1. Add to `src/locales/{namespace}/{lang}.ts`
2. Run `bun run i18n:gen`
3. Use via `i18n.t('namespace:key')`
