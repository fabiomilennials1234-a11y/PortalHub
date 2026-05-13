// Main app — assembles wireframes into a Design Canvas with sections.

const W = 1180;
const H = 720;

const DEFAULT_TWEAKS = /*EDITMODE-BEGIN*/{
  "density": "comfy",
  "showAnnotations": true,
  "accent": "#ff5a1f"
}/*EDITMODE-END*/;

const App = () => {
  const [t, setTweak] = useTweaks(DEFAULT_TWEAKS);

  // Apply globals when tweaks change
  React.useEffect(() => {
    document.documentElement.style.setProperty('--wf-accent-override', t.accent);
    // Toggle annotations visibility
    const style = document.getElementById('wf-tweaks-style') || (() => {
      const s = document.createElement('style');
      s.id = 'wf-tweaks-style';
      document.head.appendChild(s);
      return s;
    })();
    style.textContent = `
      .wf { --accent: ${t.accent} !important; }
      ${t.showAnnotations ? '' : '.wf-note, [data-callout] { display: none !important; }'}
    `;
  }, [t.accent, t.showAnnotations]);

  const sections = [
    {
      id: 'landing',
      title: '01 · Landing / Marketing',
      subtitle: 'Como você posiciona o produto — pitch, prova social, primeira impressão.',
      boards: [
        {id: 'landing-a', label: 'A · Hero clássico', C: LandingClassic},
        {id: 'landing-b', label: 'B · Produto como herói', C: LandingProductFirst},
        {id: 'landing-c', label: 'C · Editorial / manifesto', C: LandingEditorial},
      ],
    },
    {
      id: 'auth',
      title: '02 · Login & Signup',
      subtitle: 'Fricção zero pra entrar; alguma personalidade no primeiro contato.',
      boards: [
        {id: 'auth-a', label: 'A · Login centrado', C: LoginCentered},
        {id: 'auth-b', label: 'B · Login + "o que você perdeu"', C: LoginSplit},
        {id: 'auth-c', label: 'C · Signup progressivo (1 pergunta)', C: SignupProgressive},
      ],
    },
    {
      id: 'feed',
      title: '03 · Feed da comunidade',
      subtitle: 'O surface mais usado. Três jeitos de organizar atenção.',
      boards: [
        {id: 'feed-a', label: 'A · 3 colunas clássico', C: FeedClassic},
        {id: 'feed-b', label: 'B · Stream por humor / chips', C: FeedStream},
        {id: 'feed-c', label: 'C · Timeline cronológica', C: FeedTimeline},
      ],
    },
    {
      id: 'post',
      title: '04 · Post detail',
      subtitle: 'Lendo + respondendo. Pra perguntas, debates, showcases.',
      boards: [
        {id: 'post-a', label: 'A · Thread tradicional', C: PostThreaded},
        {id: 'post-b', label: 'B · Documento + comentários na margem', C: PostDocMargin},
        {id: 'post-c', label: 'C · Q&A stack-style', C: PostQA},
      ],
    },
    {
      id: 'courses',
      title: '05 · Catálogo de cursos',
      subtitle: 'Como cursos se integram com a comunidade — não viram silo.',
      boards: [
        {id: 'courses-a', label: 'A · Grid de cards', C: CoursesGrid},
        {id: 'courses-b', label: 'B · Estante por intenção', C: CoursesShelf},
        {id: 'courses-c', label: 'C · Lista densa', C: CoursesList},
      ],
    },
    {
      id: 'player',
      title: '06 · Player de lição',
      subtitle: 'Onde a gente aprende. Foco vs ferramentas vs anotações.',
      boards: [
        {id: 'player-a', label: 'A · Clássico (tree + player + chat)', C: PlayerClassic},
        {id: 'player-b', label: 'B · Modo foco / dark', C: PlayerFocus},
        {id: 'player-c', label: 'C · Split com notas-timestamp', C: PlayerSplit},
      ],
    },
    {
      id: 'leader',
      title: '07 · Leaderboard / Gamificação',
      subtitle: 'O coração ousado. Três tratamentos pra pontos + níveis.',
      boards: [
        {id: 'leader-a', label: 'A · Pódio + tabela', C: LeaderClassic},
        {id: 'leader-b', label: 'B · Arena · tiers verticais', C: LeaderArena},
        {id: 'leader-c', label: 'C · Cards MVP da semana', C: LeaderCards},
      ],
    },
    {
      id: 'profile',
      title: '08 · Perfil de membro',
      subtitle: 'A identidade. Currículo, trading-card, ou jornada.',
      boards: [
        {id: 'profile-a', label: 'A · Clássico + heatmap', C: ProfileClassic},
        {id: 'profile-b', label: 'B · Trading-card', C: ProfileCard},
        {id: 'profile-c', label: 'C · Passaporte / carimbos', C: ProfilePassport},
      ],
    },
    {
      id: 'events',
      title: '09 · Eventos',
      subtitle: 'Lives, AMAs, workshops. Calendário ou tiles.',
      boards: [
        {id: 'events-a', label: 'A · Calendário + lista', C: EventsCalendar},
        {id: 'events-b', label: 'B · Tiles com "ao vivo" ticker', C: EventsTiles},
      ],
    },
    {
      id: 'pricing',
      title: '10 · Pricing / Checkout',
      subtitle: 'Quando o usuário precisa decidir pagar.',
      boards: [
        {id: 'pricing-a', label: 'A · 3 tiers clássico', C: PricingTiers},
        {id: 'pricing-b', label: 'B · Builder · pague o que usa', C: PricingBuilder},
      ],
    },
    {
      id: 'notif',
      title: '11 · Notificações',
      subtitle: 'Caixa de entrada vs resumo diário.',
      boards: [
        {id: 'notif-a', label: 'A · Inbox por categoria', C: NotifInbox},
        {id: 'notif-b', label: 'B · Digest do dia', C: NotifDigest},
      ],
    },
    {
      id: 'onb',
      title: '12 · Onboarding (criar comunidade)',
      subtitle: 'Stepper formal vs conversa.',
      boards: [
        {id: 'onb-a', label: 'A · Stepper com preview ao vivo', C: OnbStepper},
        {id: 'onb-b', label: 'B · Conversa com templates', C: OnbConversational},
      ],
    },
  ];

  return (
    <React.Fragment>
      <DesignCanvas>
        {sections.map(s => (
          <DCSection key={s.id} id={s.id} title={s.title} subtitle={s.subtitle}>
            {s.boards.map(b => (
              <DCArtboard key={b.id} id={b.id} label={b.label} width={W} height={H}>
                <b.C />
              </DCArtboard>
            ))}
          </DCSection>
        ))}
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Apresentação">
          <TweakToggle label="Anotações & callouts" value={t.showAnnotations} onChange={(v) => setTweak('showAnnotations', v)} />
        </TweakSection>
        <TweakSection title="Acento">
          <TweakColor
            label="Cor de destaque"
            value={t.accent}
            options={['#ff5a1f', '#ff3b78', '#ffd23a', '#2c63ff', '#3d8b3d', '#9b5fff']}
            onChange={(v) => setTweak('accent', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
