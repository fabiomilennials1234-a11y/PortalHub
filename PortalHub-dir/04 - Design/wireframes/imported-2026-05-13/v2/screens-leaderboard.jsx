// Leaderboard / Gamificação — 3 variations

const LeaderClassic = () => (
  <Frame>
    <AppBar tab={[{label: 'Feed'}, {label: 'Cursos'}, {label: 'Eventos'}, {label: 'Membros'}, {label: 'Rank', on: true}]} />
    <div style={{padding: '24px 36px', height: 'calc(100% - 60px)', overflow: 'hidden'}}>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 12}}>
        <Hand size={42}>Leaderboard</Hand>
        <Pill yellow>Essa semana</Pill>
        <Pill ghost>mês</Pill>
        <Pill ghost>todo</Pill>
        <div style={{flex: 1}} />
        <Pill>Todos · 247</Pill>
        <Pill ghost>Que sigo · 12</Pill>
      </div>

      {/* Podium */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 28, alignItems: 'end'}}>
        {[
          {p: 2, a: 'JS', n: 'João S.', pts: '1,820', h: 110, color: 'var(--paper-2)'},
          {p: 1, a: 'MR', n: 'Maria R.', pts: '2,140', h: 140, color: 'var(--accent)', crown: true},
          {p: 3, a: 'DK', n: 'Davi K.', pts: '1,420', h: 90, color: 'var(--accent-2)'},
        ].map(s => (
          <div key={s.p} style={{textAlign: 'center'}}>
            <div style={{position: 'relative', display: 'inline-block'}}>
              <Av xl style={{background: 'var(--paper)', border: '2.5px solid var(--ink)'}}>{s.a}</Av>
              {s.crown && <span style={{position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%) rotate(-6deg)', fontSize: 30}}>👑</span>}
            </div>
            <Hand size={22} style={{display: 'block', marginTop: 8}}>{s.n}</Hand>
            <Mono style={{color: 'var(--ink-mid)'}}>{s.pts} pts</Mono>
            <div style={{marginTop: 10, height: s.h, border: '1.5px solid var(--ink)', background: s.color, borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 44, fontWeight: 700, color: s.p === 1 ? '#fff' : 'var(--ink)'}}>{s.p}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <Mono style={{color: 'var(--ink-mid)', marginTop: 28, display: 'block'}}>4 — 247</Mono>
      <Box style={{padding: 0, marginTop: 6, overflow: 'hidden'}}>
        {[
          {p: 4, a: 'BL', n: 'Bia Lopes', role: 'Diretora Comercial · Tier 9', pts: '1,160', d: '+340', new: true},
          {p: 5, a: 'TR', n: 'Tiago Reis', role: 'Account Executive · Tier 6', pts: '980', d: '+220'},
          {p: 6, a: 'CM', n: 'Carla M.', role: 'Diretora Comercial · Tier 11', pts: '920', d: '+180'},
          {p: 7, a: 'FM', n: 'Você (Fabio)', role: 'Tier 7', pts: '840', d: '+47', me: true},
          {p: 8, a: 'NS', n: 'Nina Souza', role: 'Tier 5', pts: '720', d: '+90'},
          {p: 9, a: 'RB', n: 'Rui B.', role: 'Tier 8', pts: '680', d: '+30'},
        ].map(r => (
          <div key={r.p} style={{display: 'grid', gridTemplateColumns: '50px 1fr 140px 80px 90px 60px', padding: '12px 14px', borderBottom: '1px dashed var(--line-faint)', alignItems: 'center', background: r.me ? '#fff7ee' : 'transparent'}}>
            <Hand size={22}>{r.p}.</Hand>
            <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
              <Av sm>{r.a}</Av>
              <b style={{fontSize: 13}}>{r.n}</b>
              {r.new && <Pill yellow style={{fontSize: 9, padding: '1px 5px'}}>NOVO</Pill>}
              {r.me && <Pill accent style={{fontSize: 9, padding: '1px 5px'}}>VOCÊ</Pill>}
            </div>
            <Mono style={{color: 'var(--ink-mid)'}}>{r.role}</Mono>
            <Mono>{r.pts}</Mono>
            <Mono style={{color: 'var(--good)'}}>{r.d}</Mono>
            <Mono style={{color: 'var(--ink-mid)'}}>view</Mono>
          </div>
        ))}
      </Box>
    </div>
  </Frame>
);

const LeaderArena = () => (
  <Frame>
    <AppBar tab={[{label: 'Feed'}, {label: 'Cursos'}, {label: 'Rank', on: true}]} />
    <div style={{padding: '20px 36px', height: 'calc(100% - 60px)', overflow: 'hidden'}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
        <Hand size={38}>A Arena</Hand>
        <Mono style={{color: 'var(--ink-mid)'}}>termina em 2d 14h · prêmio: vaga na live com Davi</Mono>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18, marginTop: 14}}>
        {/* Tower visualization */}
        <Box style={{padding: 18, position: 'relative', overflow: 'hidden'}}>
          <Mono style={{color: 'var(--ink-mid)'}}>VOCÊ ESTÁ NO TIER PRATA</Mono>
          <div style={{position: 'relative', height: 350, marginTop: 12}}>
            {/* Tower of tiers */}
            <svg width="100%" height="100%" viewBox="0 0 600 350" style={{position: 'absolute'}}>
              <defs>
                <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#1a1816" strokeWidth="1" opacity="0.2"/>
                </pattern>
              </defs>
              {[
                {y: 20, h: 50, color: '#ff5a1f', label: 'LENDÁRIO', need: '5000+', count: 2},
                {y: 75, h: 50, color: '#ffd23a', label: 'OURO', need: '2000+', count: 8},
                {y: 130, h: 50, color: '#a39c91', label: 'PRATA · você', need: '800+', count: 23, me: true},
                {y: 185, h: 50, color: '#c89572', label: 'BRONZE', need: '200+', count: 67},
                {y: 240, h: 90, color: 'url(#hatch)', label: 'INICIANTE', need: '0+', count: 147},
              ].map((t, i) => (
                <g key={i}>
                  <rect x={60 + i*5} y={t.y} width={480 - i*10} height={t.h} fill={t.color} stroke="#1a1816" strokeWidth="1.5"/>
                  <text x="80" y={t.y + 30} fontFamily="Source Serif 4" fontSize="22" fontWeight="600" fill={i < 2 ? '#fff' : '#1a1816'}>{t.label}</text>
                  <text x="80" y={t.y + 46} fontFamily="Geist Mono" fontSize="10" fill={i < 2 ? '#fff' : '#1a181699'}>{t.need} pts · {t.count} membros</text>
                  {t.me && <text x="510" y={t.y + 32} fontFamily="Source Serif 4" fontSize="20" fill="#ff5a1f" transform={`rotate(-2, 510, ${t.y+32})`}>← você</text>}
                </g>
              ))}
            </svg>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12}}>
            <Mono style={{color: 'var(--ink-mid)'}}>FALTAM <b style={{color: 'var(--accent)'}}>1,160 créditos</b> PRO OURO</Mono>
            <Btn primary sm>Ver como ganhar pts →</Btn>
          </div>
        </Box>

        {/* Right: you + your week */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          <Box style={{padding: 14, background: '#fff7ee', borderColor: 'var(--ink)'}}>
            <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
              <Av lg>FM</Av>
              <div style={{flex: 1}}>
                <b style={{fontSize: 14}}>Você · Fabio M.</b>
                <Mono style={{display: 'block', color: 'var(--ink-mid)'}}>Posição #7 · 840 créditos</Mono>
              </div>
              <LvlBadge lvl={7} />
            </div>
            <Mono style={{color: 'var(--ink-mid)', marginTop: 12, display: 'block'}}>SEU NÍVEL · 7</Mono>
            <Bar pct={62} style={{marginTop: 4}} />
            <Mono style={{color: 'var(--ink-mid)', display: 'block', marginTop: 4}}>240 créditos pro tier 8</Mono>
          </Box>

          <Box style={{padding: 12}}>
            <Mono style={{color: 'var(--ink-mid)'}}>SEUS PTS · ESTA SEMANA</Mono>
            <div style={{display: 'flex', alignItems: 'flex-end', gap: 4, marginTop: 12, height: 60}}>
              {[8, 14, 22, 5, 18, 12, 7].map((h, i) => (
                <div key={i} style={{flex: 1, height: `${h*3}px`, background: 'var(--accent)', border: '1.5px solid var(--ink)', borderRadius: '3px 3px 0 0'}} />
              ))}
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 4}}>
              {'SDQQSSD'.split('').map((d, i) => <Mono key={i} style={{color: 'var(--ink-mid)'}}>{d}</Mono>)}
            </div>
            <Hand size={20} style={{display: 'block', marginTop: 8, color: 'var(--accent)'}}>+86 essa semana</Hand>
          </Box>

          <Box style={{padding: 12}}>
            <Mono style={{color: 'var(--ink-mid)'}}>QUESTS ABERTAS</Mono>
            <div style={{display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8, fontSize: 12.5}}>
              <div>Postar 1× · <Mono style={{color: 'var(--accent)'}}>+15</Mono></div>
              <div>Responder 3× · <Mono style={{color: 'var(--accent)'}}>+30</Mono></div>
              <div>Concluir uma lição · <Mono style={{color: 'var(--accent)'}}>+12</Mono></div>
            </div>
          </Box>
        </div>
      </div>
    </div>
  </Frame>
);

