// Player de lição — 3 variations

const PlayerClassic = () => (
  <Frame>
    <AppBar />
    <div style={{display: 'grid', gridTemplateColumns: '260px 1fr 300px', height: 'calc(100% - 60px)'}}>
      {/* Course tree */}
      <div style={{borderRight: '1.5px solid var(--line)', padding: 14, overflow: 'hidden'}}>
        <Mono style={{color: 'var(--ink-mid)'}}>← voltar ao curso</Mono>
        <Hand size={20} style={{display: 'block', marginTop: 8}}>Design Systems do zero</Hand>
        <Bar pct={42} style={{marginTop: 8}} />
        <Mono style={{color: 'var(--ink-mid)', marginTop: 4, display: 'block'}}>14 / 33 · 42%</Mono>

        <div style={{display: 'flex', flexDirection: 'column', gap: 4, marginTop: 18}}>
          {[
            {m: 'Módulo 1 · Fundamentos', open: false, done: true},
            {m: 'Módulo 2 · Tokens', open: false, done: true},
            {m: 'Módulo 3 · Componentes', open: true, lessons: [
              ['L7', 'Botões e variantes', 'done'],
              ['L8', 'Estados e foco', 'done'],
              ['L9', 'Forms e composição', 'current'],
              ['L10', 'Layout primitives', ''],
              ['L11', 'Acessibilidade', ''],
            ]},
            {m: 'Módulo 4 · Documentação', open: false},
            {m: 'Módulo 5 · Migrar legado', open: false},
          ].map((mod, i) => (
            <div key={i}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 12.5}}>
                <span style={{width: 14, height: 14, borderRadius: 3, border: '1.5px solid var(--ink)', background: mod.done ? 'var(--accent)' : 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9}}>{mod.done && '✓'}</span>
                <b>{mod.m}</b>
                <Mono style={{color: 'var(--ink-mid)', marginLeft: 'auto'}}>{mod.open ? '▾' : '▸'}</Mono>
              </div>
              {mod.open && (
                <div style={{paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 2}}>
                  {mod.lessons.map(([id, t, s]) => (
                    <div key={id} style={{padding: '5px 8px', fontSize: 12, borderRadius: 4, background: s === 'current' ? 'var(--ink)' : 'transparent', color: s === 'current' ? 'var(--paper)' : 'var(--ink-soft)', display: 'flex', gap: 6, alignItems: 'center'}}>
                      <span style={{fontSize: 10}}>{s === 'done' ? '✓' : s === 'current' ? '▶' : '○'}</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Player */}
      <div style={{padding: 18, overflow: 'hidden'}}>
        <Mono style={{color: 'var(--ink-mid)'}}>MÓDULO 3 · LIÇÃO 9</Mono>
        <Hand size={28} style={{display: 'block', marginTop: 4}}>Forms e composição</Hand>

        <div style={{position: 'relative', marginTop: 14, border: '1.5px solid var(--ink)', borderRadius: 8, overflow: 'hidden', background: '#1a1816'}}>
          <Ph w="100%" h={300} img label="// vídeo: 14:32 / 22:08 //" style={{border: 'none', borderRadius: 0, background: 'transparent', color: '#faf6ec'}} />
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12, background: 'linear-gradient(transparent, #00000099)'}}>
            <Bar pct={65} style={{background: '#faf6ec33'}} />
            <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, color: '#faf6ec'}}>
              <Btn sm style={{background: '#faf6ec22', color: '#faf6ec', border: 'none', boxShadow: 'none'}}>▶</Btn>
              <Mono style={{color: '#faf6ec'}}>14:32 / 22:08</Mono>
              <div style={{flex: 1}} />
              <Mono style={{color: '#faf6ec'}}>1.25×</Mono>
              <Mono style={{color: '#faf6ec'}}>cc</Mono>
              <Mono style={{color: '#faf6ec'}}>⛶</Mono>
            </div>
          </div>
        </div>

        <div style={{display: 'flex', gap: 10, marginTop: 12, alignItems: 'center'}}>
          <Btn>← anterior</Btn>
          <Btn primary>Marcar como concluída · +12 ⚡</Btn>
          <div style={{flex: 1}} />
          <Btn>próxima →</Btn>
        </div>

        <div style={{display: 'flex', gap: 4, marginTop: 16, borderBottom: '1.5px solid var(--line)'}}>
          {['Sobre', 'Notas', 'Recursos', 'Discussão · 8'].map((t, i) => (
            <div key={t} style={{padding: '8px 14px', borderBottom: i === 0 ? '2px solid var(--accent)' : 'none', fontSize: 13, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? 'var(--ink)' : 'var(--ink-mid)'}}>{t}</div>
          ))}
        </div>
        <div style={{fontSize: 13, color: 'var(--ink-soft)', marginTop: 12, lineHeight: 1.6}}>
          Forms são onde teu design system mais sofre. Nessa lição: composição via slots, validação, e o porquê de não usar Form Builder.
        </div>
      </div>

      {/* Right rail */}
      <div style={{padding: 14, borderLeft: '1.5px dashed var(--line-soft)', overflow: 'hidden'}}>
        <Mono style={{color: 'var(--ink-mid)'}}>SUAS ANOTAÇÕES</Mono>
        <Box style={{padding: 10, marginTop: 8, fontFamily: 'Patrick Hand', fontSize: 14, minHeight: 100, color: 'var(--ink-soft)', lineHeight: 1.5}}>
          - composição &gt; configuração<br/>
          - slots no react: children + asChild<br/>
          - <span style={{color: 'var(--accent)'}}>?? validação em qual layer?</span>
        </Box>
        <Mono style={{color: 'var(--ink-mid)', marginTop: 14, display: 'block'}}>DISCUSSÃO · 8</Mono>
        <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8}}>
          {[
            {a: 'BL', t: 'No 12:30, o padrão de slot ficou ambíguo…'},
            {a: 'JS', t: 'Recomendo react-hook-form pra validação'},
          ].map((c, i) => (
            <Box key={i} style={{padding: 8, fontSize: 12}}>
              <div style={{display: 'flex', gap: 6, alignItems: 'center'}}><Av sm>{c.a}</Av><b>{['Bia', 'João'][i]}</b><Mono style={{color: 'var(--ink-mid)', marginLeft: 'auto'}}>3min</Mono></div>
              <div style={{marginTop: 4, color: 'var(--ink-soft)'}}>{c.t}</div>
            </Box>
          ))}
        </div>
        <Mono style={{color: 'var(--ink-mid)', marginTop: 14, display: 'block'}}>+12 PTS AO CONCLUIR</Mono>
      </div>
    </div>
  </Frame>
);

