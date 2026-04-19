# Implementation Plan: Responsive UI Login

## Overview

Implement the CivicWay responsive login page as a React feature. Build components incrementally — shared primitives first, then forms, then the composed page — and wire everything into `App.js` at the end.

## Tasks

- [x] 1. Install dependencies and set up CSS style files
  - Run `npm install --save-dev fast-check` inside `frontend/`
  - Run `npm install @react-oauth/google` inside `frontend/`
  - Create empty CSS files in `frontend/src/styles/` for each component: `LoginPage.css`, `HeroPanel.css`, `AuthCard.css`, `AuthTabs.css`, `LoginForm.css`, `SignUpForm.css`, `PasswordField.css`, `GoogleAuthButton.css`, `ForgotPasswordModal.css`
  - _Requirements: 10.3_

- [x] 2. Implement `PasswordField` component
  - [x] 2.1 Create `frontend/src/components/PasswordField.jsx`
    - Render a labeled `<input>` that toggles between `type="password"` and `type="text"` via internal `isVisible` state
    - Render a toggle `<button>` inside the input wrapper with `aria-label` of "Show password" / "Hide password" based on state
    - Import and apply `../styles/PasswordField.css`
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 2.2 Write property tests for `PasswordField` (Properties 6 & 7)
    - **Property 6: PasswordField toggle changes input type**
    - **Validates: Requirements 6.2, 6.3**
    - **Property 7: PasswordField toggle aria-label reflects state**
    - **Validates: Requirements 6.4**
    - File: `frontend/src/components/__tests__/PasswordField.test.jsx`
    - Use `fast-check` with ≥100 iterations; include `// Feature: responsive-ui-login, Property 6/7` comment tags

- [x] 3. Implement `AuthTabs` component
  - [x] 3.1 Create `frontend/src/components/AuthTabs.jsx`
    - Accept `activeTab` (`'login' | 'signup'`) and `onTabChange` props
    - Render two `<button>` elements; apply an active CSS class to the selected tab
    - Handle `onClick`, `onKeyDown` (Enter/Space) to call `onTabChange`
    - Import and apply `../styles/AuthTabs.css`
    - _Requirements: 4.1, 4.4, 4.5_

  - [ ]* 3.2 Write property tests for `AuthTabs` (Properties 2 & 3)
    - **Property 2: Active tab has distinct style**
    - **Validates: Requirements 4.4**
    - **Property 3: Keyboard activates tab**
    - **Validates: Requirements 4.5**
    - File: `frontend/src/components/__tests__/AuthTabs.test.jsx`
    - Use `fast-check` with ≥100 iterations; include `// Feature: responsive-ui-login, Property 2/3` comment tags

- [x] 4. Implement `LoginForm` component
  - [x] 4.1 Create `frontend/src/components/LoginForm.jsx`
    - Render a "Username or Email" text input, a `PasswordField` for password, a "Forgot Password?" link button, and a "Login to Portal" submit button
    - Manage `usernameOrEmail`, `password`, and `errors` state
    - On submit: validate both fields are non-empty; display inline errors if empty; otherwise call a no-op submit handler with the values
    - Accept `onForgotPassword` prop and wire it to the "Forgot Password?" button
    - Import and apply `../styles/LoginForm.css`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [ ]* 4.2 Write property tests for `LoginForm` (Properties 4 & 5)
    - **Property 4: LoginForm submit validates required fields**
    - **Validates: Requirements 5.6, 5.7**
    - **Property 5: LoginForm submits correct values**
    - **Validates: Requirements 5.5**
    - File: `frontend/src/components/__tests__/LoginForm.test.jsx`
    - Use `fast-check` with ≥100 iterations; include `// Feature: responsive-ui-login, Property 4/5` comment tags

- [x] 5. Implement `SignUpForm` component
  - [x] 5.1 Create `frontend/src/components/SignUpForm.jsx`
    - Render name, email, `PasswordField` (password), and `PasswordField` (confirm password) inputs plus a "Sign Up" submit button
    - Manage field state and basic validation (all fields required, passwords match)
    - Import and apply `../styles/SignUpForm.css`
    - _Requirements: 4.3_

  - [ ]* 5.2 Write unit tests for `SignUpForm`
    - Verify all four fields and submit button render
    - Test that mismatched passwords show an inline error
    - File: `frontend/src/components/__tests__/SignUpForm.test.jsx`

- [x] 6. Implement `GoogleAuthButton` component
  - [x] 6.1 Create `frontend/src/components/GoogleAuthButton.jsx`
    - Wrap `@react-oauth/google`'s `GoogleLogin` component
    - Accept `onSuccess` and `onError` props and forward them to `GoogleLogin`
    - Render a styled wrapper div with CivicWay styling
    - Import and apply `../styles/GoogleAuthButton.css`
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 6.2 Write property test for `GoogleAuthButton` (Property 9)
    - **Property 9: GoogleAuthButton initiates OAuth on activation**
    - **Validates: Requirements 7.3**
    - File: `frontend/src/components/__tests__/GoogleAuthButton.test.jsx`
    - Use `fast-check` with ≥100 iterations; include `// Feature: responsive-ui-login, Property 9` comment tag

