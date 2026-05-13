// Catálogo de cursos — 3 variations

const CoursesGrid = () => (
  <Frame>
    <AppBar tab={[{label: 'Feed'}, {label: 'Cursos', on: true}, {label: 'Eventos'}, {label: 'Membros'}, {label: 'Rank'}]} />
    <div style={{padding: '24px 36px', height: 'calc(100% - 60px)', overflow: 'hidden'}}>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 20}}>
        <div>
          <Hand size={42}>Cursos</Hand>
          <Mono style={{color: 'var(--ink-mid)'}}>12 cursos · 47 lições · você completou 3</Mono>
        </div>
        <div style={{flex: 1}} />
        <Input placeholder="buscar curso…" style={{width: 240, padding: '6px 12px', fontSize: 12}} />
        <Pill>todos</Pill><Pill ghost>iniciante</Pill><Pill ghost>intermediário</Pill><Pill ghost>avançado</Pill>
        <Btn primary sm>+ criar</Btn>
      </div>

      {/* Continue watching */}
      <Mono style={{color: 'var(--ink-mid)'}}>CONTINUE DE ONDE PAROU</Mono>
      <Box style={{padding: 14, marginTop: 8, display: 'flex', gap: 14, background: '#fff7ee', borderColor: 'var(--ink)'}}>
        <Ph w={140} h={80} img label="thumb" />
        <div style={{flex: 1}}>
          <Mono>MÓDULO 3 · LIÇÃO 7</Mono>
          <Hand size={22}>Design Systems do zero</Hand>
          <div style={{fontSize: 12.5, color: 'var(--ink-mid)', marginTop: 2}}>"Tokens de cor e tipografia em produção"</div>
          <Bar pct={42} style={{marginTop: 8}} />
          <Mono style={{color: 'var(--ink-mid)', marginTop: 4, display: 'block'}}>14 / 33 lições · 42%</Mono>
        </div>
        <Btn primary>Continuar →</Btn>
      </Box>

      {/* Grid */}
      <Mono style={{color: 'var(--ink-mid)', marginTop: 24, display: 'block'}}>TODOS OS CURSOS</Mono>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 10}}>
        {[
          {t: 'Supabase em produção', lv: 'intermediário', m: 6, l: 28, p: 0, lock: false, hot: true},
          {t: 'TanStack Query v5', lv: 'iniciante', m: 4, l: 18, p: 100, lock: false},
          {t: 'Design Systems', lv: 'intermediário', m: 5, l: 33, p: 42, lock: false},
          {t: 'Stripe + RLS', lv: 'avançado', m: 3, l: 14, p: 0, lock: true},
          {t: 'Postgres tuning', lv: 'avançado', m: 4, l: 22, p: 0, lock: true},
          {t: 'Next.js App Router', lv: 'intermediário', m: 7, l: 41, p: 80, lock: false},
          {t: 'Framer Motion 12', lv: 'iniciante', m: 3, l: 15, p: 0, lock: false},
          {t: 'Realtime Supabase', lv: 'avançado', m: 4, l: 19, p: 0, lock: true, new: true},
        ].map((c, i) => (
          <Box key={i} style={{padding: 0, overflow: 'hidden'}}>
            <Ph w="100%" h={80} img label="thumb" style={{borderLeft: 0, borderRight: 0, borderTop: 0}} />
            <div style={{padding: 10}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4}}>
                <Pill style={{fontSize: 10, padding: '2px 6px'}}>{c.lv}</Pill>
                {c.hot && <Pill yellow style={{fontSize: 10, padding: '2px 6px'}}>🔥 popular</Pill>}
                {c.new && <Pill accent style={{fontSize: 10, padding: '2px 6px'}}>novo</Pill>}
                {c.lock && <Mono style={{color: 'var(--ink-mid)', marginLeft: 'auto'}}>🔒</Mono>}
              </div>
              <Hand size={18} style={{display: 'block', minHeight: 36}}>{c.t}</Hand>
              <Mono style={{color: 'var(--ink-mid)', marginTop: 6, display: 'block'}}>{c.m} módulos · {c.l} lições</Mono>
              {c.p > 0 && <Bar pct={c.p} style={{marginTop: 6}} />}
              {c.p === 100 && <Pill accent style={{fontSize: 10, marginTop: 6}}>✓ concluído</Pill>}
            </div>
          </Box>
        ))}
      </div>
      <Callout x={900} y={290} w={140} label="thumb + estado + dificuldade" rotate={-3} />
    </div>
  </Frame>
);

