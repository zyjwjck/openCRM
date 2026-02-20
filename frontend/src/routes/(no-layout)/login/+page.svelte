<script>
  import '../../../app.css';

  import imgLogo from '$lib/assets/images/logo.png';
  import { ArrowRight } from '@lucide/svelte';
  import { t, getCurrentLanguage, setCurrentLanguage } from '$lib/utils/i18n.js';

  let isLoading = false;
  let email = '';
  let password = '';
  let error = '';
  let language = getCurrentLanguage();

  const setLanguage = (newLanguage) => {
    language = newLanguage;
    setCurrentLanguage(newLanguage);
    // Trigger a custom event to notify other components of language change
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: newLanguage } }));
    }
  };

  async function handleEmailLogin() {
    isLoading = true;
    error = '';

    try {
      console.log('Starting login process...');
      console.log('Email:', email);
      console.log('Password:', password);
      
      // 测试后端API是否可访问
      console.log('Testing backend API accessibility...');
      
      // 使用相对路径，让请求通过Vite代理转发到后端服务器
      const loginUrl = '/api/auth/login/';
      console.log('Login URL:', loginUrl);
      
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      };
      
      console.log('Request options:', requestOptions);
      
      // 发送登录请求
      console.log('Sending login request...');
      const response = await fetch(loginUrl, requestOptions);
      
      console.log('Login response received:', response);
      console.log('Login response status:', response.status);
      console.log('Login response ok:', response.ok);

      if (!response.ok) {
        console.log('Login response not ok, reading error data...');
        try {
          const errorData = await response.json();
          console.log('Login error data:', errorData);
          throw new Error(errorData.error || 'Invalid email or password');
        } catch (jsonError) {
          console.log('Error reading JSON error data:', jsonError);
          throw new Error('Invalid email or password');
        }
      }

      console.log('Login response ok, reading data...');
      const data = await response.json();
      console.log('Login success data:', data);
      
      // Store tokens in localStorage
      console.log('Storing tokens in localStorage...');
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('Tokens stored in localStorage');
      console.log('Access token stored:', localStorage.getItem('access_token') ? 'Yes' : 'No');

      // Store tokens in cookies for server-side authentication
      // This is critical for SvelteKit's server-side auth logic
      console.log('Storing tokens in cookies...');
      // 不设置 httpOnly 标志，因为 document.cookie 无法设置这个标志
      document.cookie = `jwt_access=${data.access_token}; path=/; SameSite=Lax`;
      document.cookie = `jwt_refresh=${data.refresh_token}; path=/; SameSite=Lax`;
      
      // Get org ID from response data or from token payload
      let orgId = null;
      
      // First try to get org ID from response data (most reliable)
      if (data.current_org && data.current_org.id) {
        orgId = data.current_org.id;
        console.log('Org ID from response data:', orgId);
      } else {
        // Fallback: try to extract from token payload
        function getOrgIdFromToken(token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.org_id || null;
          } catch (e) {
            console.log('Error extracting org ID from token:', e);
            return null;
          }
        }
        
        orgId = getOrgIdFromToken(data.access_token);
        if (orgId) {
          console.log('Org ID from token payload:', orgId);
        }
      }
      
      if (orgId) {
          document.cookie = `org=${orgId}; path=/; SameSite=Lax`;
          console.log('Org ID stored in cookie:', orgId);
        } else {
          console.log('No org ID found in response or token, redirecting to org selection');
          // If no org ID found, redirect to org selection page
          setTimeout(() => {
            window.location.href = '/org';
          }, 100);
          return;
        }
        
        console.log('Tokens stored in cookies');

        // 强制重定向，使用setTimeout确保所有代码都执行完毕
        console.log('Redirecting to dashboard...');
        setTimeout(() => {
          console.log('Inside setTimeout, redirecting now...');
          window.location.href = '/';
          console.log('Redirect initiated');
        }, 100);
    } catch (err) {
      console.log('Login error:', err);
      console.log('Error name:', err.name);
      console.log('Error message:', err.message);
      console.log('Error stack:', err.stack);
      
      // Handle different types of errors
      if (err instanceof Error) {
        error = err.message;
      } else if (typeof err === 'object' && err !== null) {
        // If it's an object, try to extract a meaningful error message
        if (err.error) {
          error = typeof err.error === 'string' ? err.error : 'Invalid email or password';
        } else {
          error = 'Invalid email or password';
        }
      } else {
        error = 'Invalid email or password';
      }
      
      console.log('Final error message:', error);
    } finally {
      isLoading = false;
      console.log('Login process completed');
    }
  }
</script>

<svelte:head>
  <title>{t('login', language)} | openCRM</title>
  <meta
    name="description"
    content={`${t('login', language)} to openCRM to manage your contacts, deals, and grow your business.`}
  />
</svelte:head>

