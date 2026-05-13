// Shared premium primitives. Serif headings + clean sans body, no doodles.

const Hand = ({children, size = 22, color, style, ...rest}) => (
  <span className="wf-hand" style={{fontSize: size, color, lineHeight: 1.1, ...style}} {...rest}>{children}</span>
);

const Mono = ({children, size = 11, style, ...rest}) => (
  <span className="wf-mono" style={{fontSize: size, ...style}} {...rest}>{children}</span>
);

const Label = ({children, style, ...rest}) => (
  <span className="wf-label" style={style} {...rest}>{children}</span>
);

const Ph = ({label, w, h, dashed, soft, img, style, children, ...rest}) => (
  <div
    className={`wf-ph${dashed ? ' wf-dashed' : ''}${soft ? ' wf-soft' : ''}${img ? ' wf-img' : ''}`}
    style={{width: w, height: h, ...style}}
    {...rest}
  >
    {label || children}
  </div>
);

const Box = ({rough, soft, style, children, ...rest}) => (
  <div
    className={`wf-box${rough ? ' wf-rough' : ''}${soft ? ' wf-soft' : ''}`}
    style={style}
    {...rest}
  >
    {children}
  </div>
);

// Pill variants:
//   default — hairline outline
//   accent  — solid navy on cream
//   yellow  — solid gold (used for premium / certifications)
//   ghost   — transparent
const Pill = ({children, accent, yellow, ghost, style, ...rest}) => (
  <span
    className={`wf-pill${accent ? ' wf-accent' : ''}${yellow ? ' wf-gold' : ''}${ghost ? ' wf-ghost' : ''}`}
    style={style}
    {...rest}
  >
    {children}
  </span>
);

const Btn = ({children, primary, yellow, ghost, sm, style, ...rest}) => (
  <button
    type="button"
    className={`wf-btn${primary ? ' wf-primary' : ''}${yellow ? ' wf-gold' : ''}${ghost ? ' wf-ghost' : ''}${sm ? ' wf-sm' : ''}`}
    style={style}
    {...rest}
  >
    {children}
  </button>
);

const Av = ({children, sm, lg, xl, bg, style, ...rest}) => (
  <span
    className={`wf-av${sm ? ' wf-sm' : ''}${lg ? ' wf-lg' : ''}${xl ? ' wf-xl' : ''}`}
    style={{background: bg, ...style}}
    {...rest}
  >
    {children}
  </span>
);

const Bar = ({pct = 50, color, style, ...rest}) => (
  <div className="wf-bar" style={style} {...rest}>
    <i style={{width: `${pct}%`, background: color}} />
  </div>
);

const Note = ({children, style, arrow, ...rest}) => (
  <div className="wf-note" style={style} {...rest}>
    {children}
  </div>
);

const Nav = ({children, on, style, ...rest}) => (
  <div className={`wf-nav-item${on ? ' wf-on' : ''}`} style={style} {...rest}>
    <span className="wf-ic" />
    <span>{children}</span>
  </div>
);

const Input = ({placeholder, soft, style, ...rest}) => (
  <div className={`wf-input${soft ? ' wf-soft' : ''}`} style={style} {...rest}>
    <span style={{flex: 1, color: 'var(--ink-low)'}}>{placeholder}</span>
  </div>
);

const Chrome = ({url}) => (
  <div className="wf-chrome">
    <span className="wf-dots"><i/><i/><i/></span>
    <span className="wf-url">{url || 'portalhub.app'}</span>
    <Mono style={{color: 'var(--ink-low)'}}>⌘K</Mono>
  </div>
);

// Top "app bar" — premium navy header band, gold cert indicator.
const AppBar = ({org = 'PortalHub', tab, right}) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 16,
    padding: '14px 22px', borderBottom: '1px solid var(--line)',
    background: 'var(--paper)'
  }}>
    <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
      <div style={{
        width: 26, height: 26, border: 'none', borderRadius: 4,
        background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--gold)', fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em'
      }}>P</div>
      <span style={{fontFamily: '"Source Serif 4", Georgia, serif', fontSize: 17, fontWeight: 500, letterSpacing: '-0.01em'}}>{org}</span>
    </div>
    {tab && (
      <div style={{display: 'flex', gap: 2, marginLeft: 16}}>
        {tab.map((t, i) => (
          <div key={i} style={{
            padding: '6px 14px', fontSize: 13, fontWeight: 500, letterSpacing: '-0.005em',
            borderRadius: 4,
            background: t.on ? 'var(--ink)' : 'transparent',
            color: t.on ? 'var(--paper)' : 'var(--ink-mid)',
          }}>{t.label}</div>
        ))}
      </div>
    )}
    <div style={{flex: 1}} />
    {right || (
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <Input placeholder="Buscar membros, cursos, posts…" style={{width: 260, padding: '5px 10px', fontSize: 12}} />
        <span style={{display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', border: '1px solid var(--gold)', borderRadius: 3, fontSize: 11, color: 'var(--gold-dk)', fontFamily: 'Geist Mono, monospace', letterSpacing: '0.05em'}}>
          <span style={{width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)'}} /> 1,240 CRÉDITOS
        </span>
        <Av sm>FM</Av>
      </div>
    )}
  </div>
);

// Premium callout: thin gold rule + serif italic label, no scribble.
const Callout = ({x, y, w = 150, label, dir = 'left'}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, pointerEvents: 'none', zIndex: 5}} data-callout="">
    <span style={{fontFamily: '"Source Serif 4", Georgia, serif', fontStyle: 'italic', fontSize: 13, color: 'var(--gold-dk)', letterSpacing: '-0.005em', display: 'block'}}>{label}</span>
    <svg width={w} height="18" viewBox={`0 0 ${w} 18`} style={{display: 'block', marginTop: 4, transform: dir === 'right' ? 'scaleX(-1)' : 'none'}}>
      <path d={`M2 4 L ${w-12} 4 L ${w-12} 14`} stroke="var(--gold)" strokeWidth="1" fill="none" />
      <path d={`M${w-18} 10 L ${w-12} 14 L ${w-6} 10`} stroke="var(--gold)" strokeWidth="1" fill="none" />
    </svg>
  </div>
);

// "Tier" badge — replaces level/XP gamification with a certification feel.
const LvlBadge = ({lvl, style}) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '4px 10px', border: '1px solid var(--line)',
    borderRadius: 3, background: 'var(--paper)', fontSize: 11,
    fontFamily: 'Geist Mono, monospace', letterSpacing: '0.05em', color: 'var(--ink-soft)',
    ...style
  }}>
    <span style={{
      width: 18, height: 18, border: '1px solid var(--gold)', borderRadius: 2, background: 'var(--gold-bg)',
      color: 'var(--gold-dk)', fontFamily: '"Source Serif 4", Georgia, serif', fontSize: 12, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>{lvl}</span>
    TIER {lvl}
  </div>
);

const Frame = ({children, style}) => (
  <div className="wf" style={{width: '100%', height: '100%', overflow: 'hidden', ...style}}>{children}</div>
);

Object.assign(window, {
  Hand, Mono, Label, Ph, Box, Pill, Btn, Av, Bar, Note, Nav, Input, Chrome, AppBar, Callout, LvlBadge, Frame,
});
