import CopyEmail from './CopyEmail.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import './Footer.css';

const groups = [
  {
    en: 'Explore', zh: '探索',
    links: [
      ['', 'Home', '首页'],
      ['services', 'Services', '服务'],
      ['about', 'About Us', '关于我们'],
      ['contact', 'Contact', '联系'],
    ],
  },
  {
    en: 'Legal', zh: '法律条款',
    links: [
      ['privacy', 'Privacy Policy', '隐私政策'],
      ['terms', 'Terms of Service', '服务条款'],
      ['refunds', 'Refund Policy', '退款政策'],
    ],
  },
  {
    en: 'Support', zh: '支持',
    links: [
      ['contact', 'Contact Us', '联系我们'],
    ],
  },
];

export default function Footer({ language = 'en', onLanguageChange, href, year = new Date().getFullYear() }) {
  const zh = language === 'zh-Hans';

  return (
    <footer className="yhf-footer full-width-footer">
      <div className="yhf-footer-inner">
        <div className="yhf-footer-grid">
          <div className="yhf-footer-company">
            <a className="yhf-footer-logo" href={href()} aria-label={zh ? 'Y. H. FUN 首页' : 'Y. H. FUN home'}>Y. H. FUN</a>
            <p>Y. H. FUN LIMITED<br />{zh ? '在爱尔兰注册。公司注册号：763264。' : 'Registered in Ireland. Company number: 763264.'}</p>
            <address>Dock Road,<br />Dunmore East,<br />Co. Waterford,<br />Ireland.</address>
            <div className="yhf-footer-social">
              <span className="yhf-footer-social-missing" role="img" aria-label="WhatsApp SVG pending" title="WhatsApp SVG pending" />
              <img src="/images/app-icons/App=Wechat,%20Colour=Stone.svg" width="24" height="24" alt="WeChat" />
              <img src="/images/app-icons/App=RedNote,%20Colour=Stone.svg" width="24" height="24" alt="RedNote" />
            </div>
          </div>
          {groups.map(group => (
            <nav className="yhf-footer-group" key={group.en} aria-label={zh ? group.zh : group.en}>
              <h2>{zh ? group.zh : group.en}</h2>
              <ul>
                {group.links.map(([route, en, translated]) => (
                  <li key={route}><a href={href(route)}>{zh ? translated : en}</a></li>
                ))}
                {group.en === 'Support' && <li><CopyEmail email="info@yhfunhq.com" language={language} /></li>}
              </ul>
            </nav>
          ))}
        </div>
        <div className="yhf-footer-bottom">
          <small>© {year} Y. H. FUN. {zh ? '保留所有权利。' : 'All rights reserved.'}</small>
          <LanguageSwitcher placement="footer" language={language} onLanguageChange={onLanguageChange} />
        </div>
      </div>
    </footer>
  );
}
