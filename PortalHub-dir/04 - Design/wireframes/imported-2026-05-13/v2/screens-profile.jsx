// Perfil de membro — 3 variations

const ProfileClassic = () => (
  <Frame>
    <AppBar tab={[{label: 'Feed'}, {label: 'Membros', on: true}]} />
    <div style={{padding: '24px 36px', height: 'calc(100% - 60px)', overflow: 'hidden'}}>
      <Box style={{padding: 20}}>
        <div style={{display: 'flex', gap: 20, alignItems: 'flex-start'}}>
          <Av xl>MR</Av>
          <div style={{flex: 1}}>
            <Hand size={32} style={{display: 'block'}}>Maria Ribeiro</Hand>
            <Mono style={{color: 'var(--ink-mid)'}}>@maria · VP Sales @ Polaris · entrou em jan/2025</Mono>
            <div style={{display: 'flex', gap: 6, marginTop: 8}}>
              <LvlBadge lvl={12} />
              <Pill yellow style={{fontSize: 11}}>Top 5 da semana</Pill>
              <Pill yellow style={{fontSize: 11}}>47 dias de sequência</Pill>
            </div>
          </div>
          <Btn>seguir</Btn>
          <Btn primary>mensagem</Btn>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 18}}>
          {[['3,420', 'pontos'], ['47', 'posts'], ['312', 'respostas'], ['4', 'cursos feitos']].map(([n, l]) => (
            <Box key={l} style={{padding: 10, textAlign: 'center'}}>
              <Hand size={26}>{n}</Hand>
              <Mono style={{display: 'block', color: 'var(--ink-mid)'}}>{l}</Mono>
            </Box>
          ))}
        </div>
      </Box>

      <div style={{display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginTop: 16}}>
        <Box style={{padding: 14}}>
          <div style={{display: 'flex', gap: 6, marginBottom: 12}}>
            {['Posts', 'Respostas', 'Cursos', 'Badges'].map((t, i) => (
              <div key={t} style={{padding: '6px 10px', fontSize: 12.5, borderBottom: i === 0 ? '2px solid var(--accent)' : '2px solid transparent', fontWeight: i === 0 ? 600 : 500, color: i === 0 ? 'var(--ink)' : 'var(--ink-mid)'}}>{t}</div>
            ))}
          </div>
          {[
            {t: 'Como vocês modelam discovery enterprise?', c: '', up: 34, com: 12, t2: '2h'},
            {t: 'Quando dar desconto no fechamento', c: 'Discussão', up: 28, com: 19, t2: '3d'},
            {t: 'ICP refinement com dados reais', c: 'Cases', up: 47, com: 22, t2: '1sem'},
          ].map((p, i) => (
            <div key={i} style={{padding: '12px 0', borderBottom: '1px dashed var(--line-faint)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <Pill style={{fontSize: 10, padding: '2px 6px'}}>{p.c}</Pill>
                <Hand size={18}>{p.t}</Hand>
                <div style={{flex: 1}} />
                <Mono style={{color: 'var(--ink-mid)'}}>{p.t2}</Mono>
              </div>
              <div style={{fontSize: 12, color: 'var(--ink-mid)', marginTop: 4}}>↑ {p.up} · {p.com} resp.</div>
            </div>
          ))}
        </Box>

        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          <Box style={{padding: 12}}>
            <Mono style={{color: 'var(--ink-mid)'}}>BADGES · 8</Mono>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 10}}>
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((b, i) => (
                <div key={i} style={{aspectRatio: '1', border: '1.5px solid var(--ink)', borderRadius: 8, background: 'var(--paper-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22}}>{b}</div>
              ))}
            </div>
          </Box>
          <Box style={{padding: 12}}>
            <Mono style={{color: 'var(--ink-mid)'}}>ATIVIDADE · 6 MESES</Mono>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(26, 1fr)', gap: 2, marginTop: 10}}>
              {Array.from({length: 26 * 7}).map((_, i) => {
                const lvl = Math.random() < 0.4 ? 0 : Math.random() < 0.6 ? 1 : Math.random() < 0.85 ? 2 : 3;
                return <div key={i} style={{aspectRatio: '1', borderRadius: 2, border: '1px solid var(--line-faint)', background: ['transparent', '#ffd23a55', '#ff8a5f', '#ff5a1f'][lvl]}} />;
              })}
            </div>
          </Box>
        </div>
      </div>
    </div>
  </Frame>
);

