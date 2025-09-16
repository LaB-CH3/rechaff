# ReChaff Drop-in Authentication

ReChaff provides a lightweight, fully customizable drop-in authentication system for Supabase. With minimal setup, developers can add sign-in and sign-up forms to their apps, complete with social OAuth buttons and default styling.

<br><br>

## 1. Setup

Install Supabase in your app if you haven’t already:

```bash
npm install @supabase/supabase-js
```

Create a Supabase client:

```js
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://xyzcompany.supabase.co', 'publishable-or-anon-key')
```

<br><br>


## 2. Install Rechaff
First, install and import ReChaff and pass in your Supabase client instance:

```bash
npm install rechaff
```

```js
import { createAuthComponents } from 'rechaff';

// Initialize the sign-in and sign-up components with your Supabase client
const { SignIn, SignUp } = createAuthComponents(supabase);
```


<br><br>




## 3. Using the Components

Sign-up and sign-in components share the same configuration options. You can optionally provide your own CSS classes—whether custom or TailwindCSS.
ReChaff also supports Remix Icons, so if you already have it in your project, Rechaff will automatically apply the icons where needed—no additional setup is required.

<br><br>


#### Sign Up Example

```html
  <sign-up
      :config="{
        elements: {
            formButtonPrimary: 'your-org-button org-red-button',
            providersButton: 'your-org-secondary-button org-gray-button',
            formInputs: 'your-org-input org-red-input'
        },
        layout: {
            socialButtonsPlacement: 'bottom', 
            socialButtonsVariant: 'iconButton' 
        },
        assets:{
            logoLinkUrl: 'https://your-site.com',
            logoImageUrl: 'https://your-site.com/logo.svg',
            redirectUrl: 'https://your-app.com/dashboard',
            title: 'Create account',
            subtitle: 'Start your 30-day free trial. Cancel anytime'
        },
        providers: ['Google', 'Github', 'Discord']
    }" />

```


#### Sign In Example

```html
  <sign-in
      :config="{
        elements: {
            formButtonPrimary: 'your-org-button org-red-button',
            providersButton: 'your-org-secondary-button org-gray-button',
            formInputs: 'your-org-input org-red-input'
        },
        layout: {
            socialButtonsPlacement: 'top', 
            socialButtonsVariant: 'blockButton' 
        },
        assets:{
            logoLinkUrl: 'https://your-site.com',
            logoImageUrl: 'https://your-site.com/logo.svg',
            redirectUrl: 'https://your-app.com/dashboard',
            title: 'Welcome back!',
            subtitle: 'Please provider your details to continue'
        },
        providers: ['Google', 'Discord']
    }" />

```

✅ Note: If your custom classes don’t override ReChaff’s default classes, add !important to your styles. For example: 

```css
   ...
    formButtonPrimary: '!your-org-button !org-red-button'
   ....
```


<br><br>


## 4. Configuration Options

```text
config
├── elements
│   ├── formButtonPrimary   # CSS classes for main submit button
│   ├── providersButton     # CSS classes for OAuth provider buttons
│   └── formInputs          # CSS classes for input fields
├── layout
│   ├── socialButtonsPlacement  # 'top' | 'bottom'
│   └── socialButtonsVariant    # 'iconButton' | 'blockButton'
├── assets
│   ├── logoLinkUrl       # URL for logo link
│   ├── logoImageUrl      # Path to logo image
│   ├── redirectUrl       # URL to redirect after success
│   ├── title             # Form header text
│   └── subtitle          # Form subtitle text
└── providers             # Array of OAuth providers, e.g., ['Google', 'Github', 'Discord']
```


