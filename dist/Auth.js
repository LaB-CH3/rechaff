class l extends HTMLElement {
  constructor(e, t, r = !1) {
    super(), this.client = e, this._config = t || {}, this.isLogin = r;
  }
  set config(e) {
    this._config = e || {}, this.render();
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
          padding: 0.5rem .9rem;
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

        .sdk-password-label{
           display: flex;
           justify-content: space-between;
        }
      
      </style>
    `;
  }
  connectedCallback() {
    if (this.hasAttribute("config"))
      try {
        this._config = JSON.parse(this.getAttribute("config"));
      } catch (e) {
        console.warn("Invalid config JSON", e);
      }
    this.render(), this.attachListeners();
  }
  renderHeader() {
    const { assets: e = {} } = this._config;
    return `
      <div class="sdk-header">
        ${e?.logoImageUrl ? `<a href="${e?.logoLinkUrl || "#"}"><img src="${e?.logoImageUrl}" height="40"/></a>` : ""}
        <h1>${e?.title || ""}</h1>
        <p>${e?.subtitle || ""}</p>
      </div>
    `;
  }
  renderOAuthButtons(e, t) {
    const r = this._config.providers || [];
    return `
      <div class="sdk-oauth ${e == "blockButton" ? "sdk-oauth-block" : ""}">
        ${r.map(
      (s) => `<button class="sdk-oauth-btn ${t.providersButton || ""}" data-provider="${s}">
            <i class="ri-${s.toLowerCase()}-fill"></i> ${e === "iconButton" ? s : `Continue with ${s}`}
          </button>`
    ).join("")}
      </div>
    `;
  }
  renderDivider(e) {
    return !e || e?.length == 0 ? "" : `
     <div class="sdk-divider">
      <span></span>  <span>or continue with</span> <span></span>
     </div>
    `;
  }
  renderAuthForm(e) {
    const { elements: t = {}, layout: r = {}, assets: s = {} } = this._config, i = r.socialButtonsPlacement || "bottom", o = r.socialButtonsVariant || "blockButton", a = this._config.providers || [];
    return `
     ${i === "top" ? `${this.renderOAuthButtons(o, t)} ${this.renderDivider(a)}` : ""}
      <form id="sdk-form" class="sdk-form">
         ${e == "up" ? `
          <div>
            <label for="sdk-form-name">Full name</label>
            <input id="sdk-form-name" class="sdk-input ${t.formInputs || ""}" type="text" name="name" autocomplete="given-name" placeholder="Jackie Robinson" required />
          </div>
          ` : ""}
        <div>
          <label for="sdk-form-email">Email address</label>
          <input id="sdk-form-email" class="sdk-input ${t.formInputs || ""}" type="email" name="email" autocomplete="off" placeholder="email@address.com" required />
        </div>
        <div>
          <label for="sdk-form-password">Password</label>
          <input id="sdk-form-password" class="sdk-input ${t.formInputs || ""}" type="password" name="password" placeholder="Enter your password" required />
          <div class="sdk-error"></div>
        </div>

        <button class="sdk-button ${t.formButtonPrimary || ""}" type="submit">Sign ${e}</button>
      </form>
      ${i === "bottom" ? `${this.renderDivider(a)} ${this.renderOAuthButtons(o, t)}` : ""}
     `;
  }
  attachListeners() {
    const e = this.querySelector("#sdk-form"), t = this.querySelector(".sdk-error");
    e.addEventListener("submit", async (s) => {
      s.preventDefault();
      const i = this.querySelector('input[name="email"]')?.value || "", o = this.querySelector('input[name="password"]')?.value || "", a = this.querySelector('input[name="name"]')?.value || "", { error: d, data: h } = this.isLogin ? await this.client.auth.signInWithPassword({ email: i, password: o }) : await this.client.auth.signUp({
        email: i,
        password: o,
        options: { data: { display_name: a } }
      });
      if (d)
        return t.innerHTML = `<i class="ri-error-warning-line"></i> ${d.message || "Invalid credentials"}`;
      const c = this._config.assets?.redirectUrl || "/";
      window.location.href = c;
    }), Array.from(this.querySelectorAll(".sdk-oauth button")).forEach(
      (s) => s.addEventListener("click", async () => {
        const i = s.dataset.provider.toLowerCase();
        await this.client.auth.signInWithOAuth({
          provider: i,
          options: { redirectTo: this._config.assets?.redirectUrl || "/" }
        });
      })
    );
  }
}
class u extends l {
  constructor(e, t) {
    super(e, t, !0);
  }
  render() {
    this.innerHTML = `
      ${this.sharedStyles}
      ${this.renderHeader()}
      ${this.renderAuthForm("in")}
    `;
  }
}
class p extends l {
  constructor(e, t) {
    super(e, t, !1);
  }
  render() {
    this.innerHTML = `
      ${this.sharedStyles}
      ${this.renderHeader()}
      ${this.renderAuthForm("up")}
    `;
  }
}
function m(n) {
  return customElements.get("supabase-signin") || customElements.define("supabase-signin", class extends u {
    constructor() {
      super(n);
    }
  }), customElements.get("supabase-signup") || customElements.define("supabase-signup", class extends p {
    constructor() {
      super(n);
    }
  }), { SignIn: "supabase-signin", SignUp: "supabase-signup" };
}
export {
  m as createAuthComponents
};
//# sourceMappingURL=Auth.js.map