const LeaderCards = () => (
  <Frame>
    <AppBar tab={[{label: 'Feed'}, {label: 'Rank', on: true}]} />
    <div style={{padding: '24px 36px', height: 'calc(100% - 60px)', overflow: 'hidden'}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
        <Hand size={40}>Os MVPs</Hand>
        <Mono style={{color: 'var(--ink-mid)'}}>top da semana · atualiza domingo às 21h</Mono>
        <div style={{flex: 1}} />
        <Pill yellow style={{fontSize: 11}}>🎁 top 3 ganham mentoria 1:1</Pill>
      </div>

      {/* Top 3 cards big */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 18}}>
        {[
          {p: 1, a: 'MR', n: 'Maria Ribeiro', role: 'VP Sales · Tier 12', pts: 2140, badges: ['I·', 'II·', 'III·'], q: 'respondeu 14 perguntas + 2 cursos finalizados', color: 'var(--accent)', text: '#fff'},
          {p: 2, a: 'JS', n: 'João Santos', role: 'Head of GTM · Tier 8', pts: 1820, badges: ['I·', 'II·'], q: 'compartilhou 3 showcases', color: 'var(--accent-2)', text: 'var(--ink)'},
          {p: 3, a: 'DK', n: 'Davi Klein', role: 'CEO · Tier 15', pts: 1420, badges: ['I·'], q: 'organizou a live de roadmap', color: 'var(--paper-2)', text: 'var(--ink)'},
        ].map(c => (
          <Box key={c.p} style={{padding: 0, overflow: 'hidden', borderWidth: 2.5}}>
            <div style={{padding: 14, background: c.color, color: c.text, borderBottom: '1.5px solid var(--ink)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <Hand size={36} style={{color: c.text}}>#{c.p}</Hand>
                <div style={{flex: 1}} />
                {c.badges.map((b, i) => <span key={i} style={{fontSize: 20}}>{b}</span>)}
              </div>
              <div style={{display: 'flex', gap: 10, marginTop: 12, alignItems: 'center'}}>
                <Av lg style={{background: 'var(--paper)', borderColor: 'var(--ink)'}}>{c.a}</Av>
                <div>
                  <Hand size={22} style={{color: c.text, display: 'block'}}>{c.n}</Hand>
                  <Mono style={{color: c.text, opacity: 0.7}}>{c.role}</Mono>
                </div>
              </div>
            </div>
            <div style={{padding: 12}}>
              <Hand size={28} color="var(--accent)">{c.pts.toLocaleString()} pts</Hand>
              <div style={{fontSize: 12, color: 'var(--ink-mid)', marginTop: 6, lineHeight: 1.45}}>"{c.q}"</div>
            </div>
          </Box>
        ))}
      </div>

      {/* Below: scrollable rest */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 16}}>
        {[
          [4, 'BL', 'Bia Lopes', 1160],
          [5, 'TR', 'Tiago Reis', 980],
          [6, 'CM', 'Carla M.', 920],
          [7, 'FM', 'Você', 840, true],
          [8, 'NS', 'Nina Souza', 720],
          [9, 'RB', 'Rui B.', 680],
        ].map(([p, a, n, pts, me]) => (
          <Box key={p} style={{padding: 10, display: 'flex', alignItems: 'center', gap: 10, background: me ? '#fff7ee' : 'var(--paper)'}}>
            <Hand size={22} style={{width: 28, textAlign: 'center'}}>{p}</Hand>
            <Av sm>{a}</Av>
            <b style={{flex: 1, fontSize: 13}}>{n}</b>
            {me && <Pill accent style={{fontSize: 9, padding: '1px 5px'}}>VOCÊ</Pill>}
            <Mono>{pts.toLocaleString()}</Mono>
          </Box>
        ))}
      </div>
    </div>
  </Frame>
);

Object.assign(window, {LeaderClassic, LeaderArena, LeaderCards});
