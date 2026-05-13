// Eventos — 2 variations

const EventsCalendar = () => (
  <Frame>
    <AppBar tab={[{label: 'Feed'}, {label: 'Cursos'}, {label: 'Eventos', on: true}]} />
    <div style={{padding: '24px 36px', height: 'calc(100% - 60px)', overflow: 'hidden'}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
        <Hand size={38}>Eventos</Hand>
        <Mono style={{color: 'var(--ink-mid)'}}>maio · 2026</Mono>
        <div style={{flex: 1}} />
        <Pill>todos</Pill><Pill ghost>com RSVP</Pill><Pill ghost>meus</Pill>
        <Btn primary sm>+ criar</Btn>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginTop: 16, height: 'calc(100% - 80px)'}}>
        {/* Calendar */}
        <Box style={{padding: 14}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6}}>
            {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => <Mono key={d} style={{textAlign: 'center', color: 'var(--ink-mid)'}}>{d}</Mono>)}
            {Array.from({length: 35}).map((_, i) => {
              const day = i - 3; // start from -3 so 1st is on a Thu-ish
              const has = [9, 12, 17, 20, 24, 28].includes(day);
              const today = day === 12;
              return (
                <div key={i} style={{aspectRatio: '1', border: '1.5px solid var(--line-faint)', borderRadius: 5, padding: 4, background: today ? '#fff7ee' : 'transparent', borderColor: today ? 'var(--ink)' : 'var(--line-faint)', position: 'relative'}}>
                  <Mono style={{color: day <= 0 || day > 31 ? 'var(--ink-low)' : today ? 'var(--accent)' : 'var(--ink-soft)'}}>{day <= 0 ? 30 + day : day > 31 ? day - 31 : day}</Mono>
                  {has && (
                    <div style={{position: 'absolute', left: 4, right: 4, bottom: 4, padding: '1px 4px', background: 'var(--accent)', color: '#fff', fontSize: 9, fontFamily: 'Geist Mono', borderRadius: 2, border: '1px solid var(--ink)'}}>
                      {day === 12 ? '19h live' : day === 9 ? 'office hr' : day === 17 ? 'AMA' : day === 20 ? 'live' : day === 24 ? 'workshop' : 'meetup'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Box>

        {/* Right: upcoming list */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden'}}>
          <Mono style={{color: 'var(--ink-mid)'}}>PRÓXIMOS · 6</Mono>
          {[
            {d: '12 mai · 19h', t: 'Live: Roadmap Q3', host: 'Davi K.', rsvp: 42, joined: true, hot: true},
            {d: '17 mai · 14h', t: 'AMA com Maria — multi-tenancy', host: 'Maria R.', rsvp: 28},
            {d: '20 mai · 19h', t: 'Live: Como precificamos PortalHub', host: 'João S.', rsvp: 15},
            {d: '24 mai · 10h', t: 'Workshop: Design Systems hands-on', host: 'Bia L.', rsvp: 67, premium: true},
          ].map((e, i) => (
            <Box key={i} style={{padding: 12, background: e.joined ? '#fff7ee' : 'var(--paper)', borderColor: e.joined ? 'var(--ink)' : 'var(--line)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <Mono style={{color: 'var(--accent)'}}>{e.d}</Mono>
                {e.hot && <Pill yellow style={{fontSize: 9, padding: '1px 5px'}}>🔥 cheio</Pill>}
                {e.premium && <Pill style={{fontSize: 9, padding: '1px 5px'}}>💎 pro</Pill>}
                <div style={{flex: 1}} />
                {e.joined ? <Pill accent style={{fontSize: 9, padding: '1px 5px'}}>✓ confirmado</Pill> : <Btn sm>RSVP</Btn>}
              </div>
              <Hand size={20} style={{display: 'block', marginTop: 4}}>{e.t}</Hand>
              <div style={{display: 'flex', gap: 8, marginTop: 6, fontSize: 12, color: 'var(--ink-mid)'}}>
                <span>com {e.host}</span> · <span>{e.rsvp} confirmados</span>
              </div>
            </Box>
          ))}
        </div>
      </div>
    </div>
  </Frame>
);

const EventsTiles = () => (
  <Frame>
    <AppBar tab={[{label: 'Eventos', on: true}]} />
    <div style={{padding: '24px 36px', height: 'calc(100% - 60px)', overflow: 'hidden'}}>
      <div style={{display: 'flex', alignItems: 'baseline'}}>
        <Hand size={42}>O que rola por aqui</Hand>
        <div style={{flex: 1}} />
        <Btn primary sm>+ criar evento</Btn>
      </div>

      {/* Live now ticker */}
      <Box style={{padding: 14, marginTop: 14, background: 'var(--accent)', color: '#fff', borderColor: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 14}}>
        <span style={{width: 12, height: 12, borderRadius: '50%', background: '#fff', boxShadow: '0 0 0 4px #ffffff44', animation: 'pulse 1.4s infinite'}} />
        <Hand size={22} style={{color: '#fff'}}>AO VIVO AGORA</Hand>
        <span style={{flex: 1, color: '#fff', fontWeight: 500}}>"Office Hours · 4 minutos atrás" — Davi K. · 12 ouvindo</span>
        <Btn yellow style={{boxShadow: 'none'}}>Entrar →</Btn>
      </Box>

      <Mono style={{color: 'var(--ink-mid)', marginTop: 22, display: 'block'}}>EM BREVE · 6</Mono>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 8}}>
        {[
          {dd: '12', mm: 'MAI', d: 'hoje · 19h', t: 'Live: Roadmap Q3', desc: '1h · Davi K. apresenta o trimestre', rsvp: 42, joined: true, color: 'var(--accent)'},
          {dd: '17', mm: 'MAI', d: 'sex · 14h', t: 'AMA com Maria', desc: 'tudo sobre multi-tenancy + RLS', rsvp: 28, color: 'var(--accent-2)'},
          {dd: '20', mm: 'MAI', d: 'seg · 19h', t: 'Como precificamos', desc: 'João S. abre os números reais', rsvp: 15, color: 'var(--paper-2)'},
          {dd: '24', mm: 'MAI', d: 'sex · 10h', t: 'Workshop Design Systems', desc: '3h hands-on · max 30 vagas', rsvp: 27, max: 30, premium: true, color: 'var(--paper-2)'},
          {dd: '28', mm: 'MAI', d: 'ter · 17h', t: 'Demo day', desc: 'mostre o que está construindo', rsvp: 8, color: 'var(--paper-2)'},
          {dd: '03', mm: 'JUN', d: 'qua · 20h', t: 'Hot takes do mês', desc: 'painel com 4 fundadores', rsvp: 31, color: 'var(--paper-2)'},
        ].map((e, i) => (
          <Box key={i} style={{padding: 0, overflow: 'hidden'}}>
            <div style={{display: 'flex', gap: 14, padding: 14, alignItems: 'flex-start'}}>
              <div style={{textAlign: 'center', padding: 10, border: '1.5px solid var(--ink)', borderRadius: 6, background: e.color, color: e.color === 'var(--accent)' ? '#fff' : 'var(--ink)', flex: '0 0 60px'}}>
                <Hand size={26} style={{color: 'inherit', display: 'block', lineHeight: 1}}>{e.dd}</Hand>
                <Mono style={{color: 'inherit', opacity: 0.8}}>{e.mm}</Mono>
              </div>
              <div style={{flex: 1, minWidth: 0}}>
                <Mono style={{color: 'var(--ink-mid)'}}>{e.d}</Mono>
                <Hand size={20} style={{display: 'block', marginTop: 2}}>{e.t}</Hand>
                <div style={{fontSize: 12.5, color: 'var(--ink-mid)', marginTop: 4}}>{e.desc}</div>
              </div>
            </div>
            <div style={{padding: '8px 14px', borderTop: '1.5px dashed var(--line-soft)', display: 'flex', alignItems: 'center', gap: 8}}>
              <div style={{display: 'flex'}}>
                {['A', 'B', 'C', 'D'].map((a, j) => (
                  <Av key={a} sm style={{marginLeft: j === 0 ? 0 : -8, fontSize: 9, width: 20, height: 20}}>{a}</Av>
                ))}
              </div>
              <Mono style={{color: 'var(--ink-mid)'}}>{e.rsvp}{e.max ? ` / ${e.max}` : ''} confirmados</Mono>
              <div style={{flex: 1}} />
              {e.premium && <Pill style={{fontSize: 9, padding: '1px 5px'}}>💎</Pill>}
              {e.joined ? <Pill accent style={{fontSize: 10}}>✓</Pill> : <Btn sm primary>RSVP</Btn>}
            </div>
          </Box>
        ))}
      </div>
    </div>
  </Frame>
);

Object.assign(window, {EventsCalendar, EventsTiles});
