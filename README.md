# ReChaff Drop-in Authentication

ReChaff is a lightweight, framework-agnostic drop-in authentication SDK for Supabase. It provides fully customizable sign-in and sign-up components, complete with social OAuth buttons, default styling, and easy integration.

Designed as Web Components, ReChaff works seamlessly in React, Vue, Angular, or plain HTML/JS, letting you add authentication to any web app with minimal setup.

<br><br>

# Table of Contents

1. [ReChaff Drop-in Authentication](#rechaff-drop-in-authentication)  
2. [Setup](#1-setup)  
    - Install Supabase  
    - Create Supabase Client  
3. [Install ReChaff](#2-install-rechaff)  
    - Option A — Install via npm  
    - Option B — Import via CDN  
4. [Using the Components](#3-using-the-components)  
    - A Quick Example  
    - Use in Vue  
    - Use in React  
    - Use Your Brain (Best Practices)  
5. [Configuration Options](#4-configuration-options)  
6. [Custom Styling Notes](#custom-styling-notes)

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
You can use Rechaff in two ways: via npm (recommended) or via a CDN import.

### Option A — Install via npm
```bash
npm install rechaff
```


```js
import { createAuthComponents } from 'rechaff';

// Initialize auth components
const { SignIn, SignUp } = createAuthComponents(supabase);
```

<br>

### Option B — Import directly from CDN
```js
import { createAuthComponents } from "https://cdn.jsdelivr.net/gh/LaB-CH3/rechaff@refs/heads/main/dist/Auth.js";

// Initialize auth components
const { SignIn, SignUp } = createAuthComponents(supabase);
```

<br><br>

## 3. Using the Components

Sign-up and sign-in components share the same configuration options. You can optionally provide your own CSS classes—whether custom or TailwindCSS.
ReChaff also supports Remix Icons, so if you already have it in your project, Rechaff will automatically apply the icons where needed—no additional setup is required.

<br>

### A Quick Example ⚡
In most cases, the only option you need to provide is the redirect URL. That’s how simple it is to get started with ReChaff:

```html
 <SignUp :config="{ assets:{ redirectUrl: 'https://your-app.com/dashboard' } }" />

```



### Use in Vue

```html

<script setup lang="ts">
import { createClient } from "@supabase/supabase-js";
import { createAuthComponents } from "rechaff";

// Initialize Supabase client
const supabase = createClient("supabase-url", "anon-key");

// Create auth components
const { SignIn, SignUp } = createAuthComponents(supabase);

// Configuration object
const config = {
    providers: ["Google", "Discord"],
    assets: { 
        title: "Create Account", 
        subtitle: 'Start your 30-day free trial. Cancel anytime', 
        redirectUrl: "/dashboard" 
    }
};


</script>


<template>

 <sign-up :config="config" />
 <sign-in :config="config" />

</template>

```


### Use in React

```js

import React from "react";
import { createClient } from "@supabase/supabase-js";
import { createAuthComponents } from "rechaff";

// Initialize Supabase client
const supabase = createClient("supabase-url", "anon-key");

// Create auth components
const { SignIn, SignUp } = createAuthComponents(supabase);

// Configuration object
const config = {
   providers: ["Google", "Discord"],
   assets: { 
        title: "Create Account", 
        subtitle: 'Start your 30-day free trial. Cancel anytime', 
        redirectUrl: "/dashboard" 
    }
};

export default function App() {
  return (
    <div className="App">
      <supabase-signup config={JSON.stringify(config)} />
      <supabase-signin config={JSON.stringify(config)} />
    </div>
  );
}


```


### Use Your Brain 🧠

In the examples above, both Sign Up and Sign In components are shown on the same page for demonstration purposes. In a real-world app, it’s common to place them on separate pages.

Also, your Supabase client and ReChaff configuration should ideally be defined in a shared utility file and imported wherever needed. This keeps your code clean and maintainable.

#### Practical Example:

```html

<script setup lang="ts">
  // Import global Supabase client and ReChaff configuration
  import { supabase, rechaffConfig } from "my-utils-file.ts";

  // Create auth components
  import { createAuthComponents } from "rechaff";
  const { SignIn } = createAuthComponents(supabase);
</script>

<template>
   <div class="max-w-90 m-auto">
    <sign-in :config="rechaffConfig" />
   </div>
</template>

```

#### Recap
- Keep your Supabase client in a single shared file to avoid reinitializing it across pages.
- Place your config object in a separate file for centralized customization (layout, OAuth providers, redirect URLs).
- In production, Sign Up and Sign In are usually on different routes.


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


<br><br>

✅ Note: If your custom classes don’t override ReChaff’s default classes, add !important to your styles. For example: 

```css
   ...
    formButtonPrimary: '!your-org-button !org-red-button'
   ....
```