const CoursesShelf = () => (
  <Frame>
    <AppBar tab={[{label: 'Feed'}, {label: 'Cursos', on: true}, {label: 'Eventos'}, {label: 'Rank'}]} />
    <div style={{padding: '24px 36px', height: 'calc(100% - 60px)', overflow: 'hidden'}}>
      <Hand size={38}>Sua estante</Hand>
      <Mono style={{color: 'var(--ink-mid)'}}>3 começados · 1 concluído · 8 desbloqueados</Mono>

      {/* Shelf rows */}
      <div style={{marginTop: 22}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
          <Hand size={22}>🔥 Em progresso</Hand>
          <Mono style={{color: 'var(--ink-mid)'}}>3 cursos</Mono>
        </div>
        <div style={{display: 'flex', gap: 12, marginTop: 10, overflow: 'hidden', paddingBottom: 12, borderBottom: '1.5px solid var(--ink)'}}>
          {[
            {t: 'Design Systems', p: 42},
            {t: 'Next.js App Router', p: 80},
            {t: 'Supabase em produção', p: 15},
          ].map((c, i) => (
            <Box key={i} style={{width: 200, padding: 0, overflow: 'hidden', flex: '0 0 auto'}}>
              <Ph w="100%" h={110} img label="thumb" style={{borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0}} />
              <div style={{padding: 10}}>
                <Hand size={17}>{c.t}</Hand>
                <Bar pct={c.p} style={{marginTop: 8}} />
                <Mono style={{display: 'block', color: 'var(--ink-mid)', marginTop: 4}}>{c.p}% concluído</Mono>
              </div>
            </Box>
          ))}
          <div style={{flex: '0 0 auto', width: 200, border: '1.5px dashed var(--line-soft)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-low)', fontFamily: 'Patrick Hand', fontSize: 16}}>+ ver todos</div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 20}}>
          <Hand size={22}>🎯 Recomendados pra você</Hand>
          <Mono style={{color: 'var(--ink-mid)'}}>baseado no que você lê no feed</Mono>
        </div>
        <div style={{display: 'flex', gap: 12, marginTop: 10}}>
          {[
            {t: 'Postgres tuning', lv: 'avançado'},
            {t: 'TanStack Query v5', lv: 'iniciante'},
            {t: 'Stripe + RLS', lv: 'avançado'},
            {t: 'Framer Motion 12', lv: 'iniciante'},
          ].map((c, i) => (
            <Box key={i} style={{width: 200, padding: 0, overflow: 'hidden', flex: '0 0 auto'}}>
              <Ph w="100%" h={110} img label="thumb" style={{borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0}} />
              <div style={{padding: 10}}>
                <Pill style={{fontSize: 10, padding: '2px 6px'}}>{c.lv}</Pill>
                <Hand size={17} style={{display: 'block', marginTop: 4}}>{c.t}</Hand>
                <Btn sm primary style={{width: '100%', marginTop: 8}}>Começar →</Btn>
              </div>
            </Box>
          ))}
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 20}}>
          <Hand size={22}>🔒 Desbloqueia no nível 8</Hand>
          <Mono style={{color: 'var(--ink-mid)'}}>240 pts pra desbloquear</Mono>
        </div>
        <div style={{display: 'flex', gap: 12, marginTop: 10, opacity: 0.7}}>
          {['Realtime', 'Edge Functions', 'WebRTC ao vivo'].map((t, i) => (
            <Box key={i} style={{width: 200, padding: 12, flex: '0 0 auto'}}>
              <Mono style={{color: 'var(--ink-mid)'}}>🔒 LVL 8</Mono>
              <Hand size={17} style={{display: 'block', marginTop: 4}}>{t}</Hand>
            </Box>
          ))}
        </div>
      </div>
      <Callout x={500} y={120} w={150} label="catálogo organizado por intenção" rotate={3} />
    </div>
  </Frame>
);

