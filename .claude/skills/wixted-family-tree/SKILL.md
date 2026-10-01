```markdown
# wixted-family-tree Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns used in the `wixted-family-tree` repository, a React application written in TypeScript. You'll learn about file naming conventions, import/export styles, commit patterns, and how to structure and run tests. This guide is designed to help contributors maintain consistency and quality across the codebase.

## Coding Conventions

### File Naming
- **Pattern:** PascalCase for all files and components.
- **Example:**  
  ```
  FamilyTree.tsx
  PersonCard.ts
  ```

### Import Style
- **Pattern:** Use relative imports for modules within the project.
- **Example:**
  ```typescript
  import FamilyTree from './FamilyTree';
  import { Person } from '../models/Person';
  ```

### Export Style
- **Pattern:** Mixed use of default and named exports.
- **Example:**
  ```typescript
  // Default export
  export default FamilyTree;

  // Named export
  export const PersonCard = () => { ... };
  ```

### Commit Patterns
- **Type:** Freeform, no enforced prefixes or scopes.
- **Average Length:** 52 characters per commit message.
- **Example:**
  ```
  Add support for multiple generations in tree view
  ```

## Workflows

### Adding a New Component
**Trigger:** When you need to introduce a new UI component.
**Command:** `/add-component`

1. Create a new file in PascalCase (e.g., `NewComponent.tsx`).
2. Use a relative import for dependencies.
3. Export the component (default or named as appropriate).
4. Write a corresponding test file as `NewComponent.test.tsx`.
5. Commit with a clear, concise message.

### Modifying Existing Logic
**Trigger:** When updating or refactoring existing code.
**Command:** `/modify-logic`

1. Locate the relevant file using PascalCase naming.
2. Make changes using TypeScript and React best practices.
3. Ensure imports remain relative.
4. Update or add tests as needed.
5. Commit changes with a descriptive message.

### Writing Tests
**Trigger:** When adding or updating tests for components or utilities.
**Command:** `/write-test`

1. Create or update a file matching the pattern `*.test.*` (e.g., `PersonCard.test.tsx`).
2. Write tests using the project's preferred (unknown) testing framework.
3. Ensure tests cover new or changed functionality.
4. Run tests to verify correctness.
5. Commit with a message indicating test coverage.

## Testing Patterns

- **File Pattern:** All tests are placed in files matching `*.test.*` (e.g., `FamilyTree.test.tsx`).
- **Framework:** Not explicitly specified; follow existing patterns in the codebase.
- **Example:**
  ```typescript
  // FamilyTree.test.tsx
  import { render } from '@testing-library/react';
  import FamilyTree from './FamilyTree';

  test('renders family tree', () => {
    render(<FamilyTree />);
    // assertions here
  });
  ```

## Commands
| Command         | Purpose                                         |
|-----------------|-------------------------------------------------|
| /add-component  | Scaffold and add a new React component          |
| /modify-logic   | Update or refactor existing logic               |
| /write-test     | Add or update tests for components or utilities |
```