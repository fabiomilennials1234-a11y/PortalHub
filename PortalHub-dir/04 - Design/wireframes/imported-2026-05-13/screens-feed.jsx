// Feed da comunidade — 3 variations

const FeedClassic = () => (
  <Frame>
    <AppBar org="acme/dev-circle" tab={[{label: 'Feed', on: true}, {label: 'Cursos'}, {label: 'Eventos'}, {label: 'Membros'}, {label: 'Rank'}]} />
    <div style={{display: 'grid', gridTemplateColumns: '210px 1fr 280px', height: 'calc(100% - 60px)'}}>
      {/* Sidebar */}
      <div style={{padding: 16, borderRight: '1.5px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 14}}>
        <Btn primary style={{justifyContent: 'flex-start'}}>+ Novo post</Btn>
        <div>
          <Mono style={{color: 'var(--ink-mid)'}}>CATEGORIAS</Mono>
          <div style={{display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8}}>
            {[['Todos', 142, true], ['Anúncios', 8], ['Pergunta', 34], ['Showcase', 21], ['Off-topic', 47], ['Bugs', 12]].map(([n, c, on]) => (
              <div key={n} style={{display: 'flex', alignItems: 'center', padding: '5px 8px', borderRadius: 5, background: on ? 'var(--paper-2)' : 'transparent', fontSize: 13}}>
                <span style={{width: 8, height: 8, borderRadius: 99, background: on ? 'var(--accent)' : 'var(--ink-low)', marginRight: 8}} />
                <span style={{flex: 1, fontWeight: on ? 600 : 500}}>{n}</span>
                <Mono style={{color: 'var(--ink-mid)'}}>{c}</Mono>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Mono style={{color: 'var(--ink-mid)'}}>FILTROS</Mono>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8}}>
            {['Recente', 'Top semana', 'Sem resposta', 'Que sigo'].map((f, i) => (
              <Pill key={f} style={{fontSize: 11, padding: '3px 8px'}}>{i === 0 ? '↓' : '·'} {f}</Pill>
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div style={{padding: 16, overflow: 'hidden'}}>
        {/* Composer */}
        <Box style={{padding: 12, display: 'flex', gap: 10, marginBottom: 14}}>
          <Av>FM</Av>
          <div style={{flex: 1, padding: '8px 0', color: 'var(--ink-low)', fontSize: 14}}>Compartilhe algo com o time…</div>
          <Btn sm>📎</Btn>
          <Btn sm>🎙</Btn>
          <Btn sm primary>Postar</Btn>
        </Box>

        {/* Pinned */}
        <Box style={{padding: 12, marginBottom: 10, background: '#fff8e6', borderColor: 'var(--ink)'}}>
          <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
            <Pill yellow style={{fontSize: 11}}>📌 fixado</Pill>
            <Hand size={18}>Leiam antes de postar: as 4 regras da casa</Hand>
            <div style={{flex: 1}} />
            <Mono style={{color: 'var(--ink-mid)'}}>3d</Mono>
          </div>
        </Box>

        {/* Posts */}
        {[
          {a: 'MR', n: 'Maria Ribeiro', role: 'Eng · Lvl 12', cat: 'Pergunta', t: 'há 2h', title: 'Como vocês modelam multi-tenancy no Supabase?', body: 'Tô na dúvida entre coluna org_id em tudo vs schemas separados. Quem já passou pelos dois?', up: 34, comments: 12, react: ['🔥', '💯']},
          {a: 'JS', n: 'João Santos', role: 'Design · Lvl 8', cat: 'Showcase', t: 'há 5h', title: 'Refiz o player de vídeo do PortalHub — feedback?', body: 'Reduzi distrações no foco mode. Antes/depois nas imagens.', up: 51, comments: 23, react: ['🎨', '👀'], image: true},
          {a: 'DK', n: 'Davi Klein', role: 'PM · Lvl 15', cat: 'Anúncios', t: 'ontem', title: 'Sprint 4 — gamificação entrou em prod', body: 'Pontos, níveis e leaderboard. Quem chegar em LVL 5 essa semana ganha vaga na live.', up: 88, comments: 41, react: ['🚀']},
        ].map((p, i) => (
          <Box key={i} style={{padding: 14, marginBottom: 10}}>
            <div style={{display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8}}>
              <Av sm>{p.a}</Av>
              <div style={{flex: 1, fontSize: 12.5}}>
                <b>{p.n}</b> · <Mono style={{color: 'var(--ink-mid)'}}>{p.role}</Mono>
              </div>
              <Pill style={{fontSize: 10.5, padding: '2px 8px'}}>{p.cat}</Pill>
              <Mono style={{color: 'var(--ink-low)'}}>{p.t}</Mono>
            </div>
            <Hand size={20} style={{display: 'block'}}>{p.title}</Hand>
            <div style={{fontSize: 13, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.5}}>{p.body}</div>
            {p.image && <Ph w="100%" h={80} img label="// screenshots antes / depois //" style={{marginTop: 10}} />}
            <div style={{display: 'flex', gap: 14, alignItems: 'center', marginTop: 10, fontSize: 12.5, color: 'var(--ink-mid)'}}>
              <span>↑ {p.up}</span>
              <span>💬 {p.comments}</span>
              <span style={{display: 'flex', gap: 4}}>{p.react.map(r => <span key={r} style={{padding: '1px 6px', border: '1px solid var(--line-soft)', borderRadius: 99, fontSize: 11}}>{r} 4</span>)}</span>
              <div style={{flex: 1}} />
              <Mono>+8 pts ao responder</Mono>
            </div>
          </Box>
        ))}
      </div>

      {/* Right rail */}
      <div style={{padding: 16, borderLeft: '1.5px dashed var(--line-soft)', display: 'flex', flexDirection: 'column', gap: 14}}>
        <Box style={{padding: 12, background: '#fff7ee', borderColor: 'var(--ink)'}}>
          <Mono>SEU PROGRESSO</Mono>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 8}}>
            <LvlBadge lvl={7} />
            <Mono style={{color: 'var(--ink-mid)'}}>1,240 pts</Mono>
          </div>
          <Bar pct={62} style={{marginTop: 8}} />
          <Mono style={{color: 'var(--ink-mid)', marginTop: 4, display: 'block'}}>240 pts pro nível 8</Mono>
        </Box>

        <div>
          <Mono style={{color: 'var(--ink-mid)'}}>EM ALTA HOJE</Mono>
          <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8}}>
            {['"Como vocês modelam multi-tenancy"', '"Refiz o player de vídeo"', '"Pricing — devo cobrar mensal?"'].map((t, i) => (
              <div key={i} style={{display: 'flex', gap: 8, fontSize: 12.5}}>
                <Hand size={18} color="var(--accent)">{i+1}</Hand>
                <span style={{color: 'var(--ink-soft)'}}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Mono style={{color: 'var(--ink-mid)'}}>EVENTOS · ESSA SEMANA</Mono>
          <div style={{display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8}}>
            <Box style={{padding: 8, fontSize: 12}}>
              <Mono>QUI · 19h</Mono>
              <div style={{fontWeight: 600, marginTop: 2}}>Live: Roadmap Q3</div>
              <Mono style={{color: 'var(--ink-mid)'}}>42 confirmados</Mono>
            </Box>
          </div>
        </div>
      </div>
    </div>
  </Frame>
);

const FeedStream = () => (
  <Frame>
    {/* Top bar: minimal */}
    <div style={{display: 'flex', alignItems: 'center', padding: '10px 18px', borderBottom: '1.5px solid var(--line)', gap: 12}}>
      <Hand size={20}>acme<span style={{color: 'var(--accent)'}}>/</span>dev-circle</Hand>
      <div style={{flex: 1}} />
      <Input placeholder="busca, ⌘K" style={{width: 340, padding: '5px 12px', fontSize: 12}} />
      <Pill yellow>⚡ 1,240</Pill>
      <Av sm>FM</Av>
    </div>

    {/* Mood chip row */}
    <div style={{display: 'flex', gap: 8, padding: '14px 24px', overflow: 'hidden', borderBottom: '1.5px dashed var(--line-soft)', alignItems: 'center'}}>
      <Mono style={{color: 'var(--ink-mid)'}}>O QUE TÁ ROLANDO:</Mono>
      {[
        ['🔥', 'Em alta', true],
        ['❓', 'Pergunta'],
        ['🎉', 'Wins'],
        ['🐛', 'Bugs'],
        ['📚', 'Cursos'],
        ['🎙', 'Lives'],
        ['🎨', 'Showcase'],
        ['💬', 'Off-topic'],
      ].map(([i, l, on]) => (
        <Pill key={l} accent={on}>{i} {l}</Pill>
      ))}
    </div>

    {/* Two-col stream */}
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, padding: 20, height: 'calc(100% - 130px)', overflow: 'hidden'}}>
      {/* Card 1: large showcase */}
      <Box rough style={{padding: 14, gridColumn: 'span 2'}}>
        <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
          <Av lg>JS</Av>
          <div style={{flex: 1}}>
            <Hand size={22}>João reviu o player de vídeo</Hand>
            <Mono style={{color: 'var(--ink-mid)'}}>Design · Lvl 8 · há 5h · 🎨 Showcase</Mono>
          </div>
          <LvlBadge lvl={8} />
        </div>
        <Ph w="100%" h={150} img label="// antes / depois — interação //" style={{marginTop: 12}} />
        <div style={{display: 'flex', gap: 12, marginTop: 10, alignItems: 'center'}}>
          <Pill style={{fontSize: 11}}>↑ 51</Pill>
          <Pill style={{fontSize: 11}}>💬 23</Pill>
          <Pill style={{fontSize: 11}}>🎨 14</Pill>
          <div style={{flex: 1}} />
          <Btn sm primary>Responder · +8 pts</Btn>
        </div>
      </Box>

      {[
        {a: 'MR', n: 'Maria', t: 'Como vocês modelam multi-tenancy?', cat: '❓ Pergunta', up: 34, c: 12},
        {a: 'DK', n: 'Davi', t: 'Sprint 4 entrou em prod 🚀', cat: '📣 Anúncio', up: 88, c: 41, pinned: true},
        {a: 'BL', n: 'Bia', t: 'Pricing: mensal x anual?', cat: '💬 Discussão', up: 22, c: 18},
        {a: 'TR', n: 'Tiago', t: 'Achei um bug no checkout', cat: '🐛 Bug', up: 6, c: 3},
      ].map((p, i) => (
        <Box key={i} style={{padding: 12}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <Av sm>{p.a}</Av>
            <b style={{fontSize: 12.5}}>{p.n}</b>
            <Mono style={{color: 'var(--ink-mid)'}}>{p.cat}</Mono>
            <div style={{flex: 1}} />
            {p.pinned && <Pill yellow style={{fontSize: 10}}>📌</Pill>}
          </div>
          <Hand size={19} style={{marginTop: 6, display: 'block'}}>{p.t}</Hand>
          <div style={{display: 'flex', gap: 10, marginTop: 8, fontSize: 12, color: 'var(--ink-mid)'}}>
            <span>↑ {p.up}</span>
            <span>💬 {p.c}</span>
          </div>
        </Box>
      ))}
    </div>
  </Frame>
);

const FeedTimeline = () => (
  <Frame>
    <AppBar />
    <div style={{display: 'grid', gridTemplateColumns: '64px 1fr 240px', height: 'calc(100% - 60px)'}}>
      {/* Icon-only sidebar */}
      <div style={{borderRight: '1.5px dashed var(--line-soft)', padding: '14px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
        {['🏠', '📚', '📅', '👥', '🏆', '⚙️'].map((i, idx) => (
          <div key={idx} style={{width: 38, height: 38, borderRadius: 8, background: idx === 0 ? 'var(--ink)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, border: idx === 0 ? '1.5px solid var(--ink)' : '1.5px solid transparent', color: idx === 0 ? 'var(--paper)' : 'var(--ink)'}}>{i}</div>
        ))}
      </div>

      {/* Timeline column */}
      <div style={{padding: '20px 30px', position: 'relative', overflow: 'hidden'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18}}>
          <Hand size={32}>Hoje, terça</Hand>
          <Mono style={{color: 'var(--ink-mid)'}}>· 12 maio · 23 novos</Mono>
          <div style={{flex: 1}} />
          <Btn primary sm>+ post</Btn>
        </div>

        {/* Vertical timeline rail */}
        <div style={{position: 'relative', paddingLeft: 30}}>
          <div style={{position: 'absolute', left: 8, top: 4, bottom: 4, width: 2, background: 'var(--line-soft)', borderRadius: 99}} />
          {[
            {t: '09:14', a: 'MR', body: 'Maria abriu uma pergunta em #pergunta', tag: 'multi-tenancy supabase', up: 34, c: 12, kind: 'post'},
            {t: '10:02', a: '⚡', body: 'Você ganhou 25 pts respondendo ao Carlos', kind: 'gam'},
            {t: '11:33', a: 'JS', body: 'João postou um showcase do novo player', kind: 'post', img: true},
            {t: '13:08', a: '📅', body: 'Live "Roadmap Q3" começa em 5h · 42 RSVPs', kind: 'event'},
            {t: '14:21', a: 'DK', body: 'Davi anunciou que Sprint 4 entrou em prod', kind: 'post'},
          ].map((e, i) => (
            <div key={i} style={{position: 'relative', marginBottom: 14}}>
              <div style={{position: 'absolute', left: -30, top: 2, width: 18, height: 18, borderRadius: '50%', background: e.kind === 'gam' ? 'var(--accent-2)' : e.kind === 'event' ? 'var(--accent-3)' : 'var(--paper)', border: '1.5px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9}}>{e.a.length <= 2 ? e.a : ''}</div>
              <Mono style={{color: 'var(--ink-mid)'}}>{e.t}</Mono>
              <Box style={{padding: 10, marginTop: 4}}>
                <div style={{fontSize: 13}}>{e.body}</div>
                {e.tag && <Hand size={18} style={{display: 'block', marginTop: 4}}>"{e.tag}"</Hand>}
                {e.img && <Ph w="100%" h={60} img label="// preview //" style={{marginTop: 8}} />}
                {(e.up !== undefined) && (
                  <div style={{display: 'flex', gap: 10, marginTop: 6, fontSize: 12, color: 'var(--ink-mid)'}}>
                    <span>↑ {e.up}</span><span>💬 {e.c}</span>
                  </div>
                )}
              </Box>
            </div>
          ))}
        </div>
        <Callout x={500} y={120} w={140} label="agrupado por tempo, não tipo" rotate={3} />
      </div>

      {/* Right rail: quick stats */}
      <div style={{padding: 16, borderLeft: '1.5px dashed var(--line-soft)', display: 'flex', flexDirection: 'column', gap: 12}}>
        <Mono style={{color: 'var(--ink-mid)'}}>VOCÊ · HOJE</Mono>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8}}>
          {[['+47', 'pontos'], ['3', 'respostas'], ['1', 'post'], ['2', 'reactions']].map(([n, l]) => (
            <Box key={l} style={{padding: 10, textAlign: 'center'}}>
              <Hand size={26} color="var(--accent)">{n}</Hand>
              <Mono style={{display: 'block', color: 'var(--ink-mid)'}}>{l}</Mono>
            </Box>
          ))}
        </div>
        <Mono style={{color: 'var(--ink-mid)', marginTop: 6}}>STREAK 🔥</Mono>
        <Box style={{padding: 10}}>
          <Hand size={28}>14 dias</Hand>
          <div style={{display: 'flex', gap: 3, marginTop: 6}}>
            {Array.from({length: 14}).map((_, i) => (
              <span key={i} style={{width: 12, height: 12, borderRadius: 3, background: i < 14 ? 'var(--accent)' : 'var(--line-faint)', border: '1px solid var(--ink)'}} />
            ))}
          </div>
        </Box>
      </div>
    </div>
  </Frame>
);

Object.assign(window, {FeedClassic, FeedStream, FeedTimeline});
