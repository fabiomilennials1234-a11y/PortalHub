// Onboarding (criar comunidade) — 2 variations

const OnbStepper = () => (
  <Frame>
    <Chrome url="portalhub.app/new" />
    <div style={{display: 'flex', alignItems: 'center', padding: '14px 30px', borderBottom: '1.5px solid var(--line)'}}>
      <Hand size={20}>PortalHub</Hand>
      <div style={{flex: 1}} />
      <Mono style={{color: 'var(--ink-mid)'}}>passo 3 de 5 · ~2 min restantes</Mono>
      <div style={{flex: 1}} />
      <Mono style={{color: 'var(--ink-mid)'}}>sair</Mono>
    </div>

    {/* Step bar */}
    <div style={{padding: '14px 60px', borderBottom: '1.5px dashed var(--line-soft)'}}>
      <div style={{display: 'flex', gap: 0, alignItems: 'center'}}>
        {[
          {n: 1, l: 'Nome', d: true},
          {n: 2, l: 'Categoria', d: true},
          {n: 3, l: 'Identidade', c: true},
          {n: 4, l: 'Estrutura'},
          {n: 5, l: 'Convidar'},
        ].map((s, i) => (
          <React.Fragment key={s.n}>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <div style={{width: 26, height: 26, borderRadius: '50%', border: '1.5px solid var(--ink)', background: s.d ? 'var(--accent)' : s.c ? '#fff7ee' : 'var(--paper)', color: s.d ? '#fff' : 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 16, fontWeight: 700}}>{s.d ? '✓' : s.n}</div>
              <Mono style={{color: s.c ? 'var(--ink)' : 'var(--ink-mid)', fontWeight: s.c ? 600 : 400}}>{s.l}</Mono>
            </div>
            {i < 4 && <div style={{flex: 1, height: 1.5, background: i < 2 ? 'var(--ink)' : 'var(--line-faint)', margin: '0 14px'}} />}
          </React.Fragment>
        ))}
      </div>
    </div>

    {/* Step content */}
    <div style={{padding: '36px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, height: 'calc(100% - 150px)'}}>
      <div>
        <Hand size={44} style={{lineHeight: 1}}>Vamos dar uma cara<br/>pra sua comunidade.</Hand>
        <Mono style={{color: 'var(--ink-mid)', marginTop: 8, display: 'block'}}>tudo isso pode mudar depois — sem stress.</Mono>

        <div style={{marginTop: 28, display: 'flex', flexDirection: 'column', gap: 18}}>
          <div>
            <Mono style={{color: 'var(--ink-mid)'}}>LOGO</Mono>
            <div style={{display: 'flex', gap: 10, alignItems: 'center', marginTop: 6}}>
              <div style={{width: 64, height: 64, borderRadius: 12, background: 'var(--accent)', border: '1.5px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 40, fontWeight: 700}}>D</div>
              <div>
                <Btn sm>Upload</Btn>
                <Mono style={{display: 'block', color: 'var(--ink-mid)', marginTop: 4}}>ou usamos a inicial</Mono>
              </div>
            </div>
          </div>

          <div>
            <Mono style={{color: 'var(--ink-mid)'}}>COR PRIMÁRIA</Mono>
            <div style={{display: 'flex', gap: 8, marginTop: 6}}>
              {['#ff5a1f', '#ffd23a', '#2c63ff', '#3d8b3d', '#9b5fff', '#1a1816'].map((c, i) => (
                <div key={c} style={{width: 30, height: 30, borderRadius: 8, background: c, border: i === 0 ? '2.5px solid var(--ink)' : '1.5px solid var(--ink)', boxShadow: i === 0 ? '0 0 0 2px var(--paper), 0 0 0 4px var(--accent)' : 'none'}} />
              ))}
            </div>
          </div>

          <div>
            <Mono style={{color: 'var(--ink-mid)'}}>URL</Mono>
            <div className="wf-input" style={{marginTop: 6, padding: '10px 14px'}}>
              <Mono style={{color: 'var(--ink-mid)'}}>portalhub.app/</Mono>
              <span style={{flex: 1, fontFamily: 'Geist Mono', fontSize: 13, color: 'var(--ink)'}}>exec-circle</span>
              <Mono style={{color: 'var(--good)'}}>✓ disponível</Mono>
            </div>
          </div>

          <div>
            <Mono style={{color: 'var(--ink-mid)'}}>TAGLINE · opcional</Mono>
            <Input placeholder="o que descreve sua comunidade em uma frase?" style={{marginTop: 6}} />
          </div>
        </div>

        <div style={{display: 'flex', gap: 10, marginTop: 28}}>
          <Btn>← voltar</Btn>
          <Btn primary>Continuar →</Btn>
        </div>
      </div>

      {/* Live preview */}
      <div>
        <Mono style={{color: 'var(--ink-mid)'}}>PRÉVIA · atualiza em tempo real</Mono>
        <Box style={{padding: 0, overflow: 'hidden', marginTop: 8, transform: 'none'}}>
          <div style={{padding: 14, borderBottom: '1.5px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10}}>
            <div style={{width: 28, height: 28, borderRadius: 6, background: 'var(--accent)', border: '1.5px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 18, fontWeight: 700}}>D</div>
            <Hand size={20}>exec-circle</Hand>
          </div>
          <div style={{padding: 14}}>
            <Ph w="100%" h={80} img label="// banner //" />
            <Hand size={20} style={{display: 'block', marginTop: 10}}>Bem-vindo ao exec-circle</Hand>
            <Mono style={{color: 'var(--ink-mid)'}}>"sua tagline aparece aqui"</Mono>
            <div style={{display: 'flex', gap: 6, marginTop: 12}}>
              <Btn sm primary>Entrar</Btn>
              <Btn sm>Saber mais</Btn>
            </div>
          </div>
        </Box>
        <Callout x={-30} y={140} w={130} label="você vê mudando ↑" rotate={-4} dir="right" />
      </div>
    </div>
  </Frame>
);

const OnbConversational = () => (
  <Frame>
    <div style={{padding: '40px 60px', height: '100%', display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
        <Hand size={22}>PortalHub</Hand>
        <div style={{flex: 1}} />
        <div style={{display: 'flex', gap: 4}}>
          {[true, true, true, false, false].map((d, i) => (
            <span key={i} style={{width: 22, height: 4, borderRadius: 99, background: d ? 'var(--accent)' : 'var(--line-faint)'}} />
          ))}
        </div>
        <Mono style={{color: 'var(--ink-mid)'}}>3 / 5</Mono>
      </div>

      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 620, margin: '0 auto', width: '100%'}}>
        {/* Conversation */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          {/* Bot 1 */}
          <div style={{display: 'flex', gap: 12, alignItems: 'flex-start'}}>
            <div style={{width: 36, height: 36, borderRadius: 8, background: 'var(--accent)', border: '1.5px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 22, fontWeight: 700, flex: '0 0 auto'}}>P</div>
            <Box style={{padding: '10px 14px', maxWidth: '85%', borderRadius: '12px 12px 12px 4px'}}>
              <div style={{fontSize: 13.5}}>Oi! Eu sou a Portal  Pra começar — qual o nome da sua comunidade?</div>
            </Box>
          </div>

          {/* User 1 */}
          <div style={{display: 'flex', gap: 12, justifyContent: 'flex-end'}}>
            <div style={{padding: '10px 14px', maxWidth: '85%', borderRadius: '12px 12px 4px 12px', background: 'var(--ink)', color: 'var(--paper)', fontSize: 13.5}}>exec-circle</div>
          </div>

          {/* Bot 2 */}
          <div style={{display: 'flex', gap: 12, alignItems: 'flex-start'}}>
            <div style={{width: 36, height: 36, borderRadius: 8, background: 'var(--accent)', border: '1.5px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 22, fontWeight: 700, flex: '0 0 auto'}}>P</div>
            <Box style={{padding: '10px 14px', maxWidth: '85%', borderRadius: '12px 12px 12px 4px'}}>
              <div style={{fontSize: 13.5}}>exec-circle  e do que vocês falam por lá?</div>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10}}>
                {['Vendas B2B', 'Design', 'Produto', 'Vendas', 'Marketing', 'Outro'].map((t, i) => (
                  <Pill key={t} accent={i === 0}>{t}</Pill>
                ))}
              </div>
            </Box>
          </div>

          {/* User 2 (current) */}
          <div style={{display: 'flex', gap: 12, justifyContent: 'flex-end'}}>
            <div style={{padding: '10px 14px', maxWidth: '85%', borderRadius: '12px 12px 4px 12px', background: 'var(--accent)', color: '#fff', fontSize: 13.5, border: '1.5px solid var(--ink)'}}>Engenharia + Produto</div>
          </div>

          {/* Bot 3 (typing) */}
          <div style={{display: 'flex', gap: 12, alignItems: 'flex-start'}}>
            <div style={{width: 36, height: 36, borderRadius: 8, background: 'var(--accent)', border: '1.5px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 22, fontWeight: 700, flex: '0 0 auto'}}>P</div>
            <Box style={{padding: '10px 14px', borderRadius: '12px 12px 12px 4px'}}>
              <div style={{fontSize: 13.5}}>Massa. <span className="wf-underline-soft">Aqui vão 3 templates</span> pra começar — escolhe um (dá pra mudar tudo depois):</div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12}}>
                {[
                  {n: 'Mentoria + Q&A', d: 'feed focado em casos e dúvidas operacionais'},
                  {n: 'Cases + crítica', d: 'cursos no centro, comunidade em volta'},
                  {n: 'Cohort fechada', d: 'turmas, mentoria e accountability'},
                ].map((t, i) => (
                  <div key={i} style={{padding: 10, border: '1.5px solid var(--ink)', borderRadius: 6, background: 'var(--paper)', cursor: 'pointer'}}>
                    <Hand size={16} style={{display: 'block'}}>{t.n}</Hand>
                    <Mono style={{color: 'var(--ink-mid)', display: 'block', marginTop: 2}}>{t.d}</Mono>
                  </div>
                ))}
              </div>
            </Box>
          </div>
        </div>

        {/* Input */}
        <div style={{display: 'flex', gap: 8, marginTop: 24, alignItems: 'center', padding: 4, border: '1.5px solid var(--ink)', borderRadius: 99, background: 'var(--paper)'}}>
          <div style={{flex: 1, padding: '8px 14px', fontSize: 13.5, color: 'var(--ink-low)'}}>escolha um template ↑ ou digite</div>
          <Btn primary sm style={{borderRadius: 99}}>→</Btn>
        </div>
      </div>
      <Callout x={780} y={180} w={150} label="onboarding por conversa" rotate={4} />
    </div>
  </Frame>
);

Object.assign(window, {OnbStepper, OnbConversational});
