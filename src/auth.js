class BaseAuth extends HTMLElement {
  constructor(client, config, isLogin = false) {
    super();
    this.client = client;
    this._config = config || {};
    this.isLogin = isLogin;
  }

  set config(value) {
    this._config = value || {};
    this.render();
  }
  get config() {
    return this._config;
  }
  get sharedStyles() {
    return `
      <style>
        .sdk-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
          width: 100%;
          margin: 1rem auto;
        }

        .sdk-input {
          width: 100%;
          padding: 0.5rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background-color: #ffffff;
          outline: none;
          transition: all 0.2s ease;
          margin: 2px 0;
        }
        .sdk-input:focus {
          border-color: #000000;
          box-shadow: 0 0 0 4px #f3f4f6;
        }

        .sdk-button {
          padding: 10px;
          background: #222;
          color: white;
          border: none;
          border-radius: 0.70rem;
          cursor: pointer;
          font-size: 16px;
          margin: 6px 0;
        }
        .sdk-button:hover {
          background: #000;
        }

        .sdk-oauth {
          display: flex;
          gap: 8px;
          margin-top: 1rem;
        }
        .sdk-oauth-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: 1px solid #e5e7eb;
          padding: 0.5rem;
          background-color: #ffffff;
          border-radius: 0.70rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .sdk-oauth-btn:hover {
          background-color: #f5f5f4;
        }
        .sdk-oauth-block {
          flex-direction: column;
        }

        .sdk-error {
          color: #991b1b;
          font-size: 15px;
          margin-top: 4px;
        }

        .sdk-divider {
          display: flex;
          align-items: center;
          gap: 0.75rem; 
          color: #6b7280; 
          font-size: 1rem; 
          line-height: 1.5rem; 
          margin: 20px 0;
        }
        .sdk-divider span:first-child,
        .sdk-divider span:last-child {
          flex: 1;
          border-bottom: 1px solid #e5e7eb; 
        }

        .sdk-header {
          display: flex;
          flex-direction: column;
          text-align: center;
          margin: 10px 0 30px 0;
        }
        .sdk-header h1 {
          font-size: 1.5rem;
          font-weight: 500;
          margin: 0;
          line-height: 2rem;
        }
        .sdk-header p {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.25rem;
        }
        .sdk-header img {
          margin: 5px auto;
        }
      </style>
    `;
  }


  connectedCallback() {
    if (this.hasAttribute("config")) {
      try {
        this._config = JSON.parse(this.getAttribute("config"));
      } catch (e) {
        console.warn("Invalid config JSON", e);
      }
    }
    this.render();
    this.attachListeners();
  }

  renderHeader() {
    const { assets = {} } = this._config;
    return `
      <div class="sdk-header">
        ${assets?.logoImageUrl 
          ? `<a href="${assets?.logoLinkUrl || "#"}"><img src="${assets?.logoImageUrl}" height="40"/></a>` 
          : `<i class="ri-bluesky-fill text-4xl"></i>`}
        <h1>${assets?.title || ''}</h1>
        <p>${assets?.subtitle || ''}</p>
      </div>
    `;
  }

  renderOAuthButtons(variant, elements) {
    const providers = this._config.providers || [];
    return `
      <div class="sdk-oauth ${variant == 'blockButton' ? 'sdk-oauth-block' : ''}">
        ${providers.map(p =>
          `<button class="sdk-oauth-btn ${elements.providersButton || ''}" data-provider="${p}">
            <i class="ri-${p.toLowerCase()}-fill"></i> ${variant === "iconButton" ? p : `Continue with ${p}`}
          </button>`
        ).join("")}
      </div>
    `;
  }

  renderDivider(label = "or continue with") {
    return `
     <div class="sdk-divider">
      <span></span>  <span>${label}</span> <span></span>
     </div>
    `;
  }


  renderAuthForm(authType){
     const { elements = {}, layout = {} } = this._config;
     const socialPlacement = layout.socialButtonsPlacement || "bottom";
     const socialVariant = layout.socialButtonsVariant || "blockButton";

     return `
     ${socialPlacement === "top" ? `${this.renderOAuthButtons(socialVariant, elements)} ${this.renderDivider()}` : ""}
      <form id="sdk-form" class="sdk-form">
         ${authType == 'up' ? `
          <div>
            <label>Full name</label>
            <input class="sdk-input ${elements.formInputs || ''}" type="text" name="name" placeholder="Jackie Robinson" required />
          </div>
          ` : '' }
        <div>
          <label>Email address</label>
          <input class="sdk-input ${elements.formInputs || ''}" type="email" name="email" placeholder="name@company.com" required />
        </div>
        <div>
          <label>Password</label>
          <input class="sdk-input ${elements.formInputs || ''}" type="password" name="password" placeholder="Min 6 characters, make it strong" required />
          <div class="sdk-error"></div>
        </div>

        <button class="sdk-button ${elements.formButtonPrimary || ''}" type="submit">Sign ${authType}</button>
      </form>
      ${socialPlacement === "bottom" ? `${this.renderDivider()} ${this.renderOAuthButtons(socialVariant, elements)}` : ""}
     `
  }

  attachListeners() {
    const form = this.querySelector("#sdk-form");
    const errorBox = this.querySelector(".sdk-error");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = this.querySelector('input[name="email"]')?.value || '';
      const password = this.querySelector('input[name="password"]')?.value || '';
      const display_name = this.querySelector('input[name="name"]')?.value || '';
      
      const { error, data } = this.isLogin
        ? await this.client.auth.signInWithPassword({ email, password })
        : await this.client.auth.signUp({
            email,
            password,
            options: { data: { display_name } },
          });

       if (error) {
          return errorBox.innerHTML = `<i class="ri-error-warning-line"></i> ${error.message || "Invalid credentials"}`
        } 
        const redirectUrl = this._config.assets?.redirectUrl || "/";
        window.location.href = redirectUrl;
    }); 
    


    const buttons = Array.from(this.querySelectorAll(".sdk-oauth button"));
    buttons.forEach((btn) =>
      btn.addEventListener("click", async () => {
        const provider = btn.dataset.provider.toLowerCase();
        await this.client.auth.signInWithOAuth({
          provider,
          options: { redirectTo: this._config.assets?.redirectUrl || "/" },
        });
      })
    );
  }
}




class SignIn extends BaseAuth {
   constructor(client, config) {
    super(client, config, true); // login
  }

  render() {
    this.innerHTML = `
      ${this.sharedStyles}
      ${this.renderHeader()}
      ${this.renderAuthForm('in')}
    `;
  }
}




class SignUp extends BaseAuth {
   constructor(client, config) {
    super(client, config, false); // signup
  }

  render() {
    this.innerHTML = `
      ${this.sharedStyles}
      ${this.renderHeader()}
      ${this.renderAuthForm('up')}
    `;
  }
}



export function createAuthComponents(client) {
  if (!customElements.get("supabase-signin")) {
    customElements.define("supabase-signin", class extends SignIn { constructor() { super(client); } });
  }
  if (!customElements.get("supabase-signup")) {
    customElements.define("supabase-signup", class extends SignUp { constructor() { super(client); } });
  }
  return { SignIn: "supabase-signin", SignUp: "supabase-signup" };
}


