// Post detail — 3 variations

const PostThreaded = () => (
  <Frame>
    <AppBar />
    <div style={{display: 'grid', gridTemplateColumns: '1fr 280px', height: 'calc(100% - 60px)'}}>
      <div style={{padding: '24px 48px', overflow: 'hidden'}}>
        <div style={{fontSize: 12.5, color: 'var(--ink-mid)', marginBottom: 12}}>
          <span>← Feed</span> · <Pill style={{fontSize: 10.5, padding: '2px 8px'}}>❓ Pergunta</Pill> · <Mono>há 2h</Mono>
        </div>
        <Hand size={36} style={{display: 'block'}}>Como vocês modelam multi-tenancy no Supabase?</Hand>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 14}}>
          <Av>MR</Av>
          <div>
            <div style={{fontSize: 13, fontWeight: 600}}>Maria Ribeiro</div>
            <Mono style={{color: 'var(--ink-mid)'}}>Eng · Lvl 12 · 3.4k pts</Mono>
          </div>
          <div style={{flex: 1}} />
          <Btn sm>seguir</Btn>
        </div>

        <div style={{fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: 18}}>
          Tô na dúvida entre <b>coluna org_id em tudo</b> vs <b>schemas separados</b>. Quem já passou pelos dois caminhos? Quais foram os trade-offs reais em produção?<br/><br/>
          Pra contexto: ~50 tenants previstos, escala média (10-200 users/tenant).
        </div>

        <div style={{display: 'flex', gap: 14, alignItems: 'center', marginTop: 14, paddingTop: 12, borderTop: '1.5px dashed var(--line-soft)'}}>
          <Btn sm><span style={{marginRight: 4}}>↑</span>34</Btn>
          <Btn sm>💬 12</Btn>
          <Pill>🔥 8</Pill>
          <Pill>💯 4</Pill>
          <Pill ghost>+</Pill>
          <div style={{flex: 1}} />
          <Mono style={{color: 'var(--ink-mid)'}}>+8 pts ao responder</Mono>
        </div>

        {/* Composer */}
        <Box style={{marginTop: 22, padding: 12}}>
          <div style={{display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8}}>
            <Av sm>FM</Av>
            <Mono style={{color: 'var(--ink-mid)'}}>Sua resposta</Mono>
            <div style={{flex: 1}} />
            <Btn sm>B</Btn><Btn sm>I</Btn><Btn sm>↗</Btn>
          </div>
          <div style={{minHeight: 60, border: '1.5px dashed var(--line-soft)', borderRadius: 6, padding: 10, fontSize: 13, color: 'var(--ink-low)'}}>Comente algo útil — quanto mais útil, mais ⚡</div>
          <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 8}}>
            <Btn primary sm>Responder →</Btn>
          </div>
        </Box>

        {/* Replies */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18}}>
          <Mono style={{color: 'var(--ink-mid)'}}>12 RESPOSTAS · ordenar por ↑ úteis</Mono>
          {[
            {a: 'DK', n: 'Davi Klein', role: 'Lvl 15', t: 'há 1h', body: 'Fui de org_id em tudo + RLS forte. Funcionou bem até ~80 tenants. Schemas separados só faz sentido se você tem requisitos de compliance ou tenants gigantes.', up: 21, best: true},
            {a: 'BL', n: 'Bia Lopes', role: 'Lvl 9', t: 'há 50min', body: 'Eu testei os dois. Schemas separados é uma dor pra migrations — toda alteração roda em N schemas. RLS é mais limpo no longo prazo.', up: 14},
            {a: 'TR', n: 'Tiago Reis', role: 'Lvl 6', t: 'há 30min', body: 'Curiosidade: como vocês lidam com queries cross-tenant pra admin?', up: 5, depth: 1},
          ].map((r, i) => (
            <Box key={i} style={{padding: 12, marginLeft: r.depth ? 36 : 0, borderColor: r.best ? 'var(--accent)' : undefined, background: r.best ? '#fff7ee' : undefined}}>
              <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                <Av sm>{r.a}</Av>
                <b style={{fontSize: 12.5}}>{r.n}</b>
                <Mono style={{color: 'var(--ink-mid)'}}>{r.role} · {r.t}</Mono>
                {r.best && <Pill accent style={{fontSize: 10, padding: '2px 6px'}}>✓ melhor resposta</Pill>}
              </div>
              <div style={{fontSize: 13, color: 'var(--ink-soft)', marginTop: 6, lineHeight: 1.5}}>{r.body}</div>
              <div style={{display: 'flex', gap: 10, marginTop: 8, fontSize: 12, color: 'var(--ink-mid)'}}>
                <span>↑ {r.up}</span><span>↳ responder</span>
              </div>
            </Box>
          ))}
        </div>
      </div>

      {/* Right rail: contextual */}
      <div style={{padding: 16, borderLeft: '1.5px dashed var(--line-soft)', display: 'flex', flexDirection: 'column', gap: 14}}>
        <Mono style={{color: 'var(--ink-mid)'}}>DESTAQUES</Mono>
        <Box style={{padding: 10, background: '#fff7ee'}}>
          <Mono>✓ MELHOR RESPOSTA</Mono>
          <div style={{fontSize: 12.5, marginTop: 4}}>"Fui de org_id em tudo + RLS forte..." <b>— Davi</b></div>
        </Box>
        <div>
          <Mono style={{color: 'var(--ink-mid)'}}>POSTS RELACIONADOS</Mono>
          <div style={{display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8}}>
            {['"RLS em prod — pegadinhas"', '"Migrations com 30+ tenants"', '"Auth: clerk vs supabase"'].map((t, i) => (
              <div key={i} style={{fontSize: 12.5, color: 'var(--ink-soft)', padding: '6px 0', borderBottom: '1px dashed var(--line-faint)'}}>{t}</div>
            ))}
          </div>
        </div>
        <div>
          <Mono style={{color: 'var(--ink-mid)'}}>AUTORA</Mono>
          <Box style={{padding: 10, marginTop: 8}}>
            <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
              <Av lg>MR</Av>
              <div>
                <b style={{fontSize: 13}}>Maria Ribeiro</b>
                <Mono style={{display: 'block', color: 'var(--ink-mid)'}}>Eng · Lvl 12</Mono>
              </div>
            </div>
            <div style={{display: 'flex', gap: 10, marginTop: 8, fontSize: 12, color: 'var(--ink-mid)'}}>
              <span>📝 47 posts</span> <span>💬 312</span>
            </div>
            <Btn sm style={{width: '100%', marginTop: 8}}>Ver perfil</Btn>
          </Box>
        </div>
      </div>
    </div>
  </Frame>
);

