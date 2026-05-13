// Pricing / Checkout — 2 variations

const PricingTiers = () => (
  <Frame>
    <Chrome url="portalhub.app/pricing" />
    <div style={{padding: '36px 60px', height: 'calc(100% - 40px)', overflow: 'hidden'}}>
      <div style={{textAlign: 'center'}}>
        <Pill yellow>preços honestos · sem trial enganador</Pill>
        <Hand size={56} style={{display: 'block', marginTop: 14, lineHeight: 1}}>
          Comece <span className="wf-underline">grátis</span>.<br/>
          Pague quando crescer.
        </Hand>
        <div style={{display: 'inline-flex', gap: 4, marginTop: 20, padding: 4, border: '1.5px solid var(--ink)', borderRadius: 99}}>
          <Pill ghost>Mensal</Pill>
          <Pill accent>Anual · -20%</Pill>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 32}}>
        {[
          {n: 'Free', d: 'pra testar o terreno', p: 'R$ 0', sub: '/mês', cta: 'Começar agora', feats: ['até 100 membros', 'feed + cursos básicos', 'gamificação leve', 'comunidade pública'], primary: false},
          {n: 'Pro', d: 'pra times que ensinam', p: 'R$ 79', sub: '/mês · anual', cta: 'Assinar Pro →', feats: ['membros ilimitados', 'cursos com módulos', 'Stripe billing portal', 'gamificação full', 'eventos com RSVP', 'analytics'], primary: true, badge: 'mais popular'},
          {n: 'Studio', d: 'pra criadores sérios', p: 'R$ 199', sub: '/mês · anual', cta: 'Falar com vendas', feats: ['tudo do Pro', 'white-label', 'API + webhooks', 'multi-tenancy', 'SLA + suporte', 'sem branding PortalHub'], primary: false},
        ].map((t, i) => (
          <Box key={i} style={{padding: 22, borderColor: t.primary ? 'var(--accent)' : 'var(--ink)', borderWidth: t.primary ? 2.5 : 1.5, position: 'relative', background: t.primary ? '#fff7ee' : 'var(--paper)'}}>
            {t.badge && <Pill yellow style={{position: 'absolute', top: -14, right: 20, fontSize: 11}}>🏆 {t.badge}</Pill>}
            <Hand size={32}>{t.n}</Hand>
            <Mono style={{color: 'var(--ink-mid)'}}>{t.d}</Mono>
            <div style={{marginTop: 18, display: 'flex', alignItems: 'baseline', gap: 4}}>
              <Hand size={56} style={{lineHeight: 1}}>{t.p}</Hand>
              <Mono style={{color: 'var(--ink-mid)'}}>{t.sub}</Mono>
            </div>
            <Btn primary={t.primary} style={{width: '100%', marginTop: 18}}>{t.cta}</Btn>
            <div style={{marginTop: 22, display: 'flex', flexDirection: 'column', gap: 8}}>
              {t.feats.map((f, j) => (
                <div key={j} style={{display: 'flex', gap: 8, fontSize: 13}}>
                  <span style={{color: 'var(--accent)', flex: '0 0 auto', fontFamily: 'Caveat', fontSize: 18, lineHeight: 1, marginTop: -1}}>✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </Box>
        ))}
      </div>
      <Callout x={870} y={70} w={140} label="mais popular · destaca, não engana" rotate={4} />
    </div>
  </Frame>
);

const PricingBuilder = () => (
  <Frame>
    <Chrome url="portalhub.app/pricing/build" />
    <div style={{padding: '24px 60px', height: 'calc(100% - 40px)', overflow: 'hidden'}}>
      <div style={{textAlign: 'center'}}>
        <Hand size={48}>Monta seu plano</Hand>
        <Mono style={{color: 'var(--ink-mid)'}}>só paga pelo que vai usar</Mono>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, marginTop: 24}}>
        {/* Builder */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
          <Box style={{padding: 16}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <Hand size={22}>Membros</Hand>
              <div style={{flex: 1}} />
              <Mono>1.000</Mono>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 12}}>
              <Mono style={{color: 'var(--ink-mid)'}}>50</Mono>
              <div style={{flex: 1, height: 8, background: 'var(--paper-2)', border: '1.5px solid var(--ink)', borderRadius: 99, position: 'relative'}}>
                <div style={{position: 'absolute', left: 0, top: -1, bottom: -1, width: '35%', background: 'var(--accent)', borderRadius: 99}} />
                <div style={{position: 'absolute', left: '35%', top: -6, width: 20, height: 20, borderRadius: '50%', background: 'var(--accent)', border: '1.5px solid var(--ink)', transform: 'translateX(-10px)'}} />
              </div>
              <Mono style={{color: 'var(--ink-mid)'}}>10k</Mono>
            </div>
            <Mono style={{color: 'var(--ink-mid)', marginTop: 6, display: 'block'}}>R$ 0.04 / membro / mês acima de 100</Mono>
          </Box>

          <Box style={{padding: 16}}>
            <Hand size={22}>Módulos · escolha o que precisa</Hand>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12}}>
              {[
                {n: 'Feed', d: 'posts, comments, reactions', price: 0, on: true, locked: true},
                {n: 'Cursos', d: 'módulos, vídeo, progresso', price: 29, on: true},
                {n: 'Gamificação', d: 'pontos, níveis, badges', price: 0, on: true, locked: true},
                {n: 'Eventos', d: 'RSVP, lembretes', price: 12, on: true},
                {n: 'Pagamento de membros', d: 'Stripe checkout', price: '3%', on: false},
                {n: 'API + Webhooks', d: 'integração externa', price: 49, on: false},
                {n: 'White-label', d: 'sem branding', price: 99, on: false},
              ].map((m, i) => (
                <div key={i} style={{padding: 10, border: '1.5px solid var(--ink)', borderRadius: 6, background: m.on ? '#fff7ee' : 'var(--paper)', display: 'flex', alignItems: 'center', gap: 10}}>
                  <span style={{width: 18, height: 18, borderRadius: 4, border: '1.5px solid var(--ink)', background: m.on ? 'var(--accent)' : 'var(--paper)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flex: '0 0 auto'}}>{m.on && '✓'}</span>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{fontSize: 12.5, fontWeight: 600}}>{m.n}{m.locked && <Mono style={{color: 'var(--ink-mid)', marginLeft: 4}}>incl.</Mono>}</div>
                    <Mono style={{color: 'var(--ink-mid)'}}>{m.d}</Mono>
                  </div>
                  <Mono>{m.price === 0 ? '—' : typeof m.price === 'string' ? m.price : `+R$${m.price}`}</Mono>
                </div>
              ))}
            </div>
          </Box>
        </div>

        {/* Summary */}
        <div>
          <Box style={{padding: 18, background: '#fff7ee', borderColor: 'var(--ink)'}}>
            <Mono style={{color: 'var(--ink-mid)'}}>SEU PLANO</Mono>
            <Hand size={60} style={{display: 'block', marginTop: 8, lineHeight: 0.95}}>R$ 77<Mono style={{fontSize: 14, color: 'var(--ink-mid)'}}>/mês</Mono></Hand>
            <Mono style={{color: 'var(--ink-mid)'}}>economiza R$ 184/mês vs. Pro fixo</Mono>

            <div style={{marginTop: 18, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13}}>
              <div style={{display: 'flex'}}><span style={{flex: 1}}>1.000 membros</span><Mono>R$ 36</Mono></div>
              <div style={{display: 'flex'}}><span style={{flex: 1}}>Cursos</span><Mono>R$ 29</Mono></div>
              <div style={{display: 'flex'}}><span style={{flex: 1}}>Eventos</span><Mono>R$ 12</Mono></div>
              <div style={{display: 'flex', paddingTop: 6, borderTop: '1.5px dashed var(--line-soft)', marginTop: 4}}><b style={{flex: 1}}>Total mensal</b><Mono>R$ 77</Mono></div>
            </div>

            <Btn primary style={{width: '100%', marginTop: 18}}>Começar com este plano →</Btn>
            <Mono style={{color: 'var(--ink-mid)', display: 'block', textAlign: 'center', marginTop: 8}}>cancela quando quiser · primeiros 30d grátis</Mono>
          </Box>
          <Callout x={-20} y={210} w={140} label="você vê o preço mudando" rotate={-3} dir="right" />
        </div>
      </div>
    </div>
  </Frame>
);

Object.assign(window, {PricingTiers, PricingBuilder});
