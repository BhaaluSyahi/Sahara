# Requirements Document

## Introduction

CivicWay is a civic/government portal application. This feature covers the responsive login page UI built with React and CSS. The page uses a split-screen layout: the left panel displays a branded hero section with a background image, dark overlay, tagline, and a civic values quote box; the right panel contains a white login card on a mint/light-green background. The login card supports tab-based toggling between Login and Sign Up views, credential-based authentication fields, Google OAuth login, and links to legal pages. The design must be fully responsive across desktop, tablet, and mobile viewports.

## Glossary

- **LoginPage**: The top-level page component rendered at the application root that contains the split-screen layout.
- **HeroPanel**: The left panel of the split-screen containing the background image, dark overlay, tagline, and quote box.
- **AuthCard**: The white card on the right panel that contains the login/sign-up form and all authentication controls.
- **AuthTabs**: The tab toggle component inside AuthCard that switches between Login and Sign Up views.
- **LoginForm**: The form rendered inside AuthCard when the Login tab is active.
- **SignUpForm**: The form rendered inside AuthCard when the Sign Up tab is active.
- **PasswordField**: A text input component that supports toggling password visibility.
- **GoogleAuthButton**: The button that initiates Google OAuth login.
- **Viewport**: The visible area of the browser window.
- **Breakpoint_Mobile**: Viewport width ≤ 600px.
- **Breakpoint_Tablet**: Viewport width between 601px and 1024px.
- **Breakpoint_Desktop**: Viewport width ≥ 1025px.

---

## Requirements

### Requirement 1: Split-Screen Layout

**User Story:** As a visitor, I want to see a visually distinct split-screen login page, so that I immediately understand the CivicWay brand and can locate the login form.

#### Acceptance Criteria

1. THE LoginPage SHALL render a two-column split-screen layout with HeroPanel occupying the left half and AuthCard occupying the right half at Breakpoint_Desktop.
2. WHEN the Viewport width is at Breakpoint_Tablet, THE LoginPage SHALL stack HeroPanel above AuthCard in a single-column layout.
3. WHEN the Viewport width is at Breakpoint_Mobile, THE LoginPage SHALL hide HeroPanel and display only AuthCard occupying the full Viewport width.
4. THE LoginPage SHALL occupy 100% of the Viewport height with no vertical scrollbar at Breakpoint_Desktop when content fits within the Viewport.

---

### Requirement 2: Hero Panel

**User Story:** As a visitor, I want to see an inspiring civic-themed hero section, so that I feel the purpose and values of CivicWay before logging in.

#### Acceptance Criteria

1. THE HeroPanel SHALL display a full-cover background image with a dark semi-transparent overlay.
2. THE HeroPanel SHALL display the tagline text "Small Acts, Big Changes, Let's Build A Better Community Together" centered over the overlay.
3. THE HeroPanel SHALL display a quote box containing the text "RESPECT. RESPONSIBILITY. COMMUNITY." positioned below the tagline.
4. THE HeroPanel SHALL maintain legible contrast between the tagline text and the dark overlay, with a contrast ratio of at least 4.5:1 per WCAG AA guidelines.
5. WHEN the Viewport width is at Breakpoint_Mobile, THE HeroPanel SHALL not be rendered in the DOM.

---

### Requirement 3: Auth Card Branding

**User Story:** As a visitor, I want to see the CivicWay logo and branding on the login card, so that I can confirm I am on the correct portal.

#### Acceptance Criteria