const PostDocMargin = () => (
  <Frame>
    <AppBar />
    <div style={{padding: '24px 50px', overflow: 'hidden', height: 'calc(100% - 60px)'}}>
      <Mono style={{color: 'var(--ink-mid)'}}>← acme/dev-circle · #pergunta · há 2h</Mono>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 280px', gap: 36, marginTop: 14}}>
        {/* Document */}
        <div>
          <Hand size={46} style={{lineHeight: 1, display: 'block'}}>Como vocês modelam<br/>multi-tenancy no Supabase?</Hand>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, fontSize: 13}}>
            <Av sm>MR</Av><b>Maria Ribeiro</b><Mono style={{color: 'var(--ink-mid)'}}>· Lvl 12 · há 2h</Mono>
          </div>
          <div style={{fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.65, marginTop: 18, fontFamily: 'Geist, serif'}}>
            Tô na dúvida entre <span style={{background: '#ffd23a55', padding: '0 3px'}}>coluna <b>org_id</b> em tudo</span> vs <b>schemas separados</b>. Quem já passou pelos dois caminhos? Quais foram os <span className="wf-mark">trade-offs reais</span> em produção?<br/><br/>
            Pra contexto: ~50 tenants previstos, escala média.<br/><br/>
            Já vi defesas de ambos os lados, mas todas teóricas.<span style={{background: '#ff5a1f33', padding: '0 3px', borderBottom: '2px solid var(--accent)'}}> Queria histórias reais.</span>
          </div>
          <div style={{display: 'flex', gap: 14, marginTop: 22, paddingTop: 14, borderTop: '1.5px solid var(--line)'}}>
            <Btn>↑ 34</Btn>
            <Btn>💬 12 comentários</Btn>
            <Pill>🔥 8</Pill>
            <Pill>💯 4</Pill>
          </div>
        </div>

        {/* Margin comments */}
        <div style={{position: 'relative'}}>
          <Mono style={{color: 'var(--ink-mid)'}}>NA MARGEM</Mono>
          <div style={{position: 'absolute', left: -20, top: 30, bottom: 0, width: 2, borderLeft: '1.5px dashed var(--line-soft)'}} />
          <div style={{display: 'flex', flexDirection: 'column', gap: 14, marginTop: 12}}>
            {[
              {a: 'DK', n: 'Davi', target: 'coluna org_id', body: '+1 nessa. Fui de org_id e funcionou até 80 tenants tranquilo.', up: 21, accent: true},
              {a: 'BL', n: 'Bia', target: 'schemas separados', body: 'Schemas = inferno de migrations. Já passei.', up: 14},
              {a: 'TR', n: 'Tiago', target: 'trade-offs reais', body: 'Que tipo de trade-off te preocupa mais: dev velocity ou isolamento?', up: 5},
              {a: 'CM', n: 'Carla', target: 'Queria histórias reais', body: 'Tenho um caso onde precisei migrar dos dois lados — posso contar em call.', up: 8},
            ].map((c, i) => (
              <Box key={i} style={{padding: 10, borderColor: c.accent ? 'var(--accent)' : 'var(--line-soft)', background: c.accent ? '#fff7ee' : 'var(--paper)'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4}}>
                  <Av sm>{c.a}</Av>
                  <b style={{fontSize: 12}}>{c.n}</b>
                  <Mono style={{color: 'var(--ink-mid)', marginLeft: 'auto'}}>↑ {c.up}</Mono>
                </div>
                <Mono style={{color: 'var(--ink-mid)'}}>RE: "{c.target}"</Mono>
                <div style={{fontSize: 12.5, marginTop: 4, lineHeight: 1.5}}>{c.body}</div>
              </Box>
            ))}
          </div>
        </div>
      </div>
      <Callout x={600} y={300} w={150} label="comentários ancorados em trechos" rotate={-3} />
    </div>
  </Frame>
);

