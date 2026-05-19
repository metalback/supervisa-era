# Coding Standards — Supervisa ERA

## Style (TypeScript / React Native)
- Use named exports over default exports
- Use TypeScript strict mode
- Props interfaces named as `{ComponentName}Props`
- Use `StyleSheet.create()` for styles, no inline styles
- camelCase for variables/functions, PascalCase for components/types
- Prefer functional components with hooks over class components

## Style (Python / FastAPI)
- Follow PEP 8
- Use type hints on all functions
- Pydantic models for all request/response schemas
- Use async endpoints where I/O is involved

## Testing
- Backend: pytest with descriptive test names (test_<behavior>)
- Frontend: Jest + React Native Testing Library
- Test external behavior, not implementation details
- Every public function/module should have at least one test
- Use descriptive test names that explain expected behavior

## Architecture
- Monorepo: app/ (React Native) + api/ (FastAPI) are independent modules
- Keep modules focused on a single responsibility
- Database access through the store/layer, never direct from screens
- Excel injection service must never calculate formulas — only write values