const PlayerFocus = () => (
  <Frame style={{background: '#1a1816', color: '#faf6ec'}}>
    <div style={{display: 'flex', alignItems: 'center', padding: '12px 24px', borderBottom: '1.5px solid #faf6ec33'}}>
      <Mono style={{color: '#faf6ec99'}}>← Design Systems · M3 · L9</Mono>
      <div style={{flex: 1}} />
      <Bar pct={42} style={{width: 200, background: '#faf6ec22'}} />
      <Mono style={{color: '#faf6ec99', marginLeft: 8}}>42% do curso</Mono>
      <div style={{flex: 1}} />
      <Pill yellow style={{fontSize: 11}}>⚡ 1,240</Pill>
      <Av sm style={{marginLeft: 8, background: '#faf6ec22', color: '#faf6ec', borderColor: '#faf6ec33'}}>FM</Av>
    </div>

    <div style={{padding: '30px 100px', height: 'calc(100% - 56px)', display: 'flex', flexDirection: 'column'}}>
      <div style={{textAlign: 'center'}}>
        <Mono style={{color: '#faf6ec77'}}>MÓDULO 3 · LIÇÃO 9</Mono>
        <Hand size={36} style={{color: '#faf6ec', display: 'block', marginTop: 4}}>Forms e composição</Hand>
      </div>

      <div style={{position: 'relative', marginTop: 22, border: '1.5px solid #faf6ec44', borderRadius: 10, overflow: 'hidden', flex: 1}}>
        <Ph w="100%" h="100%" img label="// vídeo em foco — UI some no hover //" style={{border: 'none', borderRadius: 0, background: 'transparent', color: '#faf6ec', height: '100%'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 22px', background: 'linear-gradient(transparent, #00000099)'}}>
          <Bar pct={65} style={{background: '#faf6ec22'}} />
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, color: '#faf6ec'}}>
            <span style={{fontSize: 22}}>▶</span>
            <Mono style={{color: '#faf6ec'}}>14:32 / 22:08</Mono>
            <div style={{flex: 1}} />
            <Mono style={{color: '#faf6ec'}}>1.25×</Mono>
            <Mono style={{color: '#faf6ec'}}>cc</Mono>
            <Mono style={{color: '#faf6ec'}}>📝 nota</Mono>
            <Mono style={{color: '#faf6ec'}}>⛶</Mono>
          </div>
        </div>
      </div>

      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 18, justifyContent: 'center'}}>
        <Btn style={{background: 'transparent', borderColor: '#faf6ec44', color: '#faf6ec', boxShadow: 'none'}}>← anterior</Btn>
        <Btn primary>Concluir · +12 ⚡</Btn>
        <Btn style={{background: 'transparent', borderColor: '#faf6ec44', color: '#faf6ec', boxShadow: 'none'}}>próxima →</Btn>
        <div style={{flex: 0, width: 20}} />
        <Mono style={{color: '#faf6ec77'}}>J / K pra navegar · M pra marcar</Mono>
      </div>
    </div>
    <Callout x={780} y={130} w={140} label="modo foco: zero distração" rotate={3} />
  </Frame>
);