const ProfileCard = () => (
  <Frame>
    <AppBar />
    <div style={{padding: '36px 60px', height: 'calc(100% - 60px)', overflow: 'hidden'}}>
      <div style={{display: 'grid', gridTemplateColumns: '380px 1fr', gap: 30}}>
        {/* Trading card */}
        <div style={{position: 'relative'}}>
          <Box rough style={{padding: 0, overflow: 'hidden', borderWidth: 3, transform: 'none'}}>
            <div style={{padding: 18, background: 'var(--accent)', color: '#fff', borderBottom: '2.5px solid var(--ink)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <Hand size={42} style={{color: '#fff', flex: 1}}>Maria R.</Hand>
                <div style={{textAlign: 'right'}}>
                  <Hand size={36} style={{color: '#fff', lineHeight: 1}}>12</Hand>
                  <Mono style={{color: '#ffffffcc'}}>NÍVEL</Mono>
                </div>
              </div>
              <Mono style={{color: '#ffffffcc'}}>@maria · Engineer @ acme</Mono>
            </div>
            <div style={{padding: 16, background: 'var(--paper)'}}>
              <Ph w="100%" h={120} img label="// foto de perfil //" />
              <Mono style={{color: 'var(--ink-mid)', marginTop: 12, display: 'block'}}>ATRIBUTOS</Mono>
              <div style={{display: 'grid', gap: 6, marginTop: 6, fontSize: 13}}>
                {[['Discovery', 90], ['Negociação', 80], ['Fechamento', 70], ['Account mgmt', 60]].map(([l, v]) => (
                  <div key={l} style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <span style={{flex: '0 0 100px'}}>{l}</span>
                    <Bar pct={v} style={{flex: 1}} />
                    <Mono style={{color: 'var(--ink-mid)'}}>{v}</Mono>
                  </div>
                ))}
              </div>
              <Mono style={{color: 'var(--ink-mid)', marginTop: 14, display: 'block'}}>BADGES · 8 desbloqueados</Mono>
              <div style={{display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap'}}>
                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((b, i) => (
                  <div key={i} style={{width: 30, height: 30, border: '1.5px solid var(--ink)', borderRadius: 6, background: 'var(--paper-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16}}>{b}</div>
                ))}
              </div>
            </div>
            <div style={{padding: '10px 16px', background: 'var(--ink)', color: 'var(--paper)', borderTop: '2.5px solid var(--ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Mono style={{color: 'var(--paper)'}}>3,420 PTS · TOP 5 DA SEMANA</Mono>
              <Hand size={20} style={{color: 'var(--paper)'}}>#001/247</Hand>
            </div>
          </Box>
          <Callout x={300} y={-20} w={140} label="trading-card style" rotate={6} dir="right" />
        </div>

        {/* Right: bio + activity */}
        <div>
          <Hand size={28}>"Engenheira que escreve mais SQL que JS. Curiosa por sistemas de tipos e por gente."</Hand>
          <div style={{display: 'flex', gap: 10, marginTop: 18}}>
            <Btn>seguir</Btn>
            <Btn primary>mensagem</Btn>
            <Btn ghost sm>compartilhar perfil</Btn>
          </div>

          <Mono style={{color: 'var(--ink-mid)', marginTop: 22, display: 'block'}}>EXPERTISE · com base em respostas marcadas como úteis</Mono>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8}}>
            {['supabase', 'postgres', 'rls', 'nextjs', 'design systems', 'realtime'].map(t => <Pill key={t}>{t}</Pill>)}
          </div>

          <Mono style={{color: 'var(--ink-mid)', marginTop: 22, display: 'block'}}>ÚLTIMA ATIVIDADE</Mono>
          <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8}}>
            {[
              ['·', 'respondeu', '"Como vocês modelam discovery enterprise?"', '+15 créditos'],
              ['·', 'concluiu', 'Lição "Forms e composição"', '+12 créditos'],
              ['·', 'postou', '"Quando dar desconto no fechamento"', '+15 créditos'],
            ].map((a, i) => (
              <div key={i} style={{display: 'flex', gap: 8, fontSize: 13, padding: '8px 0', borderBottom: '1px dashed var(--line-faint)'}}>
                <span>{a[0]}</span>
                <span style={{color: 'var(--ink-mid)'}}>{a[1]}</span>
                <span style={{flex: 1, fontWeight: 500}}>{a[2]}</span>
                <Mono style={{color: 'var(--accent)'}}>{a[3]}</Mono>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </Frame>
);

const ProfilePassport = () => (
  <Frame>
    <AppBar />
    <div style={{padding: '24px 36px', height: 'calc(100% - 60px)', overflow: 'hidden'}}>
      <Mono style={{color: 'var(--ink-mid)'}}>← membros</Mono>

      {/* Header band */}
      <div style={{display: 'flex', gap: 18, marginTop: 12, padding: 18, border: '1.5px solid var(--ink)', borderRadius: 8, background: 'var(--paper-2)', alignItems: 'center'}}>
        <Av xl style={{flex: '0 0 auto', background: 'var(--accent)', color: '#fff', borderColor: 'var(--ink)'}}>MR</Av>
        <div style={{flex: 1}}>
          <Hand size={36} style={{display: 'block'}}>Maria Ribeiro</Hand>
          <Mono style={{color: 'var(--ink-mid)'}}>@maria · membro desde jan/2025 · #001 a entrar em #design-systems</Mono>
          <div style={{display: 'flex', gap: 6, marginTop: 8}}>
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((b, i) => (
              <span key={i} style={{width: 26, height: 26, border: '1.5px solid var(--ink)', borderRadius: '50%', background: 'var(--paper)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13}}>{b}</span>
            ))}
            <Mono style={{color: 'var(--ink-mid)', marginLeft: 6, alignSelf: 'center'}}>8 / 24 desbloqueados</Mono>
          </div>
        </div>
        <div style={{textAlign: 'right'}}>
          <Hand size={50} style={{color: 'var(--accent)', lineHeight: 1}}>3,420</Hand>
          <Mono style={{color: 'var(--ink-mid)'}}>PTS · TIER 12 · TOP 5</Mono>
          <div style={{marginTop: 10, display: 'flex', gap: 6, justifyContent: 'flex-end'}}>
            <Btn sm>seguir</Btn>
            <Btn sm primary>msg</Btn>
          </div>
        </div>
      </div>

      {/* Journey: passport "stamps" = milestones */}
      <Mono style={{color: 'var(--ink-mid)', marginTop: 22, display: 'block'}}>JORNADA · "carimbos" da Maria</Mono>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginTop: 10}}>
        {[
          {d: 'jan/25', t: 'Entrou', desc: 'membro fundador #1', color: 'var(--accent-2)'},
          {d: 'fev/25', t: 'Primeiro post', desc: '34 ↑', color: 'var(--paper-2)'},
          {d: 'mar/25', t: 'Tier 5', desc: 'desbloqueou DMs', color: 'var(--paper-2)'},
          {d: 'mai/25', t: '100 respostas', desc: 'destaque comentários', color: 'var(--paper-2)'},
          {d: 'jul/25', t: '30d ativos', desc: 'sequência completa', color: 'var(--paper-2)'},
          {d: 'set/25', t: 'Top 10 do mês', desc: 'mérito mensal', color: 'var(--paper-2)'},
          {d: 'out/25', t: 'Tier 10', desc: 'curso completo', color: 'var(--paper-2)'},
          {d: 'jan/26', t: '1k pts', desc: 'milestone', color: 'var(--accent-2)'},
          {d: 'fev/26', t: 'Top 3 sem.', desc: '#3 da semana', color: 'var(--paper-2)'},
          {d: 'abr/26', t: 'Tier 12', desc: 'hoje', color: 'var(--accent)', text: '#fff'},
          {d: '???', t: 'Tier 13', desc: 'em 320 créditos', color: 'transparent', dashed: true},
          {d: '???', t: 'Top 1', desc: '720 créditos atrás', color: 'transparent', dashed: true},
        ].map((s, i) => (
          <div key={i} style={{
            padding: 10, borderRadius: 8, border: `${s.dashed ? '1.5px dashed' : '1.5px solid'} var(--ink)`,
            background: s.color || 'transparent', color: s.text || 'var(--ink)',
            transform: 'none',
            opacity: s.dashed ? 0.5 : 1,
          }}>
            <Mono style={{color: s.text || 'var(--ink-mid)'}}>{s.d}</Mono>
            <Hand size={18} style={{display: 'block', marginTop: 2, color: s.text || 'var(--ink)'}}>{s.t}</Hand>
            <Mono style={{display: 'block', color: s.text ? '#ffffffaa' : 'var(--ink-mid)', marginTop: 2}}>{s.desc}</Mono>
          </div>
        ))}
      </div>
      <Callout x={500} y={310} w={150} label="passaporte: jornada visível" rotate={-3} />
    </div>
  </Frame>
);

Object.assign(window, {ProfileClassic, ProfileCard, ProfilePassport});
