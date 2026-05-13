// Login + Signup wireframes

const LoginCentered = () => (
  <Frame>
    <Chrome url="portalhub.app/login" />
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100% - 40px)', padding: 40, position: 'relative'}}>
      <div style={{width: 380}}>
        <div style={{textAlign: 'center', marginBottom: 24}}>
          <div style={{width: 44, height: 44, borderRadius: 10, background: 'var(--accent)', border: '1.5px solid var(--ink)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 28, fontWeight: 700}}>P</div>
          <Hand size={36} style={{display: 'block', marginTop: 14}}>De volta!</Hand>
          <div style={{fontSize: 13, color: 'var(--ink-mid)', marginTop: 4}}>Entre pra continuar de onde parou.</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          <Btn>⌘ Entrar com Google</Btn>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0'}}>
            <div style={{flex: 1, borderTop: '1.5px dashed var(--line-soft)'}} />
            <Mono style={{color: 'var(--ink-low)'}}>OU</Mono>
            <div style={{flex: 1, borderTop: '1.5px dashed var(--line-soft)'}} />
          </div>
          <Input placeholder="seu@email.com" />
          <Input placeholder="senha" />
          <Btn primary>Entrar →</Btn>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4}}>
            <span style={{color: 'var(--ink-mid)'}}>Esqueci a senha</span>
            <span style={{color: 'var(--ink-mid)'}}>Mandar magic link </span>
          </div>
        </div>
        <div style={{textAlign: 'center', fontSize: 13, color: 'var(--ink-mid)', marginTop: 24}}>
          Não tem conta? <b style={{color: 'var(--ink)'}}>Cria uma</b>
        </div>
      </div>
      <Callout x={120} y={120} w={130} label="single-tap pra entrar" rotate={-5} />
    </div>
  </Frame>
);

const LoginSplit = () => (
  <Frame>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100%'}}>
      {/* Left: form */}
      <div style={{padding: '36px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1.5px solid var(--ink)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 30}}>
          <div style={{width: 32, height: 32, borderRadius: 8, background: 'var(--accent)', border: '1.5px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 22, fontWeight: 700}}>P</div>
          <Hand size={22}>PortalHub</Hand>
        </div>
        <Hand size={48} style={{lineHeight: 1}}>Bem-vindo<br/><span style={{color: 'var(--accent)'}}>de volta.</span></Hand>
        <div style={{fontSize: 14, color: 'var(--ink-mid)', marginTop: 14, maxWidth: 360}}>
          Sua comunidade não para — 23 posts novos, 2 lives hoje, e você subiu pra <b>nível 7</b>.
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 30, maxWidth: 360}}>
          <Input placeholder="email" />
          <Input placeholder="senha" />
          <Btn primary>Entrar</Btn>
          <Btn ghost sm style={{boxShadow: 'none'}}>Continuar com Google →</Btn>
        </div>
      </div>

      {/* Right: "your community is waiting" preview */}
      <div style={{padding: '30px 36px', background: 'var(--paper-2)', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <Mono style={{color: 'var(--ink-mid)'}}>// ENQUANTO VOCÊ ESTAVA FORA</Mono>
        <div style={{marginTop: 14, display: 'grid', gap: 10}}>
          {[
            ['MR', 'Maria respondeu seu post', '"Concordo, mas mudaria…"', 'há 2h'],
            ['●', 'Você atingiu o Tier 7', 'Próximo: 240 créditos pro Tier 8', 'há 1d'],
            ['JS', 'João começou um curso', 'Vendas consultivas B2B · módulo 3', 'há 3h'],
            ['◷', 'Live "Roadmap Q3" começa em 1h', 'Você tem RSVP', 'hoje'],
          ].map(([i, t, s, w], idx) => (
            <Box key={idx} style={{padding: 10, display: 'flex', gap: 10, alignItems: 'center'}}>
              <Av sm>{i}</Av>
              <div style={{flex: 1, fontSize: 12.5}}>
                <div style={{fontWeight: 600}}>{t}</div>
                <div style={{color: 'var(--ink-mid)'}}>{s}</div>
              </div>
              <Mono style={{color: 'var(--ink-low)'}}>{w}</Mono>
            </Box>
          ))}
        </div>
        <Callout x={-20} y={180} w={150} label="prévia personalizada" rotate={-4} dir="right" />
      </div>
    </div>
  </Frame>
);

const SignupProgressive = () => (
  <Frame>
    <Chrome url="portalhub.app/signup" />
    <div style={{padding: '40px 60px', height: 'calc(100% - 40px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <Pill yellow style={{marginBottom: 18}}>passo 1 de 3 · começa em 30s</Pill>
      <Hand size={54} style={{textAlign: 'center', lineHeight: 1}}>
        Qual seu <span className="wf-underline-soft">email</span>?
      </Hand>
      <div style={{fontSize: 13.5, color: 'var(--ink-mid)', marginTop: 10, maxWidth: 420, textAlign: 'center'}}>
        A gente pergunta uma coisa por vez. Sem formulário de 12 campos.
      </div>
      <div style={{display: 'flex', gap: 8, marginTop: 30, width: 460}}>
        <Input placeholder="você@trabalho.com" style={{flex: 1, fontSize: 16, padding: '12px 14px'}} />
        <Btn primary style={{padding: '12px 22px'}}>→</Btn>
      </div>
      <Mono style={{color: 'var(--ink-low)', marginTop: 14}}>ENTER pra avançar</Mono>

      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 36}}>
        {[1, 2, 3].map(n => (
          <div key={n} style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <div style={{width: 26, height: 26, border: '1.5px solid var(--ink)', borderRadius: '50%', background: n === 1 ? 'var(--accent)' : 'var(--paper)', color: n === 1 ? '#fff' : 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontWeight: 700, fontSize: 14}}>{n}</div>
            <Mono>{['EMAIL', 'PERFIL', 'INTERESSES'][n-1]}</Mono>
            {n < 3 && <div style={{width: 24, borderTop: '1.5px dashed var(--line-soft)'}} />}
          </div>
        ))}
      </div>

      <Callout x={760} y={120} w={150} label="só email no primeiro passo" rotate={4} />
    </div>
  </Frame>
);

Object.assign(window, {LoginCentered, LoginSplit, SignupProgressive});