1. THE AuthCard SHALL display the CivicWay logo image above the application name "CivicWay".
2. THE AuthCard SHALL display the subtitle "Secure access to government services" below the application name.
3. THE AuthCard SHALL be rendered on a mint/light-green background (#e8f5e9 or equivalent) on the right panel.
4. THE AuthCard SHALL have a white background, rounded corners, and a subtle box shadow to visually separate it from the panel background.

---

### Requirement 4: Login/Sign Up Tab Toggle

**User Story:** As a visitor, I want to switch between Login and Sign Up views within the same card, so that I can either access my existing account or create a new one without navigating away.

#### Acceptance Criteria

1. THE AuthTabs SHALL render two tabs labeled "Login" and "Sign Up" at the top of AuthCard.
2. WHEN the Login tab is selected, THE AuthCard SHALL display LoginForm and hide SignUpForm.
3. WHEN the Sign Up tab is selected, THE AuthCard SHALL display SignUpForm and hide LoginForm.
4. THE AuthTabs SHALL visually indicate the currently active tab using a distinct style (e.g., underline or filled background) that differs from the inactive tab.
5. THE AuthTabs SHALL be keyboard-navigable, allowing tab selection via the Enter or Space key.

---

### Requirement 5: Login Form Fields

**User Story:** As a registered user, I want to enter my credentials and log in, so that I can access government services through CivicWay.

#### Acceptance Criteria

1. THE LoginForm SHALL include a text input field labeled "Username or Email".
2. THE LoginForm SHALL include a PasswordField labeled "Password".
3. THE LoginForm SHALL include a "Forgot Password?" link below the PasswordField.
4. THE LoginForm SHALL include a submit button labeled "Login to Portal".
5. WHEN the "Login to Portal" button is activated, THE LoginForm SHALL submit the username/email and password values as form data.
6. IF the username/email field is empty when the "Login to Portal" button is activated, THEN THE LoginForm SHALL display an inline validation message indicating the field is required.
7. IF the password field is empty when the "Login to Portal" button is activated, THEN THE LoginForm SHALL display an inline validation message indicating the field is required.

---

### Requirement 6: Password Visibility Toggle

**User Story:** As a user, I want to show or hide my password while typing, so that I can verify my input without making mistakes.

#### Acceptance Criteria

1. THE PasswordField SHALL render a visibility toggle icon button positioned inside the input field on the trailing edge.
2. WHEN the visibility toggle is activated and the PasswordField is in hidden state, THE PasswordField SHALL change the input type from "password" to "text", revealing the entered characters.
3. WHEN the visibility toggle is activated and the PasswordField is in visible state, THE PasswordField SHALL change the input type from "text" to "password", concealing the entered characters.
4. THE PasswordField visibility toggle SHALL have an accessible aria-label that reflects the current state (e.g., "Show password" or "Hide password").

---

### Requirement 7: Google OAuth Login

**User Story:** As a user, I want to log in using my Google account, so that I can access CivicWay without managing a separate password.

#### Acceptance Criteria

1. THE AuthCard SHALL display a GoogleAuthButton labeled "Continue with Google" with the Google logo icon.
2. THE GoogleAuthButton SHALL be visually separated from the credential form by a horizontal divider with the label "or".
3. WHEN the GoogleAuthButton is activated, THE GoogleAuthButton SHALL initiate the Google OAuth 2.0 authorization flow.
4. THE GoogleAuthButton SHALL be rendered in both the Login and Sign Up views.

---

### Requirement 8: Legal Links

**User Story:** As a visitor, I want to access the Terms of Service and Privacy Policy from the login page, so that I can review the portal's legal agreements before creating an account.

#### Acceptance Criteria

1. THE AuthCard SHALL display a "Terms of Service" link and a "Privacy Policy" link at the bottom of the card.
2. WHEN the "Terms of Service" link is activated, THE AuthCard SHALL navigate the user to the Terms of Service page.
3. WHEN the "Privacy Policy" link is activated, THE AuthCard SHALL navigate the user to the Privacy Policy page.
4. THE AuthCard SHALL render the legal links as anchor elements with descriptive accessible text.

---

### Requirement 9: Responsive Design

**User Story:** As a user on any device, I want the login page to display correctly on my screen size, so that I can log in comfortably from desktop, tablet, or mobile.

#### Acceptance Criteria

1. THE LoginPage SHALL use CSS media queries to adapt layout, font sizes, and spacing across Breakpoint_Desktop, Breakpoint_Tablet, and Breakpoint_Mobile.
2. THE AuthCard SHALL maintain a minimum width of 320px at all Viewport sizes.
3. WHEN the Viewport width is at Breakpoint_Mobile, THE AuthCard SHALL occupy 100% of the Viewport width with appropriate horizontal padding.
4. THE LoginForm inputs and buttons SHALL have a minimum touch target height of 44px on Breakpoint_Mobile and Breakpoint_Tablet.
5. THE LoginPage SHALL not produce horizontal overflow at any of the three defined breakpoints.

---

### Requirement 10: Project Structure

**User Story:** As a developer, I want the codebase to follow a clear folder structure separating components and styles, so that the project is maintainable and easy to navigate.

#### Acceptance Criteria

1. THE LoginPage component SHALL be located in `frontend/src/pages/`.
2. THE HeroPanel, AuthCard, AuthTabs, LoginForm, SignUpForm, PasswordField, and GoogleAuthButton components SHALL each be located in `frontend/src/components/`.
3. EACH component SHALL have a corresponding dedicated CSS file located in `frontend/src/styles/`.
4. THE LoginPage SHALL be registered as the default route in `frontend/src/App.js`.