const PostQA = () => (
  <Frame>
    <AppBar />
    <div style={{padding: '20px 60px', height: 'calc(100% - 60px)', overflow: 'hidden'}}>
      <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
        <Pill yellow>❓ PERGUNTA · resolvida</Pill>
        <Mono style={{color: 'var(--ink-mid)'}}>2h · 12 respostas · 34 ↑</Mono>
        <div style={{flex: 1}} />
        <Btn sm>compartilhar</Btn>
        <Btn sm>seguir</Btn>
      </div>

      <Hand size={42} style={{display: 'block', marginTop: 18}}>Como vocês modelam multi-tenancy no Supabase?</Hand>

      <div style={{display: 'grid', gridTemplateColumns: '60px 1fr', gap: 18, marginTop: 22}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
          <Btn sm style={{width: 44, padding: 4}}>↑</Btn>
          <Hand size={22}>34</Hand>
          <Btn sm style={{width: 44, padding: 4}}>↓</Btn>
        </div>
        <div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 12.5}}>
            <Av sm>MR</Av><b>Maria Ribeiro</b><Mono style={{color: 'var(--ink-mid)'}}>· Eng · Lvl 12</Mono>
          </div>
          <div style={{fontSize: 14, lineHeight: 1.6, color: 'var(--ink-soft)'}}>
            Tô na dúvida entre coluna <code style={{background: 'var(--paper-2)', padding: '1px 5px', borderRadius: 3, fontFamily: 'Geist Mono', fontSize: 12.5}}>org_id</code> em tudo vs schemas separados. ~50 tenants previstos. Quem passou pelos dois?
          </div>
        </div>
      </div>

      {/* Best answer highlighted */}
      <Box style={{marginTop: 24, padding: 18, background: '#fff7ee', borderColor: 'var(--ink)'}}>
        <Pill accent style={{fontSize: 11}}>✓ resposta aceita pela Maria</Pill>
        <div style={{display: 'grid', gridTemplateColumns: '60px 1fr', gap: 18, marginTop: 12}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Hand size={32} color="var(--accent)">21</Hand>
            <Mono style={{color: 'var(--ink-mid)'}}>↑ úteis</Mono>
          </div>
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 12.5}}>
              <Av sm>DK</Av><b>Davi Klein</b><Mono style={{color: 'var(--ink-mid)'}}>· Lvl 15 · há 1h</Mono>
              <Pill yellow style={{fontSize: 10, marginLeft: 8}}>+15 pts ⚡</Pill>
            </div>
            <div style={{fontSize: 14, lineHeight: 1.65, color: 'var(--ink-soft)'}}>
              Fui de <b>org_id em tudo + RLS forte</b>. Funcionou bem até ~80 tenants. Schemas separados só faz sentido se você tem compliance ou tenants gigantes.<br/><br/>
              Concretamente: <code>(org_id, user_id)</code> em índice composto em quase tudo, e RLS policy usa <code>auth.jwt() -&gt; 'org_id'</code>.
            </div>
          </div>
        </div>
      </Box>

      {/* Other answers */}
      <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 24, marginBottom: 10}}>
        <Mono style={{color: 'var(--ink-mid)'}}>OUTRAS 11 RESPOSTAS · ordenar por</Mono>
        <Pill style={{fontSize: 11}}>↑ úteis</Pill>
        <Pill ghost style={{fontSize: 11}}>recente</Pill>
      </div>
      {[
        {a: 'BL', n: 'Bia', up: 14, body: 'Schemas = inferno de migrations.'},
        {a: 'CM', n: 'Carla', up: 8, body: 'Tenho um caso real — migrei dos dois lados.'},
      ].map((r, i) => (
        <Box key={i} style={{padding: 12, marginBottom: 8}}>
          <div style={{display: 'grid', gridTemplateColumns: '50px 1fr', gap: 14}}>
            <div style={{textAlign: 'center'}}>
              <Hand size={22}>{r.up}</Hand>
              <Mono style={{display: 'block', color: 'var(--ink-mid)'}}>↑</Mono>
            </div>
            <div>
              <div style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5}}><Av sm>{r.a}</Av><b>{r.n}</b></div>
              <div style={{fontSize: 13, marginTop: 4, color: 'var(--ink-soft)'}}>{r.body}</div>
            </div>
          </div>
        </Box>
      ))}
    </div>
  </Frame>
);

Object.assign(window, {PostThreaded, PostDocMargin, PostQA});
