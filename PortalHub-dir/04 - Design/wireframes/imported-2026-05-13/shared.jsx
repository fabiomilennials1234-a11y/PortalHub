// Shared wireframe primitives. Sketchy, low-fi, slightly handwritten.
// All components wrap children in a `.wf` div upstream — children use only `wf-*` classes.

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

const Pill = ({children, accent, yellow, ghost, style, ...rest}) => (
  <span
    className={`wf-pill${accent ? ' wf-accent' : ''}${yellow ? ' wf-yellow' : ''}${ghost ? ' wf-ghost' : ''}`}
    style={style}
    {...rest}
  >
    {children}
  </span>
);

const Btn = ({children, primary, yellow, ghost, sm, style, ...rest}) => (
  <button
    type="button"
    className={`wf-btn${primary ? ' wf-primary' : ''}${yellow ? ' wf-yellow' : ''}${ghost ? ' wf-ghost' : ''}${sm ? ' wf-sm' : ''}`}
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
    {arrow && (
      <svg width="40" height="20" viewBox="0 0 40 20" style={{marginTop: 2}}>
        <path d="M2 4 Q 15 18 36 14" className="wf-scribble" />
        <path d="M30 10 L 36 14 L 30 18" className="wf-scribble" />
      </svg>
    )}
  </div>
);

// Sidebar nav item
const Nav = ({children, on, style, ...rest}) => (
  <div className={`wf-nav-item${on ? ' wf-on' : ''}`} style={style} {...rest}>
    <span className="wf-ic" />
    <span>{children}</span>
  </div>
);

// Faux input
const Input = ({placeholder, soft, style, ...rest}) => (
  <div className={`wf-input${soft ? ' wf-soft' : ''}`} style={style} {...rest}>
    <span style={{flex: 1, color: 'var(--ink-low)'}}>{placeholder}</span>
  </div>
);

// Browser chrome bar with optional url
const Chrome = ({url}) => (
  <div className="wf-chrome">
    <span className="wf-dots"><i/><i/><i/></span>
    <span className="wf-url">{url || 'portalhub.app'}</span>
    <Mono style={{color: 'var(--ink-low)'}}>⌘K</Mono>
  </div>
);

// Top "app bar" — used inside the platform.
const AppBar = ({org = 'PortalHub', tab, right}) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 16,
    padding: '12px 18px', borderBottom: '1.5px solid var(--line)',
    background: 'var(--paper)'
  }}>
    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
      <div style={{
        width: 26, height: 26, border: '1.5px solid var(--line)', borderRadius: 6,
        background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontFamily: 'Caveat, cursive', fontSize: 18, fontWeight: 700
      }}>P</div>
      <Hand size={20}>{org}</Hand>
    </div>
    {tab && (
      <div style={{display: 'flex', gap: 4, marginLeft: 8}}>
        {tab.map((t, i) => (
          <div key={i} style={{
            padding: '6px 12px', fontSize: 13, fontWeight: 500,
            borderRadius: 6,
            background: t.on ? 'var(--ink)' : 'transparent',
            color: t.on ? 'var(--paper)' : 'var(--ink-mid)',
          }}>{t.label}</div>
        ))}
      </div>
    )}
    <div style={{flex: 1}} />
    {right || (
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <Input placeholder="Buscar..." style={{width: 200, padding: '5px 10px', fontSize: 12}} />
        <Pill yellow>⚡ 1,240 pts</Pill>
        <Av sm>FM</Av>
      </div>
    )}
  </div>
);

// A "scribbled" arrow pointing to a feature, with a handwritten label
const Callout = ({x, y, w = 130, label, rotate = -2, dir = 'left'}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, transform: `rotate(${rotate}deg)`, pointerEvents: 'none', zIndex: 5}}>
    <Hand size={16} color="var(--accent)" style={{display: 'block'}}>{label}</Hand>
    <svg width={w} height="26" viewBox={`0 0 ${w} 26`} style={{display: 'block', marginTop: 2, transform: dir === 'right' ? 'scaleX(-1)' : 'none'}}>
      <path d={`M4 6 Q ${w*0.4} 22 ${w-12} 18`} className="wf-scribble" />
      <path d={`M${w-18} 12 L ${w-12} 18 L ${w-18} 22`} className="wf-scribble" />
    </svg>
  </div>
);

// Convenience: a level/streak badge for gamification
const LvlBadge = ({lvl, style}) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '3px 8px 3px 4px', border: '1.5px solid var(--ink)',
    borderRadius: 999, background: 'var(--paper)', fontSize: 12, fontWeight: 600,
    ...style
  }}>
    <span style={{
      width: 20, height: 20, borderRadius: '50%', background: 'var(--accent)',
      color: '#fff', fontFamily: 'Caveat, cursive', fontSize: 14, fontWeight: 700,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>{lvl}</span>
    <Mono size={11}>LVL {lvl}</Mono>
  </div>
);

// Wrap a wireframe artboard's content so it picks up wf vars
const Frame = ({children, style}) => (
  <div className="wf" style={{width: '100%', height: '100%', overflow: 'hidden', ...style}}>{children}</div>
);

Object.assign(window, {
  Hand, Mono, Label, Ph, Box, Pill, Btn, Av, Bar, Note, Nav, Input, Chrome, AppBar, Callout, LvlBadge, Frame,
});