<div class="login-page">
  <!-- Language Switcher (Top Right) -->
  <div class="language-switcher-top">
    <button 
      onclick={() => setLanguage('en')} 
      class="language-btn {language === 'en' ? 'active' : ''}"
    >
      EN
    </button>
    <button 
      onclick={() => setLanguage('zh')} 
      class="language-btn {language === 'zh' ? 'active' : ''}"
    >
      中文
    </button>
  </div>
  
  <!-- Main Container -->
  <div class="login-wrapper">
    <!-- Logo -->
    <a href="/" class="logo">
      <img src={imgLogo} alt="" class="logo-icon" />
      <span class="logo-text">openCRM</span>
    </a>

    <!-- Login Card -->
    <div class="login-card">
      <h1 class="login-title">{t('loginToAccount', language)}</h1>

      <!-- Email/Password Login Form -->
      <div class="login-form">
        {#if error}
          <div class="error-message">{error}</div>
        {/if}
        
        <div class="form-group">
          <label for="email">{t('email', language)}</label>
          <input
            type="email"
            id="email"
            bind:value={email}
            required
            placeholder={t('enterEmail', language)}
            disabled={isLoading}
          />
        </div>

        <div class="form-group">
          <label for="password">{t('password', language)}</label>
          <input
            type="password"
            id="password"
            bind:value={password}
            required
            placeholder={t('enterPassword', language)}
            disabled={isLoading}
          />
        </div>

        <button
          type="button"
          onclick={handleEmailLogin}
          class="login-btn"
          disabled={isLoading}
        >
          {#if isLoading}
            <span class="spinner"></span>
            <span>{t('signingIn', language)}</span>
          {:else}
            <span>{t('signIn', language)}</span>
            <ArrowRight size={16} />
          {/if}
        </button>
      </div>
    </div>

    <!-- Help Links -->
    <div class="help-section">
      <p class="help-text">
        {t('dontHaveAccount', language)} <a href="#" class="help-link">{t('signUpForFree', language)}</a>
      </p>
    </div>

    <!-- Footer -->
    <footer class="login-footer">
      <a href="https://bottlecrm.io/privacy-policy">{t('privacyPolicy', language)}</a>
      <span class="dot"></span>
      <a href="https://bottlecrm.io/terms">{t('termsOfService', language)}</a>
      <span class="dot"></span>
      <a href="https://github.com/zyjwjck/openCRM" target="_blank" rel="noopener">GitHub</a>
    </footer>
  </div>
</div>

<style>
  .login-page {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f8fa;
    padding: 2rem;
    position: relative;
  }

  /* Language Switcher (Top Right) */
  .language-switcher-top {
    position: absolute;
    top: 2rem;
    right: 2rem;
    display: flex;
    gap: 0.5rem;
  }

  .language-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #cbd6e2;
    border-radius: 6px;
    background: #fff;
    color: #33475b;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .language-btn:hover {
    background: #f8f9fa;
    border-color: #ff7a59;
  }

  .language-btn.active {
    background: #33475b;
    color: #fff;
    border-color: #33475b;
  }

  /* Dark mode support for language switcher */
  :global(.dark) .language-btn {
    background: #2d2d2d;
    border-color: #404040;
    color: #fff;
  }

  :global(.dark) .language-btn:hover {
    background: #3a3a3a;
    border-color: #ff7a59;
  }

  :global(.dark) .language-btn.active {
    background: #516f90;
    border-color: #516f90;
  }

  .login-wrapper {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Logo */
  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    margin-bottom: 2rem;
  }

  .logo-icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    color: #33475b;
    letter-spacing: -0.02em;
  }

  /* Login Card */
  .login-card {
    width: 100%;
    background: #fff;
    border-radius: 8px;
    padding: 2.5rem 2rem;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.08),
      0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .login-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #33475b;
    text-align: center;
    margin: 0 0 1.5rem;
    letter-spacing: -0.01em;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Login Form */
  .login-form {
    width: 100%;
  }

  .error-message {
    background: #fee;
    border: 1px solid #fcc;
    color: #c33;
    padding: 0.75rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #33475b;
    margin-bottom: 0.5rem;
  }

  .form-group input {
    width: 100%;
    height: 48px;
    padding: 0 1rem;
    border: 1px solid #cbd6e2;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.15s ease;
  }

  .form-group input:focus {
    outline: none;
    border-color: #ff7a59;
    box-shadow: 0 0 0 3px rgba(255, 122, 89, 0.1);
  }

  .form-group input:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
  }

  .login-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    height: 48px;
    background: #33475b;
    border: none;
    border-radius: 6px;
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .login-btn:hover {
    background: #2a3b4c;
  }

  .login-btn:active {
    background: #233140;
  }

  .login-btn:disabled {
    background: #7c98b6;
    cursor: not-allowed;
  }

  .login-btn .spinner {
    border-color: rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
  }

  /* Help Section */
  .help-section {
    margin-top: 1.5rem;
    text-align: center;
  }

  .help-text {
    font-size: 0.9375rem;
    color: #516f90;
    margin: 0;
  }

  .help-link {
    color: #ff7a59;
    text-decoration: none;
    font-weight: 500;
  }

  .help-link:hover {
    text-decoration: underline;
  }

  /* Footer */
  .login-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  .login-footer a {
    font-size: 0.8125rem;
    color: #7c98b6;
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .login-footer a:hover {
    color: #33475b;
  }

  .dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #cbd6e2;
  }

  /* Responsive */
  @media (max-width: 480px) {
    .login-page {
      padding: 1.5rem;
      align-items: flex-start;
      padding-top: 3rem;
    }

    .login-card {
      padding: 2rem 1.5rem;
    }

    .login-title {
      font-size: 1.375rem;
    }
  }

  /* Dark mode support */
  :global(.dark) .login-page {
    background: #1a1a1a;
  }

  :global(.dark) .login-card {
    background: #2d2d2d;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.2),
      0 4px 12px rgba(0, 0, 0, 0.15);
  }

  :global(.dark) .logo-text {
    color: #fff;
  }

  :global(.dark) .login-title {
    color: #fff;
  }

  :global(.dark) .help-text {
    color: #999;
  }

  :global(.dark) .login-footer a {
    color: #888;
  }

  :global(.dark) .login-footer a:hover {
    color: #fff;
  }

  :global(.dark) .dot {
    background: #404040;
  }
</style>