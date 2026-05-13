// Notificações — 2 variations

const NotifInbox = () => (
  <Frame>
    <AppBar />
    <div style={{padding: '24px 36px', height: 'calc(100% - 60px)', overflow: 'hidden'}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
        <Hand size={42}>Caixa</Hand>
        <Mono style={{color: 'var(--ink-mid)'}}>12 não lidas · 47 total</Mono>
        <div style={{flex: 1}} />
        <Btn sm>marcar tudo como lido</Btn>
        <Btn sm>preferências →</Btn>
      </div>

      <div style={{display: 'flex', gap: 6, marginTop: 14, alignItems: 'center', paddingBottom: 12, borderBottom: '1.5px solid var(--line)'}}>
        {[
          ['Tudo', 47, true],
          ['Respostas', 8],
          ['Menções', 3, false, true],
          ['Reações', 18],
          ['Cursos', 4],
          ['Sistema', 14],
        ].map(([l, n, on, dot]) => (
          <Pill key={l} accent={on}>
            {dot && <span style={{width: 6, height: 6, borderRadius: 99, background: 'var(--accent)', display: 'inline-block'}} />}
            {l} <Mono style={{color: on ? '#fff' : 'var(--ink-mid)', marginLeft: 4}}>{n}</Mono>
          </Pill>
        ))}
      </div>

      {/* Today */}
      <Mono style={{color: 'var(--ink-mid)', marginTop: 14, display: 'block'}}>HOJE</Mono>
      <div style={{display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8}}>
        {[
          {a: 'MR', t: 'Maria respondeu seu post', desc: '"+1 nessa abordagem. Já tentei e…"', tag: 'multi-tenancy', w: '14min', unread: true},
          {a: 'DK', t: 'Davi mencionou você', desc: '"@fabio chequei sua PR — comentei lá"', w: '2h', unread: true, mention: true},
          {a: '⚡', t: 'Você ganhou um badge!', desc: '🔥 Streak de 14 dias seguidos', w: '4h', unread: true, gam: true},
          {a: '📅', t: 'Live "Roadmap Q3" começa em 1h', desc: 'Você tem RSVP · 42 confirmados', w: '5h', unread: true, event: true},
          {a: '🎓', t: 'Próxima lição liberada', desc: '"Forms e composição" · Design Systems · M3', w: '6h'},
          {a: 'BL', t: 'Bia reagiu ao seu post', desc: '💯 em "RLS em prod"', w: '7h'},
        ].map((n, i) => (
          <Box key={i} style={{
            padding: 12, display: 'flex', gap: 12, alignItems: 'center',
            background: n.unread ? '#fff7ee' : 'var(--paper)',
            borderColor: n.unread ? 'var(--ink)' : 'var(--line-soft)',
            borderLeftWidth: n.unread ? 4 : 1.5,
          }}>
            <Av sm style={{background: n.gam ? 'var(--accent-2)' : n.event ? 'var(--accent-3)' : n.mention ? 'var(--accent)' : 'var(--paper-2)', color: n.event || n.mention ? '#fff' : 'var(--ink)'}}>{n.a}</Av>
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{fontSize: 13, fontWeight: n.unread ? 600 : 500}}>{n.t}{n.tag && <Mono style={{color: 'var(--ink-mid)', marginLeft: 6}}>· #{n.tag}</Mono>}</div>
              <div style={{fontSize: 12, color: 'var(--ink-mid)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{n.desc}</div>
            </div>
            <Mono style={{color: 'var(--ink-mid)'}}>{n.w}</Mono>
            {n.unread && <span style={{width: 8, height: 8, borderRadius: 99, background: 'var(--accent)'}} />}
          </Box>
        ))}
      </div>

      <Mono style={{color: 'var(--ink-mid)', marginTop: 22, display: 'block'}}>ONTEM</Mono>
      <Box style={{padding: 12, marginTop: 8, display: 'flex', gap: 12, alignItems: 'center'}}>
        <Av sm>JS</Av>
        <div style={{flex: 1}}>
          <div style={{fontSize: 13}}>João seguiu você</div>
          <Mono style={{color: 'var(--ink-mid)'}}>· Design · Lvl 8</Mono>
        </div>
        <Btn sm>seguir de volta</Btn>
      </Box>
    </div>
  </Frame>
);

const NotifDigest = () => (
  <Frame>
    <AppBar />
    <div style={{padding: '24px 60px', height: 'calc(100% - 60px)', overflow: 'hidden'}}>
      <Hand size={44}>Seu resumo de hoje</Hand>
      <Mono style={{color: 'var(--ink-mid)'}}>12 maio · quinta · 14 eventos relevantes</Mono>

      {/* Hero stat row */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 18}}>
        {[
          {n: '+47', l: 'pts ganhos', accent: true},
          {n: '4', l: 'respostas pra ver'},
          {n: '1', l: 'live em 1h'},
          {n: '🔥 14', l: 'dias de streak'},
        ].map((s, i) => (
          <Box key={i} style={{padding: 12, textAlign: 'center', background: s.accent ? 'var(--accent)' : 'var(--paper)', color: s.accent ? '#fff' : 'var(--ink)'}}>
            <Hand size={36} style={{color: 'inherit', display: 'block'}}>{s.n}</Hand>
            <Mono style={{color: s.accent ? '#ffffffcc' : 'var(--ink-mid)'}}>{s.l}</Mono>
          </Box>
        ))}
      </div>

      {/* Grouped sections */}
      <div style={{marginTop: 26, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
        <Box style={{padding: 14}}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 8}}>
            <Hand size={22}>💬 Conversas</Hand>
            <Mono style={{color: 'var(--ink-mid)'}}>3 respostas em posts seus</Mono>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10}}>
            {[
              {a: 'MR', n: 'Maria', t: '"+1 nessa abordagem…"', on: '"multi-tenancy"'},
              {a: 'DK', n: 'Davi', t: '"@fabio chequei sua PR…"', on: 'menção em #eng'},
              {a: 'BL', n: 'Bia', t: '"Achei um caso parecido…"', on: '"RLS em prod"'},
            ].map((c, i) => (
              <div key={i} style={{display: 'flex', gap: 8, padding: '6px 0', borderBottom: '1px dashed var(--line-faint)', fontSize: 12.5}}>
                <Av sm>{c.a}</Av>
                <div style={{flex: 1, minWidth: 0}}>
                  <div><b>{c.n}</b> <span style={{color: 'var(--ink-mid)'}}>respondeu em</span> {c.on}</div>
                  <div style={{color: 'var(--ink-mid)', fontSize: 11.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{c.t}</div>
                </div>
              </div>
            ))}
          </div>
          <Btn sm style={{width: '100%', marginTop: 10}}>Ver todas →</Btn>
        </Box>

        <Box style={{padding: 14}}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 8}}>
            <Hand size={22}>⚡ Sua evolução</Hand>
            <Mono style={{color: 'var(--ink-mid)'}}>+47 pts hoje</Mono>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10, fontSize: 12.5}}>
            <div style={{display: 'flex'}}><span style={{flex: 1}}>💬 3 respostas marcadas como úteis</span><Mono style={{color: 'var(--accent)'}}>+24</Mono></div>
            <div style={{display: 'flex'}}><span style={{flex: 1}}>🎓 Concluiu lição "Forms"</span><Mono style={{color: 'var(--accent)'}}>+12</Mono></div>
            <div style={{display: 'flex'}}><span style={{flex: 1}}>📝 Postou em #pergunta</span><Mono style={{color: 'var(--accent)'}}>+8</Mono></div>
            <div style={{display: 'flex'}}><span style={{flex: 1}}>🔥 Streak +1 dia</span><Mono style={{color: 'var(--accent)'}}>+3</Mono></div>
          </div>
          <div style={{marginTop: 12, padding: 10, background: '#fff7ee', borderRadius: 6, border: '1.5px dashed var(--ink)'}}>
            <Mono style={{color: 'var(--ink-mid)'}}>FALTA</Mono>
            <Hand size={18}>240 pts pro nível 8 ✨</Hand>
          </div>
        </Box>

        <Box style={{padding: 14, gridColumn: 'span 2'}}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 8}}>
            <Hand size={22}>📅 Hoje + amanhã</Hand>
          </div>
          <div style={{display: 'flex', gap: 12, marginTop: 10}}>
            <Box style={{padding: 10, flex: 1, background: '#fff7ee'}}>
              <Mono style={{color: 'var(--accent)'}}>HOJE · 19h · em 1h12min</Mono>
              <Hand size={18} style={{display: 'block', marginTop: 2}}>Live: Roadmap Q3</Hand>
              <Mono style={{color: 'var(--ink-mid)'}}>RSVP confirmado · 42 vão</Mono>
            </Box>
            <Box style={{padding: 10, flex: 1}}>
              <Mono style={{color: 'var(--ink-mid)'}}>AMANHÃ · 14h</Mono>
              <Hand size={18} style={{display: 'block', marginTop: 2}}>AMA com Maria</Hand>
              <Btn sm style={{marginTop: 6}}>RSVP</Btn>
            </Box>
            <Box style={{padding: 10, flex: 1}}>
              <Mono style={{color: 'var(--ink-mid)'}}>SEX · 10h</Mono>
              <Hand size={18} style={{display: 'block', marginTop: 2}}>Workshop DS</Hand>
              <Mono style={{color: 'var(--ink-mid)'}}>💎 pro · 27/30</Mono>
            </Box>
          </div>
        </Box>
      </div>
      <Callout x={830} y={70} w={140} label="digest, não notificação spam" rotate={-3} />
    </div>
  </Frame>
);

Object.assign(window, {NotifInbox, NotifDigest});