const CoursesList = () => (
  <Frame>
    <AppBar tab={[{label: 'Feed'}, {label: 'Cursos', on: true}, {label: 'Eventos'}]} />
    <div style={{padding: '24px 40px', height: 'calc(100% - 60px)', overflow: 'hidden'}}>
      <Hand size={36}>Cursos</Hand>
      <div style={{display: 'flex', gap: 6, marginTop: 12}}>
        <Pill>todos · 12</Pill>
        <Pill ghost>meus · 3</Pill>
        <Pill ghost>concluídos · 1</Pill>
        <Pill ghost>desbloqueáveis · 4</Pill>
        <div style={{flex: 1}} />
        <Mono style={{color: 'var(--ink-mid)'}}>ordenar:</Mono>
        <Pill ghost style={{fontSize: 11}}>↑ progresso</Pill>
      </div>

      <Box style={{marginTop: 16, padding: 0, overflow: 'hidden'}}>
        <div style={{display: 'grid', gridTemplateColumns: '40px 2fr 1fr 100px 80px 60px 90px', padding: '10px 14px', background: 'var(--paper-2)', borderBottom: '1.5px solid var(--line)'}}>
          {['', 'CURSO', 'INSTRUTOR', 'DIFICULDADE', 'LIÇÕES', 'XP', 'PROGRESSO'].map(h => <Mono key={h} style={{color: 'var(--ink-mid)'}}>{h}</Mono>)}
        </div>
        {[
          {emoji: '🎨', t: 'Design Systems do zero', i: 'João S.', lv: 'inter.', l: '33', xp: '420', p: 42, hot: true},
          {emoji: '⚡', t: 'Supabase em produção', i: 'Davi K.', lv: 'inter.', l: '28', xp: '380', p: 15},
          {emoji: '🚀', t: 'Next.js App Router', i: 'Maria R.', lv: 'inter.', l: '41', xp: '540', p: 80},
          {emoji: '🔍', t: 'TanStack Query v5', i: 'Bia L.', lv: 'inic.', l: '18', xp: '220', p: 100, done: true},
          {emoji: '💳', t: 'Stripe + RLS', i: 'Carla M.', lv: 'avan.', l: '14', xp: '320', p: 0, lock: true},
          {emoji: '⚙️', t: 'Postgres tuning', i: 'Tiago R.', lv: 'avan.', l: '22', xp: '480', p: 0, lock: true},
        ].map((c, i) => (
          <div key={i} style={{display: 'grid', gridTemplateColumns: '40px 2fr 1fr 100px 80px 60px 90px', padding: '12px 14px', borderBottom: '1px dashed var(--line-faint)', alignItems: 'center'}}>
            <span style={{fontSize: 18}}>{c.emoji}</span>
            <div>
              <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                <b style={{fontSize: 13.5}}>{c.t}</b>
                {c.hot && <Pill yellow style={{fontSize: 9, padding: '1px 5px'}}>HOT</Pill>}
                {c.done && <Pill accent style={{fontSize: 9, padding: '1px 5px'}}>✓</Pill>}
                {c.lock && <Mono style={{color: 'var(--ink-mid)'}}>🔒</Mono>}
              </div>
              <Mono style={{color: 'var(--ink-mid)'}}>{c.l} lições · ~6h</Mono>
            </div>
            <div style={{fontSize: 12.5}}>{c.i}</div>
            <Pill style={{fontSize: 10, padding: '2px 6px', width: 'fit-content'}}>{c.lv}</Pill>
            <Mono>{c.l}</Mono>
            <Mono style={{color: 'var(--accent)'}}>+{c.xp}</Mono>
            <div>
              <Bar pct={c.p} />
              <Mono style={{display: 'block', textAlign: 'right', marginTop: 2, color: 'var(--ink-mid)'}}>{c.p}%</Mono>
            </div>
          </div>
        ))}
      </Box>
      <Callout x={780} y={110} w={130} label="denso, scannable" rotate={-3} />
    </div>
  </Frame>
);

Object.assign(window, {CoursesGrid, CoursesShelf, CoursesList});
