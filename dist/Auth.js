class h extends HTMLElement {
  constructor(e, t, i = !1) {
    super(), this.client = e, this._config = t || {}, this.isLogin = i;
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
        ${e != null && e.logoImageUrl ? `<a href="${(e == null ? void 0 : e.logoLinkUrl) || "#"}"><img src="${e == null ? void 0 : e.logoImageUrl}" height="40"/></a>` : '<i class="ri-bluesky-fill text-4xl"></i>'}
        <h1>${(e == null ? void 0 : e.title) || ""}</h1>
        <p>${(e == null ? void 0 : e.subtitle) || ""}</p>
      </div>
    `;
  }
  renderOAuthButtons(e, t) {
    const i = this._config.providers || [];
    return `
      <div class="sdk-oauth ${e == "blockButton" ? "sdk-oauth-block" : ""}">
        ${i.map(
      (r) => `<button class="sdk-oauth-btn ${t.providersButton || ""}" data-provider="${r}">
            <i class="ri-${r.toLowerCase()}-fill"></i> ${e === "iconButton" ? r : `Continue with ${r}`}
          </button>`
    ).join("")}
      </div>
    `;
  }
  renderDivider(e = "or continue with") {
    return `
     <div class="sdk-divider">
      <span></span>  <span>${e}</span> <span></span>
     </div>
    `;
  }
  renderAuthForm(e) {
    const { elements: t = {}, layout: i = {} } = this._config, r = i.socialButtonsPlacement || "bottom", s = i.socialButtonsVariant || "blockButton";
    return `
     ${r === "top" ? `${this.renderOAuthButtons(s, t)} ${this.renderDivider()}` : ""}
      <form id="sdk-form" class="sdk-form">
         ${e == "up" ? `
          <div>
            <label>Full name</label>
            <input class="sdk-input ${t.formInputs || ""}" type="text" name="name" placeholder="Jackie Robinson" required />
          </div>
          ` : ""}
        <div>
          <label>Email address</label>
          <input class="sdk-input ${t.formInputs || ""}" type="email" name="email" placeholder="name@company.com" required />
        </div>
        <div>
          <label>Password</label>
          <input class="sdk-input ${t.formInputs || ""}" type="password" name="password" placeholder="Min 6 characters, make it strong" required />
          <div class="sdk-error"></div>
        </div>

        <button class="sdk-button ${t.formButtonPrimary || ""}" type="submit">Sign ${e}</button>
      </form>
      ${r === "bottom" ? `${this.renderDivider()} ${this.renderOAuthButtons(s, t)}` : ""}
     `;
  }
  attachListeners() {
    const e = this.querySelector("#sdk-form"), t = this.querySelector(".sdk-error");
    e.addEventListener("submit", async (r) => {
      var d, l, c, u;
      r.preventDefault();
      const s = ((d = this.querySelector('input[name="email"]')) == null ? void 0 : d.value) || "", o = ((l = this.querySelector('input[name="password"]')) == null ? void 0 : l.value) || "", p = ((c = this.querySelector('input[name="name"]')) == null ? void 0 : c.value) || "", { error: a, data: b } = this.isLogin ? await this.client.auth.signInWithPassword({ email: s, password: o }) : await this.client.auth.signUp({
        email: s,
        password: o,
        options: { data: { display_name: p } }
      });
      if (a)
        return t.innerHTML = `<i class="ri-error-warning-line"></i> ${a.message || "Invalid credentials"}`;
      const m = ((u = this._config.assets) == null ? void 0 : u.redirectUrl) || "/";
      window.location.href = m;
    }), Array.from(this.querySelectorAll(".sdk-oauth button")).forEach(
      (r) => r.addEventListener("click", async () => {
        var o;
        const s = r.dataset.provider.toLowerCase();
        await this.client.auth.signInWithOAuth({
          provider: s,
          options: { redirectTo: ((o = this._config.assets) == null ? void 0 : o.redirectUrl) || "/" }
        });
      })
    );
  }
}
class f extends h {
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
class g extends h {
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
function k(n) {
  return customElements.get("supabase-signin") || customElements.define("supabase-signin", class extends f {
    constructor() {
      super(n);
    }
  }), customElements.get("supabase-signup") || customElements.define("supabase-signup", class extends g {
    constructor() {
      super(n);
    }
  }), { SignIn: "supabase-signin", SignUp: "supabase-signup" };
}
export {
  k as createAuthComponents
};
//# sourceMappingURL=Auth.js.map
