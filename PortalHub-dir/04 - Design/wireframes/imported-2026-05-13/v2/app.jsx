// PortalHub Premium — assembles wireframes into a Design Canvas.

const W = 1180;
const H = 720;

const DEFAULT_TWEAKS = /*EDITMODE-BEGIN*/{
  "showAnnotations": true,
  "accent": "#b08a3e"
}/*EDITMODE-END*/;

const App = () => {
  const [t, setTweak] = useTweaks(DEFAULT_TWEAKS);

  React.useEffect(() => {
    const style = document.getElementById('wf-tweaks-style') || (() => {
      const s = document.createElement('style');
      s.id = 'wf-tweaks-style';
      document.head.appendChild(s);
      return s;
    })();
    // The accent tweak swaps the gold accent. Pick a darker companion automatically.
    // We just override the gold tokens; navy stays fixed for CTAs.
    style.textContent = `
      .wf { --gold: ${t.accent} !important; --gold-dk: ${t.accent} !important; }
      ${t.showAnnotations ? '' : '.wf-note, [data-callout] { display: none !important; }'}
    `;
  }, [t.accent, t.showAnnotations]);

  const sections = [
    {
      id: 'landing',
      title: '01 · Landing / Marketing',
      subtitle: 'Posicionamento institucional. Pitch para líderes de vendas e fundadores.',
      boards: [
        {id: 'landing-a', label: 'A · Hero clássico', C: LandingClassic},
        {id: 'landing-b', label: 'B · Produto como herói', C: LandingProductFirst},
        {id: 'landing-c', label: 'C · Editorial / manifesto', C: LandingEditorial},
      ],
    },
    {
      id: 'auth',
      title: '02 · Acesso',
      subtitle: 'Onboarding limpo, sem fricção. Tom de "back to work".',
      boards: [
        {id: 'auth-a', label: 'A · Login centrado', C: LoginCentered},
        {id: 'auth-b', label: 'B · Login com resumo do que aconteceu', C: LoginSplit},
        {id: 'auth-c', label: 'C · Signup progressivo', C: SignupProgressive},
      ],
    },
    {
      id: 'feed',
      title: '03 · Feed da comunidade',
      subtitle: 'Onde times comerciais discutem cases, dúvidas e estratégia. Três modelos de organização.',
      boards: [
        {id: 'feed-a', label: 'A · 3 colunas com categorias', C: FeedClassic},
        {id: 'feed-b', label: 'B · Stream por contexto', C: FeedStream},
        {id: 'feed-c', label: 'C · Timeline cronológica', C: FeedTimeline},
      ],
    },
    {
      id: 'post',
      title: '04 · Post · detalhe',
      subtitle: 'Discussão de um case ou Q&A. Tom denso, profundidade > velocidade.',
      boards: [
        {id: 'post-a', label: 'A · Thread tradicional', C: PostThreaded},
        {id: 'post-b', label: 'B · Documento + comentários na margem', C: PostDocMargin},
        {id: 'post-c', label: 'C · Q&A estruturado', C: PostQA},
      ],
    },
    {
      id: 'courses',
      title: '05 · Cursos & Certificação',
      subtitle: 'Catálogo de treinamento corporativo, com trilhas e certificação rastreável.',
      boards: [
        {id: 'courses-a', label: 'A · Grade de cursos', C: CoursesGrid},
        {id: 'courses-b', label: 'B · Trilhas por momento', C: CoursesShelf},
        {id: 'courses-c', label: 'C · Tabela densa (executiva)', C: CoursesList},
      ],
    },
    {
      id: 'player',
      title: '06 · Player de lição',
      subtitle: 'Aprendizado em foco. Anotações por timestamp, transcrição, discussão.',
      boards: [
        {id: 'player-a', label: 'A · Clássico (sidebar + player + anotações)', C: PlayerClassic},
        {id: 'player-b', label: 'B · Modo foco / dark', C: PlayerFocus},
        {id: 'player-c', label: 'C · Split com notas-timestamp', C: PlayerSplit},
      ],
    },
    {
      id: 'leader',
      title: '07 · Ranking & Certificação',
      subtitle: 'Gamificação contida, posicionada como performance e senioridade — não Duolingo.',
      boards: [
        {id: 'leader-a', label: 'A · Pódio + tabela', C: LeaderClassic},
        {id: 'leader-b', label: 'B · Tiers de senioridade', C: LeaderArena},
        {id: 'leader-c', label: 'C · Cards: top performers do mês', C: LeaderCards},
      ],
    },
    {
      id: 'profile',
      title: '08 · Perfil de membro',
      subtitle: 'CV interno: senioridade, certificações, áreas de domínio, indicações.',
      boards: [
        {id: 'profile-a', label: 'A · Clássico + heatmap de atividade', C: ProfileClassic},
        {id: 'profile-b', label: 'B · "Career card" executivo', C: ProfileCard},
        {id: 'profile-c', label: 'C · Trajetória / marcos profissionais', C: ProfilePassport},
      ],
    },
    {
      id: 'events',
      title: '09 · Eventos · Lives, AMAs, Workshops',
      subtitle: 'Programação executiva: lives de roadmap, mesas, workshops invite-only.',
      boards: [
        {id: 'events-a', label: 'A · Calendário + agenda', C: EventsCalendar},
        {id: 'events-b', label: 'B · Tiles com indicador "ao vivo"', C: EventsTiles},
      ],
    },
    {
      id: 'pricing',
      title: '10 · Pricing',
      subtitle: 'Tiers institucionais ou builder por módulo. Sem trial enganador.',
      boards: [
        {id: 'pricing-a', label: 'A · Starter / Pro / Enterprise', C: PricingTiers},
        {id: 'pricing-b', label: 'B · Builder modular', C: PricingBuilder},
      ],
    },
    {
      id: 'notif',
      title: '11 · Notificações',
      subtitle: 'Caixa por tipo vs resumo diário pra líderes ocupados.',
      boards: [
        {id: 'notif-a', label: 'A · Inbox por categoria', C: NotifInbox},
        {id: 'notif-b', label: 'B · Digest executivo do dia', C: NotifDigest},
      ],
    },
    {
      id: 'onb',
      title: '12 · Onboarding (criar comunidade)',
      subtitle: 'Stepper formal ou conversa guiada. Templates por vertical.',
      boards: [
        {id: 'onb-a', label: 'A · Stepper com preview', C: OnbStepper},
        {id: 'onb-b', label: 'B · Conversa guiada', C: OnbConversational},
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
        <TweakSection title="Acento metálico">
          <TweakColor
            label="Cor de destaque"
            value={t.accent}
            options={['#b08a3e', '#8a6c2c', '#9b7a3f', '#5a4a2a', '#3a4452', '#1a3a5f']}
            onChange={(v) => setTweak('accent', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
