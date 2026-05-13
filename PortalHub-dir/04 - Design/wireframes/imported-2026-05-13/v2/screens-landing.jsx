// Landing / Marketing wireframes — 3 variations

const LandingClassic = () => (
  <Frame>
    <Chrome url="portalhub.app — onde times constroem comunidade" />
    {/* Top nav */}
    <div style={{display: 'flex', alignItems: 'center', padding: '16px 36px', borderBottom: '1.5px dashed var(--line-soft)'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
        <div style={{width: 30, height: 30, borderRadius: 7, background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 22, fontWeight: 700, border: '1.5px solid var(--ink)'}}>P</div>
        <Hand size={22}>PortalHub</Hand>
      </div>
      <div style={{flex: 1}} />
      <div style={{display: 'flex', gap: 22, marginRight: 28}}>
        {['Por quê', 'Produto', 'Preços', 'Histórias', 'Docs'].map(l => <span key={l} style={{fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)'}}>{l}</span>)}
      </div>
      <Btn ghost sm style={{marginRight: 8}}>Entrar</Btn>
      <Btn primary sm>Criar comunidade</Btn>
    </div>

    {/* Hero */}
    <div style={{padding: '46px 80px 32px', textAlign: 'center', position: 'relative'}}>
      <Pill yellow style={{marginBottom: 18}}>Plataforma de aprendizagem corporativa</Pill>
      <div style={{fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 60, lineHeight: 1.02, color: 'var(--ink)', fontWeight: 500, letterSpacing: '-0.025em'}}>
        Pipeline e treinamento <span className="wf-underline">no mesmo lugar</span>,<br/>
        para times comerciais B2B.
      </div>
      <div style={{maxWidth: 540, margin: '22px auto 0', fontSize: 15.5, color: 'var(--ink-mid)', lineHeight: 1.6}}>
        Comunidade executiva, cursos certificados, mentorias e eventos — em uma plataforma única, projetada para líderes de vendas, RevOps e fundadores B2B.
      </div>
      <div style={{display: 'flex', gap: 10, justifyContent: 'center', marginTop: 26}}>
        <Btn primary>Solicitar acesso</Btn>
        <Btn>Agendar demo (15 min)</Btn>
      </div>
      <Callout x={760} y={150} w={150} label="governança por grupo & SSO" />
      <Callout x={110} y={220} w={150} label="certificações em PDF" dir="right" />
    </div>

    {/* Product preview placeholder */}
    <div style={{padding: '0 60px'}}>
      <Ph w="100%" h={210} img label="// preview do produto — feed + curso lado a lado //" style={{borderRadius: '10px 8px 12px 7px'}} />
    </div>

    {/* Trust row */}
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 80px', marginTop: 18}}>
      <Mono style={{color: 'var(--ink-mid)'}}>EM USO EM TIMES COMERCIAIS DE:</Mono>
      <div style={{display: 'flex', gap: 22, opacity: 0.6}}>
        {['acme.', 'orbital', 'NORTH', 'pivot', 'fern&fig', 'kraken'].map(l => (
          <Hand key={l} size={18} style={{color: 'var(--ink-mid)'}}>{l}</Hand>
        ))}
      </div>
    </div>
  </Frame>
);

const LandingProductFirst = () => (
  <Frame>
    <Chrome url="portalhub.app" />
    <div style={{display: 'flex', alignItems: 'center', padding: '14px 28px', borderBottom: '1.5px solid var(--line)'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
        <div style={{width: 26, height: 26, borderRadius: 6, background: 'var(--accent)', border: '1.5px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 18, fontWeight: 700}}>P</div>
        <Hand size={19}>PortalHub</Hand>
      </div>
      <div style={{flex: 1}} />
      <Btn primary sm>Entrar →</Btn>
    </div>

    <div style={{display: 'grid', gridTemplateColumns: '380px 1fr', gap: 0, height: 'calc(100% - 75px)'}}>
      {/* Left: pitch */}
      <div style={{padding: '36px 30px', borderRight: '1.5px dashed var(--line-soft)'}}>
        <Mono style={{color: 'var(--ink-mid)'}}>// PORTALHUB · ENTERPRISE</Mono>
        <div style={{fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 44, lineHeight: 1.05, marginTop: 14, fontWeight: 500, letterSpacing: '-0.02em'}}>
          Sua rede comercial, <span className="wf-underline-soft">tratada como pipeline</span>.
        </div>
        <div style={{fontSize: 14, color: 'var(--ink-mid)', lineHeight: 1.6, marginTop: 18}}>
          Feed executivo, cursos certificados, eventos por convite e mentoria — num produto pensado pra <em>times comerciais B2B</em>, não comunidades de hobby.
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24}}>
          <Btn primary>Criar minha comunidade — grátis</Btn>
          <Btn>Falar com vendas</Btn>
        </div>

        <div style={{marginTop: 28, paddingTop: 22, borderTop: '1.5px dashed var(--line-soft)'}}>
          <Mono style={{color: 'var(--ink-mid)'}}>// O QUE VOCÊ GANHA</Mono>
          <div style={{display: 'grid', gap: 8, marginTop: 12}}>
            {[
              ['Feed', 'categorias, RLS, reactions'],
              ['Cursos', 'módulos, vídeo, progresso'],
              ['Gamificação', 'pontos, níveis, badges'],
              ['Pagamento', 'Stripe nativo, billing portal'],
            ].map(([k, v]) => (
              <div key={k} style={{display: 'flex', gap: 10, fontSize: 13}}>
                <span style={{width: 14, height: 14, marginTop: 2, border: '1.5px solid var(--ink)', borderRadius: 3, background: 'var(--accent-2)', flex: '0 0 auto'}} />
                <div>
                  <b>{k}.</b> <span style={{color: 'var(--ink-mid)'}}>{v}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: product mockup as hero */}
      <div style={{padding: 24, background: 'var(--paper-2)', position: 'relative'}}>
        <Mono style={{color: 'var(--ink-mid)'}}>// LIVE NO PORTALHUB AGORA · polaris/exec-circle</Mono>
        <div style={{display: 'grid', gridTemplateColumns: '140px 1fr 160px', gap: 12, marginTop: 12, height: 'calc(100% - 32px)'}}>
          {/* mini sidebar */}
          <Box style={{padding: 10, display: 'flex', flexDirection: 'column', gap: 6}}>
            <Mono>NAV</Mono>
            <Nav on>Feed</Nav>
            <Nav>Cursos</Nav>
            <Nav>Eventos</Nav>
            <Nav>Membros</Nav>
            <Nav>Rank</Nav>
          </Box>
          {/* mini feed */}
          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            {[
              ['MR', 'Maria · VP Sales', 'lancei o novo playbook de discovery, feedback?', '12 ↑   8 resp.'],
              ['JS', 'João · Head of GTM', 'PRs do roadmap revisadas — comentem na seção 4', '4 ↑   2 resp.'],
              ['DK', 'Davi · CEO', 'live de roadmap agora · entrem!', '21 ↑   live'],
            ].map(([i, n, t, m], idx) => (
              <Box key={idx} style={{padding: 10, display: 'flex', gap: 10}}>
                <Av sm>{i}</Av>
                <div style={{flex: 1, fontSize: 12}}>
                  <div style={{fontWeight: 600}}>{n}</div>
                  <div style={{color: 'var(--ink-mid)', marginTop: 2}}>{t}</div>
                  <Mono style={{marginTop: 6, color: 'var(--ink-low)'}}>{m}</Mono>
                </div>
              </Box>
            ))}
          </div>
          {/* mini rank */}
          <Box style={{padding: 10}}>
            <Mono>RANK</Mono>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8}}>
              {[['1', 'Maria', '2.1k'], ['2', 'João', '1.8k'], ['3', 'Davi', '1.4k'], ['4', 'Bia', '1.1k']].map(([p, n, pts]) => (
                <div key={p} style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 12}}>
                  <Hand size={16} color="var(--accent)">{p}</Hand>
                  <span style={{flex: 1}}>{n}</span>
                  <Mono>{pts}</Mono>
                </div>
              ))}
            </div>
          </Box>
        </div>
        <Callout x={-30} y={20} w={120} label="produto real, não foto" rotate={-4} dir="right" />
      </div>
    </div>
  </Frame>
);

const LandingEditorial = () => (
  <Frame>
    <div style={{display: 'flex', alignItems: 'center', padding: '14px 28px', borderBottom: '1.5px solid var(--ink)'}}>
      <Hand size={26} style={{flex: 1}}>PortalHub<span style={{color: 'var(--accent)'}}>.</span></Hand>
      <Mono style={{color: 'var(--ink-mid)'}}>EDIÇÃO N° 014 · MAIO 2026</Mono>
      <div style={{flex: 1, textAlign: 'right'}}>
        <Btn sm style={{marginLeft: 8}}>Entrar</Btn>
        <Btn primary sm style={{marginLeft: 6}}>Assinar →</Btn>
      </div>
    </div>

    {/* Editorial hero */}
    <div style={{padding: '36px 60px 22px', borderBottom: '1.5px solid var(--ink)'}}>
      <Mono style={{color: 'var(--ink-mid)'}}>MANIFESTO · 04 MIN DE LEITURA</Mono>
      <div style={{fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 70, lineHeight: 0.98, fontWeight: 500, marginTop: 10, letterSpacing: '-0.03em'}}>
        Comunidades B2B<br/>
        não são <span className="wf-underline-soft">canais de chat</span>.<br/>
        São <span style={{color: 'var(--gold-dk)', fontStyle: 'italic'}}>motores de pipeline.</span>
      </div>
      <div style={{display: 'flex', gap: 36, marginTop: 26}}>
        <div style={{flex: 1, fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.65, columnCount: 2, columnGap: 30}}>
          PortalHub reúne comunidade executiva, cursos certificados, eventos por convite e mentoria — num produto desenhado pra times comerciais B2B. Cada membro tem perfil, progresso, certificações e indicações rastreáveis. Você ensina; nós entregamos governança, SSO, billing, audit log e SLA.
        </div>
        <div style={{flex: '0 0 220px'}}>
          <Mono style={{color: 'var(--ink-mid)'}}>NESTA EDIÇÃO</Mono>
          <div style={{marginTop: 10, display: 'grid', gap: 7, fontSize: 13}}>
            <div>01 · O que é PortalHub</div>
            <div>02 · Créditos x ranking comercial</div>
            <div>03 · Casos de times de vendas</div>
            <div>04 · Modelo de cobrança</div>
            <div>05 · Implantação em 14 dias</div>
          </div>
          <Btn primary sm style={{marginTop: 16}}>Solicitar acesso →</Btn>
        </div>
      </div>
    </div>

    {/* Footer strip: features as headlines */}
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: 0}}>
      {[
        ['Feed', 'organizado por contexto comercial'],
        ['Cursos', 'com certificação rastreável'],
        ['Créditos', 'que sinalizam senioridade'],
        ['Eventos', 'por convite, com RSVP e replay'],
      ].map(([h, s], i) => (
        <div key={i} style={{padding: '22px 24px', borderRight: i < 3 ? '1.5px solid var(--ink)' : 'none'}}>
          <Mono style={{color: 'var(--ink-mid)'}}>0{i+1}</Mono>
          <Hand size={26} style={{display: 'block', marginTop: 4}}>{h}</Hand>
          <div style={{fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 6, lineHeight: 1.5}}>{s}</div>
        </div>
      ))}
    </div>
  </Frame>
);

Object.assign(window, {LandingClassic, LandingProductFirst, LandingEditorial});
