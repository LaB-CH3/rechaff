
export interface RechaffConfig {
  elements?: {
    formButtonPrimary?: string;
    providersButton?: string;
    formInputs?: string;
  };
  layout?: {
    socialButtonsPlacement?: "top" | "bottom";
    socialButtonsVariant?: "iconButton" | "blockButton";
  };
  assets?: {
    logoLinkUrl?: string;
    logoImageUrl?: string;
    redirectUrl?: string;
    title?: string;
    subtitle?: string;
  };
  providers?: string[];
}

export interface AuthComponents {
  SignIn: HTMLElement;
  SignUp: HTMLElement;
}

export function createAuthComponents(
  client: any,
  config?: RechaffConfig
): AuthComponents;
