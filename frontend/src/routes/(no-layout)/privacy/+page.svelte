<script>
  import '../../../app.css';
  import imgLogo from '$lib/assets/images/logo.png';
  import { getCurrentLanguage, setCurrentLanguage } from '$lib/utils/i18n.js';

  let language = getCurrentLanguage();

  const setLanguage = (newLanguage) => {
    language = newLanguage;
    setCurrentLanguage(newLanguage);
    // Trigger a custom event to notify other components of language change
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: newLanguage } }));
    }
  };
</script>

<svelte:head>
  <title>{language === 'en' ? 'Privacy Policy' : '隐私政策'} | openCRM</title>
  <meta
    name="description"
    content={language === 'en' 
      ? 'openCRM Privacy Policy - Your privacy and data ownership are fundamental rights.' 
      : 'openCRM 隐私政策 - 您的隐私和数据所有权是基本权利。'}
  />
</svelte:head>

<div class="privacy-page">
  <!-- Header with Language Switcher -->
  <header class="privacy-header">
    <div class="container">
      <div class="header-content">
        <a href="/" class="logo">
          <img src={imgLogo} alt="openCRM Logo" class="logo-icon" />
          <span class="logo-text">openCRM</span>
        </a>
        <div class="header-actions">
          <a href="/login" class="back-link">{language === 'en' ? 'Back to Login' : '返回登录'}</a>
          <div class="language-switcher">
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
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="privacy-content">
    <div class="container">
      {#if language === 'en'}
        <!-- English Privacy Policy -->
        <div class="privacy-section">
          <h1>Your Privacy, Our Priority</h1>
          <h2>Privacy Policy</h2>
          <p>At openCRM, we believe in complete transparency about how we handle your data. As a self-hostable, open-source CRM, your privacy and data ownership are fundamental rights.</p>
          <p class="last-updated">Last Updated: June 2025</p>
          
          
          <h3>Principles</h3>
          <h4>Our Privacy Principles</h4>
          <p>openCRM is built on the foundation of user privacy and data ownership.</p>
          
          <ul class="principles-list">
            <li>
              <strong>Data Ownership</strong>
              <p>When you self-host openCRM, you maintain complete ownership and control of your data.</p>
            </li>
            <li>
              <strong>Self-Hosting Privacy</strong>
              <p>Host on your own servers for maximum privacy and compliance with data protection regulations.</p>
            </li>
            <li>
              <strong>No Data Mining</strong>
              <p>We don't collect, analyze, or monetize your business data. Your information stays private.</p>
            </li>
            <li>
              <strong>Transparency</strong>
              <p>Open-source code means you can inspect exactly how your data is handled and stored.</p>
            </li>
          </ul>
          
          <h3>Information We Collect</h3>
          <h4>Self-Hosted Deployments</h4>
          <p>When you self-host openCRM, we do not collect any of your business data, customer information, or usage analytics. All data remains on your servers under your complete control.</p>
          
          <h4>Website Analytics (opencrm.io only)</h4>
          <ul>
            <li>Basic website analytics (page views, visitor count, referral sources)</li>
            <li>IP addresses (anonymized and not linked to personal identity)</li>
            <li>Browser type and device information (for optimization purposes)</li>
          </ul>
          
          <h4>Information You Provide</h4>
          <ul>
            <li>Contact information when you reach out for support or inquiries</li>
            <li>Feedback and suggestions submitted through our channels</li>
            <li>Professional service requests and consultation details</li>
          </ul>
          
          <h3>How We Use Your Information</h3>
          <h4>What We DO Use Information For:</h4>
          <ul>
            <li>Responding to support requests and inquiries</li>
            <li>Improving our website and documentation</li>
            <li>Providing professional services when requested</li>
            <li>Communicating important updates about openCRM</li>
          </ul>
          
          <h4>What We DON'T Use Information For:</h4>
          <ul>
            <li>Selling or sharing with third parties</li>
            <li>Marketing campaigns or advertisements</li>
            <li>Building user profiles or tracking</li>
            <li>Any form of data monetization</li>
          </ul>
          
          <h3>Data Storage & Security</h3>
          <h4>Self-Hosted Security</h4>
          <p>When you self-host openCRM, you are responsible for implementing appropriate security measures. We provide documentation and best practices to help secure your installation.</p>
          
          <ul>
            <li>Use HTTPS/SSL encryption for web traffic</li>
            <li>Implement proper database security and access controls</li>
            <li>Regular security updates and patches</li>
            <li>Backup and disaster recovery procedures</li>
          </ul>
          
          <h3>Your Privacy Rights</h3>
          <h4>Data Subject Rights</h4>
          <ul>
            <li>Right to access your personal data</li>
            <li>Right to rectification (correction)</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to data portability</li>
          </ul>
          
          <h4>Self-Hosting Advantages</h4>
          <ul>
            <li>Complete control over data location</li>
            <li>No third-party data sharing</li>
            <li>Compliance with local regulations</li>
            <li>Custom data retention policies</li>
          </ul>
          
          <h3>Contact Information</h3>
          <h4>Questions About This Policy?</h4>
          <p>If you have any questions about this Privacy Policy or how we handle your data, please contact us:</p>

          
          <h3>Open Source Transparency</h3>
          <p>Complete Transparency: As an open-source project, you can inspect our entire codebase to verify how data is handled, stored, and processed. This level of transparency is impossible with proprietary CRM solutions.</p>
          <p><a href="https://github.com/zyjwjck/openCRM" target="_blank" rel="noopener">View Source Code</a></p>
          
          <h3>Take Control of Your Data Privacy</h3>
          <p>Ready to switch to a CRM solution that truly respects your privacy? Self-host openCRM and maintain complete control over your business data.</p>
        </div>
      {:else}
        <!-- Chinese Privacy Policy -->
        <div class="privacy-section">
          <h1>您的隐私，我们的优先事项</h1>
          <h2>隐私政策</h2>
          <p>在 openCRM，我们相信完全透明地处理您的数据。作为一个可自托管的开源 CRM，您的隐私和数据所有权是基本权利。</p>
          <p class="last-updated">最后更新：2025年6月</p>
          

          
          <h3>原则</h3>
          <h4>我们的隐私原则</h4>
          <p>openCRM 建立在用户隐私和数据所有权的基础上。</p>
          
          <ul class="principles-list">
            <li>
              <strong>数据所有权</strong>
              <p>当您自托管 openCRM 时，您保持对数据的完全所有权和控制权。</p>
            </li>
            <li>
              <strong>自托管隐私</strong>
              <p>在您自己的服务器上托管，以获得最大的隐私和符合数据保护法规。</p>
            </li>
            <li>
              <strong>无数据挖掘</strong>
              <p>我们不收集、分析或货币化您的业务数据。您的信息保持私密。</p>
            </li>
            <li>
              <strong>透明度</strong>
              <p>开源代码意味着您可以确切地检查您的数据是如何处理和存储的。</p>
            </li>
          </ul>
          
          <h3>我们收集的信息</h3>
          <h4>自托管部署</h4>
          <p>当您自托管 openCRM 时，我们不会收集您的任何业务数据、客户信息或使用分析。所有数据都保留在您的服务器上，由您完全控制。</p>
          
          <h4>网站分析（仅 opencrm.io）</h4>
          <ul>
            <li>基本网站分析（页面浏览量、访问者数量、引荐来源）</li>
            <li>IP 地址（匿名化且不与个人身份关联）</li>
            <li>浏览器类型和设备信息（用于优化目的）</li>
          </ul>
          
          <h4>您提供的信息</h4>
          <ul>
            <li>当您联系我们寻求支持或咨询时的联系信息</li>
            <li>通过我们的渠道提交的反馈和建议</li>
            <li>专业服务请求和咨询详情</li>
          </ul>
          
          <h3>我们如何使用您的信息</h3>
          <h4>我们使用信息的目的：</h4>
          <ul>
            <li>回应支持请求和咨询</li>
            <li>改进我们的网站和文档</li>
            <li>在请求时提供专业服务</li>
            <li>传达有关 openCRM 的重要更新</li>
          </ul>
          
          <h4>我们不使用信息的目的：</h4>
          <ul>
            <li>出售或与第三方共享</li>
            <li>营销活动或广告</li>
            <li>建立用户配置文件或跟踪</li>
            <li>任何形式的数据货币化</li>
          </ul>
          
          <h3>数据存储与安全</h3>
          <h4>自托管安全</h4>
          <p>当您自托管 openCRM 时，您负责实施适当的安全措施。我们提供文档和最佳实践来帮助保护您的安装。</p>
          
          <ul>
            <li>对网络流量使用 HTTPS/SSL 加密</li>
            <li>实施适当的数据库安全和访问控制</li>
            <li>定期安全更新和补丁</li>
            <li>备份和灾难恢复程序</li>
          </ul>
          
          <h3>您的隐私权利</h3>
          <h4>数据主体权利</h4>
          <ul>
            <li>访问您的个人数据的权利</li>
            <li> rectification（更正）的权利</li>
            <li> erasure（"被遗忘的权利"）的权利</li>
            <li>数据可移植性的权利</li>
          </ul>
          
          <h4>自托管优势</h4>
          <ul>
            <li>对数据位置的完全控制</li>
            <li>无第三方数据共享</li>
            <li>符合当地法规</li>
            <li>自定义数据保留政策</li>
          </ul>
          
          <h3>联系信息</h3>
          <h4>有关本政策的问题？</h4>
          <p>如果您对本隐私政策或我们如何处理您的数据有任何问题，请联系我们。</p>

          
          <h3>开源透明度</h3>
          <p>完全透明：作为一个开源项目，您可以检查我们的整个代码库，以验证数据是如何处理、存储和处理的。这种透明度水平在专有 CRM 解决方案中是不可能实现的。</p>
          <p><a href="https://github.com/zyjwjck/openCRM" target="_blank" rel="noopener">查看源代码</a></p>
          
          <h3>掌控您的数据隐私</h3>
          <p>准备好切换到真正尊重您隐私的 CRM 解决方案了吗？自托管 openCRM 并保持对您业务数据的完全控制。</p>
        </div>
      {/if}
    </div>
  </main>

  <!-- Footer -->
  <footer class="privacy-footer">
    <div class="container">
      <div class="footer-content">
        <a href="/privacy">{language === 'en' ? 'Privacy Policy' : '隐私政策'}</a>
        <span class="dot"></span>
        <a href="/terms">{language === 'en' ? 'Terms of Service' : '服务条款'}</a>
        <span class="dot"></span>
        <a href="https://github.com/zyjwjck/openCRM" target="_blank" rel="noopener">GitHub</a>
      </div>
    </div>
  </footer>
</div>

<style>
  .privacy-page {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    background: #f5f8fa;
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

  /* Header */
  .privacy-header {
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    padding: 1.5rem 0;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
  }

  .logo-icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    color: #33475b;
    letter-spacing: -0.02em;
  }

  .back-link {
    font-size: 0.875rem;
    font-weight: 500;
    color: #ff7a59;
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .back-link:hover {
    color: #ff5c35;
    text-decoration: underline;
  }

  .language-switcher {
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

  /* Main Content */
  .privacy-content {
    flex: 1;
    padding: 4rem 0;
  }

  .privacy-section {
    background: #fff;
    border-radius: 8px;
    padding: 3rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .privacy-section h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #33475b;
    margin: 0 0 1rem;
    letter-spacing: -0.02em;
  }

  .privacy-section h2 {
    font-size: 1.75rem;
    font-weight: 600;
    color: #33475b;
    margin: 0 0 2rem;
    letter-spacing: -0.01em;
  }

  .privacy-section h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #33475b;
    margin: 2.5rem 0 1.5rem;
    letter-spacing: -0.01em;
  }

  .privacy-section h4 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #33475b;
    margin: 1.5rem 0 1rem;
    letter-spacing: -0.01em;
  }

  .privacy-section p {
    font-size: 1rem;
    line-height: 1.6;
    color: #516f90;
    margin: 0 0 1.5rem;
  }

  .last-updated {
    font-size: 0.875rem;
    color: #7c98b6;
    margin-bottom: 2rem;
  }

  .privacy-section ul {
    margin: 0 0 1.5rem;
    padding-left: 1.5rem;
  }

  .privacy-section li {
    font-size: 1rem;
    line-height: 1.6;
    color: #516f90;
    margin: 0 0 0.5rem;
  }

  .principles-list {
    list-style: none;
    padding-left: 0;
  }

  .principles-list li {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 0 0 1rem;
  }

  .principles-list strong {
    display: block;
    font-size: 1.125rem;
    font-weight: 600;
    color: #33475b;
    margin: 0 0 0.5rem;
  }

  .privacy-section a {
    color: #ff7a59;
    text-decoration: none;
    font-weight: 500;
  }

  .privacy-section a:hover {
    text-decoration: underline;
  }

  /* Footer */
  .privacy-footer {
    background: #fff;
    border-top: 1px solid #e8e8e8;
    padding: 2rem 0;
  }

  .footer-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .footer-content a {
    font-size: 0.8125rem;
    color: #7c98b6;
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .footer-content a:hover {
    color: #33475b;
  }

  .footer-content span {
    font-size: 0.8125rem;
    color: #7c98b6;
  }

  .dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #cbd6e2;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .container {
      padding: 0 1.5rem;
    }

    .privacy-section {
      padding: 2rem 1.5rem;
    }

    .privacy-section h1 {
      font-size: 2rem;
    }

    .privacy-section h2 {
      font-size: 1.5rem;
    }

    .privacy-section h3 {
      font-size: 1.25rem;
    }

    .privacy-section h4 {
      font-size: 1.125rem;
    }
  }

  @media (max-width: 480px) {
    .language-switcher-top {
      top: 1rem;
      right: 1rem;
    }

    .privacy-content {
      padding: 2rem 0;
    }

    .privacy-section {
      padding: 1.5rem;
    }

    .privacy-section h1 {
      font-size: 1.75rem;
    }
  }

  /* Dark mode support */
  :global(.dark) .privacy-page {
    background: #1a1a1a;
  }

  :global(.dark) .privacy-header {
    background: #2d2d2d;
    border-bottom-color: #404040;
  }

  :global(.dark) .logo-text {
    color: #fff;
  }

  :global(.dark) .back-link {
    color: #ff7a59;
  }

  :global(.dark) .back-link:hover {
    color: #ff987f;
  }

  :global(.dark) .privacy-section {
    background: #2d2d2d;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  :global(.dark) .privacy-section h1,
  :global(.dark) .privacy-section h2,
  :global(.dark) .privacy-section h3,
  :global(.dark) .privacy-section h4 {
    color: #fff;
  }

  :global(.dark) .privacy-section p,
  :global(.dark) .privacy-section li {
    color: #999;
  }

  :global(.dark) .last-updated {
    color: #777;
  }

  :global(.dark) .principles-list li {
    background: #3a3a3a;
  }

  :global(.dark) .principles-list strong {
    color: #fff;
  }

  :global(.dark) .privacy-footer {
    background: #2d2d2d;
    border-top-color: #404040;
  }

  :global(.dark) .footer-content a,
  :global(.dark) .footer-content span {
    color: #888;
  }

  :global(.dark) .footer-content a:hover {
    color: #fff;
  }

  :global(.dark) .dot {
    background: #404040;
  }
</style>