const PlayerSplit = () => (
  <Frame>
    <div style={{display: 'flex', alignItems: 'center', padding: '10px 20px', borderBottom: '1.5px solid var(--line)'}}>
      <Hand size={18}>← Design Systems</Hand>
      <div style={{flex: 1}} />
      <div style={{display: 'flex', gap: 4, alignItems: 'center'}}>
        {Array.from({length: 33}).map((_, i) => (
          <span key={i} style={{width: 8, height: 14, background: i < 8 ? 'var(--accent)' : i === 8 ? 'var(--ink)' : 'var(--line-faint)', border: '1px solid var(--ink)', borderRadius: 2}} />
        ))}
      </div>
      <Mono style={{color: 'var(--ink-mid)', marginLeft: 10}}>9 / 33</Mono>
      <div style={{flex: 1}} />
      <Pill yellow style={{fontSize: 11}}>⚡ +12 pra concluir</Pill>
    </div>

    <div style={{display: 'grid', gridTemplateColumns: '1.4fr 1fr', height: 'calc(100% - 50px)'}}>
      {/* Video left */}
      <div style={{padding: 20, borderRight: '1.5px solid var(--line)'}}>
        <Mono style={{color: 'var(--ink-mid)'}}>M3 · L9</Mono>
        <Hand size={26} style={{display: 'block', marginTop: 2}}>Forms e composição</Hand>
        <div style={{position: 'relative', marginTop: 12, borderRadius: 8, overflow: 'hidden', background: '#1a1816', border: '1.5px solid var(--ink)'}}>
          <Ph w="100%" h={280} img label="// vídeo //" style={{border: 'none', borderRadius: 0, background: 'transparent', color: '#faf6ec'}} />
        </div>
        <div style={{display: 'flex', gap: 10, alignItems: 'center', marginTop: 10}}>
          <Btn>← ant.</Btn>
          <Btn primary>Concluir · +12</Btn>
          <Btn>próx. →</Btn>
          <div style={{flex: 1}} />
          <Mono style={{color: 'var(--ink-mid)'}}>14:32 / 22:08</Mono>
        </div>
      </div>

      {/* Notes right */}
      <div style={{padding: 20, overflow: 'hidden'}}>
        <div style={{display: 'flex', gap: 4, marginBottom: 12}}>
          {['📝 Notas', '🗒 Transcrição', '💬 Discussão · 8', '📎 Recursos'].map((t, i) => (
            <div key={t} style={{padding: '6px 10px', fontSize: 12, borderBottom: i === 0 ? '2px solid var(--accent)' : '2px solid transparent', fontWeight: i === 0 ? 600 : 500, color: i === 0 ? 'var(--ink)' : 'var(--ink-mid)'}}>{t}</div>
          ))}
        </div>
        <Mono style={{color: 'var(--ink-mid)'}}>SUAS ANOTAÇÕES · auto-salva</Mono>
        <Box style={{padding: 14, marginTop: 8, minHeight: 280, fontFamily: 'Patrick Hand', fontSize: 16, lineHeight: 1.5, color: 'var(--ink-soft)'}}>
          <Mono style={{color: 'var(--ink-mid)', display: 'block', marginBottom: 6}}>@ 03:14</Mono>
          composição &gt; configuração; slots no react via children ou asChild prop.<br/><br/>
          <Mono style={{color: 'var(--ink-mid)', display: 'block', marginBottom: 6}}>@ 08:42</Mono>
          <span style={{background: '#ffd23a55'}}>regra: nunca passar mais de 5 props num form input.</span><br/><br/>
          <Mono style={{color: 'var(--ink-mid)', display: 'block', marginBottom: 6}}>@ 12:30</Mono>
          <span style={{color: 'var(--accent)'}}>?? validação: zod no schema vs no campo?</span> — perguntar na discussão
        </Box>
        <div style={{display: 'flex', gap: 6, marginTop: 8, fontSize: 12, color: 'var(--ink-mid)'}}>
          <Mono>⌘+B negrito · ⌘+I itálico · ⌘+S timestamp</Mono>
        </div>
      </div>
    </div>
    <Callout x={20} y={140} w={130} label="anota com timestamp" rotate={-4} />
  </Frame>
);

Object.assign(window, {PlayerClassic, PlayerFocus, PlayerSplit});
