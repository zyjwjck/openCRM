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
  <title>{language === 'en' ? 'Terms of Service' : '服务条款'} | openCRM</title>
  <meta
    name="description"
    content={language === 'en' 
      ? 'openCRM Terms of Service - Terms and conditions for using openCRM.' 
      : 'openCRM 服务条款 - 使用 openCRM 的条款和条件。'}
  />
</svelte:head>

<div class="terms-page">
  <!-- Header with Language Switcher -->
  <header class="terms-header">
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
  <main class="terms-content">
    <div class="container">
      {#if language === 'en'}
        <!-- English Terms of Service -->
        <div class="terms-section">
          <h1>Terms of Service</h1>
          <h2>Legal Information</h2>
          <p>Transparent terms for our free, open-source CRM software and optional professional services. Built on trust and simplicity.</p>
          <p class="last-updated">Last Updated: June 2025</p>
          <p class="mit-licensed">MIT Licensed</p>
          
          <h2>Quick Navigation</h2>
          <ol class="quick-nav">
            <li><a href="#acceptance">1. Acceptance of Terms</a></li>
            <li><a href="#software-license">2. Software License & Open Source</a></li>
            <li><a href="#free-services">3. Free Software Services</a></li>
            <li><a href="#paid-services">4. Paid Professional Services</a></li>
            <li><a href="#responsibilities">5. User Responsibilities</a></li>
            <li><a href="#disclaimers">6. Disclaimers & Limitations</a></li>
            <li><a href="#contact">7. Contact Information</a></li>
            <li><a href="#changes">8. Changes to These Terms</a></li>
            <li><a href="#governing-law">9. Governing Law</a></li>
          </ol>
          
          <h2 id="acceptance">1. Acceptance of Terms</h2>
          <p>By accessing, downloading, or using openCRM software, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our software or services.</p>
          <ul>
            <li>These terms apply to all users of openCRM software</li>
            <li>By downloading or using our software, you accept these terms</li>
            <li>If you disagree with any part, please do not use openCRM</li>
          </ul>
          
          <h2 id="software-license">2. Software License & Open Source</h2>
          <p>openCRM is distributed under the MIT License, which grants you extensive rights to use, modify, and distribute the software. You may freely download, install, customize, and self-host openCRM without any licensing fees or subscription charges.</p>
          <h3>MIT License Summary</h3>
          <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software...</p>
          <p><a href="https://github.com/zyjwjck/openCRM/blob/main/LICENSE" target="_blank" rel="noopener">View Full License on GitHub</a></p>
          <h3>What you can do:</h3>
          <ul>
            <li>Use openCRM for personal or commercial purposes</li>
            <li>Modify and customize the source code</li>
            <li>Distribute copies of the original or modified software</li>
            <li>Self-host on your own servers or cloud infrastructure</li>
          </ul>
          
          <h2 id="free-services">3. Free Software Services</h2>
          <p>The openCRM software is provided free of charge with no warranty or guarantee. We make no representations about the software's suitability for your specific business needs. Use at your own risk.</p>
          <h3>Important Disclaimers for Free Software:</h3>
          <ul>
            <li>openCRM is provided "as is" without warranty of any kind</li>
            <li>No guarantee of fitness for any particular purpose</li>
            <li>Users are responsible for their own data backup and security</li>
            <li>Community support available through GitHub and forums</li>
          </ul>
          
          <h2 id="paid-services">4. Paid Professional Services</h2>
          <p>We offer optional paid services including hosting setup, custom development, data migration, training, and technical support. These services are governed by separate service agreements and payment terms.</p>
          <h3>Available Paid Services:</h3>
          <ul>
            <li><strong>Hosting & Deployment</strong> - Professional setup on your preferred cloud platform</li>
            <li><strong>Custom Development</strong> - Tailored features and integrations for your business</li>
            <li><strong>Data Migration</strong> - Import data from your existing CRM or systems</li>
            <li><strong>Training & Support</strong> - Team training and ongoing technical support</li>
          </ul>
          <p>Note: Paid services are subject to separate service agreements and payment terms. Contact us for pricing and availability.</p>
          
          <h2 id="responsibilities">5. User Responsibilities</h2>
          <p>You are responsible for your use of openCRM, including compliance with applicable laws, data protection regulations, and proper security practices when self-hosting the software.</p>
          <h3>Your Responsibilities Include:</h3>
          <ul>
            <li><strong>Data Protection:</strong> Comply with GDPR, CCPA, and other applicable data protection laws</li>
            <li><strong>Security:</strong> Implement proper security measures when self-hosting</li>
            <li><strong>Legal Compliance:</strong> Use openCRM in accordance with applicable laws</li>
            <li><strong>Proper Use:</strong> Do not use the software for illegal or harmful activities</li>
          </ul>
          
          <h2 id="disclaimers">6. Disclaimers & Limitations</h2>
          <p>openCRM is provided "as is" without warranty of any kind. We shall not be liable for any damages arising from the use of our software or services, except as required by applicable law.</p>
          <h3>Limitation of Liability:</h3>
          <p>IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
          <ul>
            <li>We are not responsible for data loss or business interruption</li>
            <li>No warranty regarding software performance or reliability</li>
            <li>Users assume all risks associated with software use</li>
          </ul>
          
          <h2 id="contact">7. Contact Information</h2>
          <p>For questions about these Terms of Service, the openCRM software, or our paid services, please contact us:</p>
          <p><a href="https://github.com/zyjwjck/openCRM" target="_blank" rel="noopener">GitHub Repository & Issues</a></p>
          
          <h2 id="changes">8. Changes to These Terms</h2>
          <p>We may update these Terms of Service from time to time. Any changes will be posted on this page with an updated "Last updated" date. Your continued use of openCRM after any changes constitutes acceptance of the new terms.</p>
          <p>For significant changes affecting paid services, we will provide reasonable notice to existing customers.</p>
          
          <h2 id="governing-law">9. Governing Law</h2>
          <p>These Terms of Service are governed by and construed in accordance with applicable international open-source software laws and the MIT License under which openCRM is distributed. Any disputes shall be resolved through appropriate legal channels in the jurisdiction where the dispute arises.</p>
        </div>
      {:else}
        <!-- Chinese Terms of Service -->
        <div class="terms-section">
          <h1>服务条款</h1>
          <h2>法律信息</h2>
          <p>我们的免费开源 CRM 软件和可选专业服务的透明条款。建立在信任和简单性的基础上。</p>
          <p class="last-updated">最后更新：2025年6月</p>
          <p class="mit-licensed">MIT 许可证</p>
          
          <h2>快速导航</h2>
          <ol class="quick-nav">
            <li><a href="#acceptance">1. 接受条款</a></li>
            <li><a href="#software-license">2. 软件许可证与开源</a></li>
            <li><a href="#free-services">3. 免费软件服务</a></li>
            <li><a href="#paid-services">4. 付费专业服务</a></li>
            <li><a href="#responsibilities">5. 用户责任</a></li>
            <li><a href="#disclaimers">6. 免责声明与限制</a></li>
            <li><a href="#contact">7. 联系信息</a></li>
            <li><a href="#changes">8. 条款变更</a></li>
            <li><a href="#governing-law">9. 适用法律</a></li>
          </ol>
          
          <h2 id="acceptance">1. 接受条款</h2>
          <p>通过访问、下载或使用 openCRM 软件，您同意受这些服务条款的约束。如果您不同意这些条款，请不要使用我们的软件或服务。</p>
          <ul>
            <li>这些条款适用于所有 openCRM 软件用户</li>
            <li>通过下载或使用我们的软件，您接受这些条款</li>
            <li>如果您不同意任何部分，请不要使用 openCRM</li>
          </ul>
          
          <h2 id="software-license">2. 软件许可证与开源</h2>
          <p>openCRM 根据 MIT 许可证分发，该许可证授予您使用、修改和分发软件的广泛权利。您可以免费下载、安装、定制和自托管 openCRM，无需任何许可费用或订阅费用。</p>
          <h3>MIT 许可证摘要</h3>
          <p>特此免费授予任何获得本软件副本的人...</p>
          <p><a href="https://github.com/zyjwjck/openCRM/blob/main/LICENSE" target="_blank" rel="noopener">在 GitHub 上查看完整许可证</a></p>
          <h3>您可以做什么：</h3>
          <ul>
            <li>将 openCRM 用于个人或商业目的</li>
            <li>修改和定制源代码</li>
            <li>分发原始或修改后的软件副本</li>
            <li>在您自己的服务器或云基础设施上自托管</li>
          </ul>
          
          <h2 id="free-services">3. 免费软件服务</h2>
          <p>openCRM 软件免费提供，不提供任何保证或担保。我们对软件是否适合您的特定业务需求不做任何陈述。使用风险自负。</p>
          <h3>免费软件的重要免责声明：</h3>
          <ul>
            <li>openCRM 按"原样"提供，不提供任何形式的保证</li>
            <li>不保证适合任何特定目的</li>
            <li>用户负责自己的数据备份和安全</li>
            <li>通过 GitHub 和论坛提供社区支持</li>
          </ul>
          
          <h2 id="paid-services">4. 付费专业服务</h2>
          <p>我们提供可选的付费服务，包括托管设置、定制开发、数据迁移、培训和技术支持。这些服务受单独的服务协议和付款条款约束。</p>
          <h3>可用的付费服务：</h3>
          <ul>
            <li><strong>托管与部署</strong> - 在您首选的云平台上进行专业设置</li>
            <li><strong>定制开发</strong> - 为您的业务定制功能和集成</li>
            <li><strong>数据迁移</strong> - 从您现有的 CRM 或系统导入数据</li>
            <li><strong>培训与支持</strong> - 团队培训和持续技术支持</li>
          </ul>
          <p>注意：付费服务受单独的服务协议和付款条款约束。请联系我们了解定价和可用性。</p>
          
          <h2 id="responsibilities">5. 用户责任</h2>
          <p>您对使用 openCRM 负责，包括遵守适用法律、数据保护法规以及自托管软件时的适当安全实践。</p>
          <h3>您的责任包括：</h3>
          <ul>
            <li><strong>数据保护：</strong>遵守 GDPR、CCPA 和其他适用的数据保护法律</li>
            <li><strong>安全：</strong>自托管时实施适当的安全措施</li>
            <li><strong>法律合规：</strong>按照适用法律使用 openCRM</li>
            <li><strong>正确使用：</strong>不要将软件用于非法或有害活动</li>
          </ul>
          
          <h2 id="disclaimers">6. 免责声明与限制</h2>
          <p>openCRM 按"原样"提供，不提供任何形式的保证。我们不对因使用我们的软件或服务而产生的任何损害承担责任，除非适用法律要求。</p>
          <h3>责任限制：</h3>
          <p>在任何情况下，作者或版权持有人均不对任何索赔、损害或其他责任承担责任，无论是在合同、侵权或其他行动中，因软件或软件使用或其他交易而产生的。</p>
          <ul>
            <li>我们不对数据丢失或业务中断负责</li>
            <li>不保证软件性能或可靠性</li>
            <li>用户承担与软件使用相关的所有风险</li>
          </ul>
          
          <h2 id="contact">7. 联系信息</h2>
          <p>有关这些服务条款、openCRM 软件或我们的付费服务的问题，请联系我们：</p>
          <p><a href="https://github.com/zyjwjck/openCRM" target="_blank" rel="noopener">GitHub 存储库和问题</a></p>
          
          <h2 id="changes">8. 条款变更</h2>
          <p>我们可能会不时更新这些服务条款。任何变更将在本页面上发布，并更新"最后更新"日期。您在任何变更后继续使用 openCRM 即表示接受新条款。</p>
          <p>对于影响付费服务的重大变更，我们将向现有客户提供合理的通知。</p>
          
          <h2 id="governing-law">9. 适用法律</h2>
          <p>这些服务条款受适用的国际开源软件法律和 openCRM 分发所依据的 MIT 许可证管辖和解释。任何争议应通过争议发生地司法管辖区的适当法律渠道解决。</p>
        </div>
      {/if}
    </div>
  </main>

  <!-- Footer -->
  <footer class="terms-footer">
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
  .terms-page {
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
  .terms-header {
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
  .terms-content {
    flex: 1;
    padding: 4rem 0;
  }

  .terms-section {
    background: #fff;
    border-radius: 8px;
    padding: 3rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .terms-section h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #33475b;
    margin: 0 0 1rem;
    letter-spacing: -0.02em;
  }

  .terms-section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #33475b;
    margin: 2.5rem 0 1.5rem;
    letter-spacing: -0.01em;
  }

  .terms-section p {
    font-size: 1rem;
    line-height: 1.6;
    color: #516f90;
    margin: 0 0 1.5rem;
  }

  .last-updated {
    font-size: 0.875rem;
    color: #7c98b6;
    margin-bottom: 0.5rem;
  }

  .mit-licensed {
    font-size: 0.875rem;
    color: #7c98b6;
    margin-bottom: 2rem;
  }

  .quick-nav {
    list-style-type: decimal;
    margin: 0 0 2rem;
    padding-left: 1.5rem;
  }

  .quick-nav li {
    margin: 0 0 0.5rem;
  }

  .quick-nav a {
    color: #ff7a59;
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .quick-nav a:hover {
    color: #ff5c35;
    text-decoration: underline;
  }

  .terms-section h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #33475b;
    margin: 1.5rem 0 1rem;
  }

  .terms-section ul {
    margin: 0 0 1.5rem;
    padding-left: 1.5rem;
  }

  .terms-section li {
    font-size: 1rem;
    line-height: 1.6;
    color: #516f90;
    margin: 0 0 0.5rem;
  }

  /* Footer */
  .terms-footer {
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

    .terms-section {
      padding: 2rem 1.5rem;
    }

    .terms-section h1 {
      font-size: 2rem;
    }

    .terms-section h2 {
      font-size: 1.25rem;
    }
  }

  @media (max-width: 480px) {
    .language-switcher-top {
      top: 1rem;
      right: 1rem;
    }

    .terms-content {
      padding: 2rem 0;
    }

    .terms-section {
      padding: 1.5rem;
    }

    .terms-section h1 {
      font-size: 1.75rem;
    }
  }

  /* Dark mode support */
  :global(.dark) .terms-page {
    background: #1a1a1a;
  }

  :global(.dark) .terms-header {
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

  :global(.dark) .terms-section {
    background: #2d2d2d;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  :global(.dark) .terms-section h1,
  :global(.dark) .terms-section h2,
  :global(.dark) .terms-section h3 {
    color: #fff;
  }

  :global(.dark) .terms-section p,
  :global(.dark) .terms-section li {
    color: #999;
  }

  :global(.dark) .last-updated,
  :global(.dark) .mit-licensed {
    color: #777;
  }

  :global(.dark) .quick-nav a {
    color: #ff7a59;
  }

  :global(.dark) .quick-nav a:hover {
    color: #ff987f;
  }

  :global(.dark) .terms-footer {
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