- [x] 7. Implement `ForgotPasswordModal` component
  - [x] 7.1 Create `frontend/src/components/ForgotPasswordModal.jsx`
    - Accept `isOpen` and `onClose` props
    - When `isOpen` is true, render a modal overlay with an email input, inline validation, and a close button
    - When `isOpen` is false, render nothing (return null)
    - Import and apply `../styles/ForgotPasswordModal.css`
    - _Requirements: 5.3_

  - [ ]* 7.2 Write unit tests for `ForgotPasswordModal`
    - Verify modal is absent from DOM when `isOpen=false`
    - Verify modal renders when `isOpen=true`
    - Verify `onClose` is called when close button is activated
    - Verify empty email submission shows inline error
    - File: `frontend/src/components/__tests__/ForgotPasswordModal.test.jsx`

- [ ] 8. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement `HeroPanel` component
  - [x] 9.1 Create `frontend/src/components/HeroPanel.jsx`
    - Render a full-cover background image div with a dark semi-transparent overlay
    - Render the tagline "Small Acts, Big Changes, Let's Build A Better Community Together" centered over the overlay
    - Render a quote box with "RESPECT. RESPONSIBILITY. COMMUNITY." below the tagline
    - Import and apply `../styles/HeroPanel.css`
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 9.2 Write unit tests for `HeroPanel`
    - Verify tagline text is present
    - Verify quote box text is present
    - File: `frontend/src/components/__tests__/HeroPanel.test.jsx`

- [x] 10. Implement `AuthCard` component
  - [x] 10.1 Create `frontend/src/components/AuthCard.jsx`
    - Manage `activeTab` (`'login'`) and `isForgotPasswordOpen` (`false`) state
    - Render CivicWay logo image, "CivicWay" heading, and subtitle "Secure access to government services"
    - Render `AuthTabs` wired to `activeTab` and `setActiveTab`
    - Conditionally render `LoginForm` (with `onForgotPassword`) or `SignUpForm` based on `activeTab`
    - Render a divider with "or" label, then `GoogleAuthButton` (with no-op handlers)
    - Render "Terms of Service" and "Privacy Policy" `<a>` links at the bottom
    - Render `ForgotPasswordModal` wired to `isForgotPasswordOpen` and `setIsForgotPasswordOpen`
    - Import and apply `../styles/AuthCard.css`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 7.2, 7.4, 8.1, 8.2, 8.3, 8.4_

  - [ ]* 10.2 Write property tests for `AuthCard` (Properties 1, 8 & 10)
    - **Property 1: Tab state controls form visibility**
    - **Validates: Requirements 4.2, 4.3**
    - **Property 8: GoogleAuthButton present in both tab views**
    - **Validates: Requirements 7.4**
    - **Property 10: Legal links are anchors with accessible text**
    - **Validates: Requirements 8.4**
    - File: `frontend/src/components/__tests__/AuthCard.test.jsx`
    - Use `fast-check` with ≥100 iterations; include `// Feature: responsive-ui-login, Property 1/8/10` comment tags

- [x] 11. Implement `LoginPage` and wire responsive CSS
  - [x] 11.1 Create `frontend/src/pages/LoginPage.jsx`
    - Render a full-viewport wrapper div containing `HeroPanel` and `AuthCard` side by side
    - Import and apply `../styles/LoginPage.css`
    - _Requirements: 1.1, 1.4, 10.1_

  - [x] 11.2 Add responsive CSS to `LoginPage.css`
    - Desktop (≥1025px): two-column flex layout, each panel 50% width, 100vh height
    - Tablet (601–1024px): single-column flex layout, HeroPanel stacked above AuthCard
    - Mobile (≤600px): hide HeroPanel (`display: none`), AuthCard full width with horizontal padding
    - Ensure `AuthCard` min-width 320px, inputs/buttons min touch target 44px on mobile/tablet, no horizontal overflow
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ]* 11.3 Write unit tests for `LoginPage`
    - Verify `HeroPanel` and `AuthCard` are rendered
    - File: `frontend/src/pages/__tests__/LoginPage.test.jsx`

- [x] 12. Register `LoginPage` as default route in `App.js`
  - Update `frontend/src/App.js` to import and render `LoginPage` as the root component (replace the default CRA placeholder)
  - No router library is required — render `LoginPage` directly as the app root
  - _Requirements: 10.4_

- [ ] 13. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use `fast-check` with ≥100 iterations each
- `@react-oauth/google` and `fast-check` must be installed before implementing tasks 2 and 6
