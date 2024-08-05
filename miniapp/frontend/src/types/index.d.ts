export {};

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
    initDataUnsafe: string;
  }

  interface TelegramWebApp {
    initData: string;
    initDataUnsafe: InitDataUnsafe;
    version: string;
    platform: string;
    colorScheme: string;
    themeParams: ThemeParams;
    viewportStableHeight: number;
    viewportHeight: number;
    headerColor: string;
    backgroundColor: string;
    backButton: BackButton;
    MainButton: MainButton;
    HapticFeedback: HapticFeedback;
    isExpanded: boolean;
    expand: () => void;
    close: () => void;
    ready: () => void;
    sendData: (data: string) => void;
    onEvent: (eventType: string, callback: Function) => void;
    offEvent: (eventType: string, callback: Function) => void;
    openInvoice: (url: string) => void;
    openTelegramLink: (url: string) => void;
  }

  interface InitDataUnsafe {
    query_id: string;
    user: User;
    receiver?: User;
    chat?: Chat;
    start_param?: string;
    can_send_after: number;
    auth_date: number;
    hash: string;
  }

  interface User {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_bot?: boolean;
  }

  interface Chat {
    id: number;
    type: string;
    title?: string;
    username?: string;
  }

  interface ThemeParams {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  }

  interface BackButton {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  }

  interface MainButton {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    setColor: (color: string) => void;
    setTextColor: (color: string) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive: boolean) => void;
    hideProgress: () => void;
    onClick: (callback: () => void) => void;
  }

  interface HapticFeedback {
    impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  }
}
