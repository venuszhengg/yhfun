import './CompanionSection.css'

const principles = [
  {
    title: 'Understand first',
    description: 'Start with your situation as it really is.',
    chineseTitle: '先理解',
    chineseDescription: '从你的真实处境出发。',
    icon: "What you're facing.svg",
  },
  {
    title: 'Then try it out',
    description: 'Take small steps and learn from what happens.',
    chineseTitle: '再尝试',
    chineseDescription: '用小步骤获得实际反馈。',
    icon: 'Bring ideas into the workflow.svg',
  },
  {
    title: 'Use it again',
    description: 'Keep methods you can draw on in future.',
    chineseTitle: '能复用',
    chineseDescription: '留下以后用得上的方法。',
    icon: 'Let feedback guide decisions.svg',
  },
]

export default function CompanionSection({ language }) {
  const chinese = language === 'zh-Hans'

  return <section className="companion-section" aria-labelledby="about-companion-heading">
    <h1 id="about-companion-heading" data-reveal="text">{chinese ? '像伙伴一样，共同推进' : 'A companion you can count on.'}</h1>
    <div className="companion-panel">
      {principles.map((principle, index) => <article className="companion-principle" key={principle.title}>
        <div className="companion-principle-content" data-reveal="text" data-reveal-order={index}>
          <img src={`/images/service-icons/${encodeURIComponent(principle.icon)}`} alt="" width="80" height="80" />
          <h3>{chinese ? principle.chineseTitle : principle.title}</h3>
          <p>{chinese ? principle.chineseDescription : principle.description}</p>
        </div>
      </article>)}
    </div>
  </section>
}
