/* @ds-bundle: {"format":3,"namespace":"VodafoneRedDesignSystem_edc79c","components":[{"name":"SpeechmarkOrb","sourcePath":"components/brand/SpeechmarkOrb.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"}],"sourceHashes":{"components/brand/SpeechmarkOrb.jsx":"ac6cfb5f4273","components/core/Badge.jsx":"81fd9d48eab6","components/core/Button.jsx":"fffc5743318b","components/core/Card.jsx":"d48aa870a09c","components/core/IconButton.jsx":"fa6ec60752bf","components/core/Input.jsx":"a26b36a55231","components/navigation/NavBar.jsx":"5b0332c6147e","ui_kits/marketing/sections.jsx":"9b1705cf6a14"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.VodafoneRedDesignSystem_edc79c = window.VodafoneRedDesignSystem_edc79c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/SpeechmarkOrb.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * The brand's visual anchor — a red square hosting the white speechmark
 * glyph. The only piece of decorative chrome that isn't a CTA. Never
 * substitute it with a wordmark or a different shape.
 */
function SpeechmarkOrb({
  size = 48,
  style = {},
  title = 'Vodafone',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    role: "img",
    "aria-label": title,
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 120 120",
    width: size,
    height: size
  }, /*#__PURE__*/React.createElement("rect", {
    width: "120",
    height: "120",
    rx: "6",
    fill: "var(--vf-primary)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M74 30c-15.5 0-28 12.7-28 28.3 0 18.2 14.4 29.4 28.4 31.7 1.7.3 2.6-.4 2.6-1.6 0-1-.6-1.7-2-2.3-7.4-3.2-12.6-9.2-13.8-16.6 1.2.4 2.6.6 4 .6 9.7 0 17.6-7.9 17.6-19.4C82.8 38.5 79.2 30 74 30z",
    fill: "var(--vf-on-primary)"
  })));
}
Object.assign(__ds_scope, { SpeechmarkOrb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/SpeechmarkOrb.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Inline metadata pill — category tag inside story cards. */
function Badge({
  children,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      background: 'var(--vf-canvas-soft)',
      color: 'var(--vf-ink)',
      fontFamily: 'var(--vf-font)',
      fontWeight: 700,
      fontSize: 'var(--vf-caption-size)',
      lineHeight: '21px',
      borderRadius: 'var(--vf-radius-pill-md)',
      padding: '4px 12px',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Vodafone Red pill button. The brand never uses square corners on CTAs —
 * every variant is a 60px pill set in the display sans.
 */
function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  fullWidth = false,
  children,
  style = {},
  ...rest
}) {
  const variants = {
    primary: {
      background: 'var(--vf-primary)',
      color: 'var(--vf-on-primary)',
      border: '1px solid var(--vf-primary)'
    },
    'outline-red': {
      background: 'var(--vf-canvas)',
      color: 'var(--vf-primary)',
      border: '1px solid var(--vf-primary)'
    },
    'outline-dark': {
      background: 'var(--vf-canvas)',
      color: 'var(--vf-ink)',
      border: '1px solid var(--vf-ink)'
    },
    'outline-on-dark': {
      background: 'transparent',
      color: 'var(--vf-on-dark)',
      border: '1px solid var(--vf-on-dark)'
    }
  };
  const sizes = {
    sm: {
      padding: '8px 20px',
      fontSize: '16px'
    },
    md: {
      padding: '12px 24px',
      fontSize: '18px'
    },
    lg: {
      padding: '16px 32px',
      fontSize: '18px'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    style: {
      fontFamily: 'var(--vf-font)',
      fontWeight: 400,
      lineHeight: '28px',
      borderRadius: 'var(--vf-radius-pill-lg)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      width: fullWidth ? '100%' : 'auto',
      whiteSpace: 'nowrap',
      transition: 'filter .15s ease, background .15s ease, color .15s ease',
      ...sizes[size],
      ...variants[variant],
      ...style
    },
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.filter = 'brightness(0.92)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.filter = 'none';
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Story card — 16:9 thumbnail on top, headline + caption below. Flat (no
 * shadow); the brand relies on surface contrast for elevation.
 */
function Card({
  image,
  imageAlt = '',
  tag,
  title,
  caption,
  lead = false,
  children,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("article", _extends({
    style: {
      background: 'var(--vf-canvas)',
      color: 'var(--vf-ink)',
      borderRadius: 'var(--vf-radius-card)',
      padding: 'var(--vf-space-lg)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--vf-space-md)',
      ...style
    }
  }, rest), image && /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '16 / 9',
      borderRadius: 'var(--vf-radius-card)',
      overflow: 'hidden',
      background: 'var(--vf-canvas-soft)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: imageAlt,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--vf-space-sm)'
    }
  }, tag && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.Badge, null, tag)), title && /*#__PURE__*/React.createElement("h3", {
    className: lead ? 'vf-display-sm' : 'vf-display-xs',
    style: {
      color: 'var(--vf-ink)'
    }
  }, title), caption && /*#__PURE__*/React.createElement("p", {
    className: "vf-body-sm",
    style: {
      color: 'var(--vf-body)'
    }
  }, caption), children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Circular white icon button (video play / pause / chevron). Effectively
 * borderless; the icon sits on a white circle.
 */
function IconButton({
  size = 48,
  ariaLabel,
  children,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": ariaLabel,
    style: {
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--vf-canvas)',
      color: 'var(--vf-ink)',
      border: '1px solid var(--vf-canvas)',
      borderRadius: 'var(--vf-radius-full)',
      cursor: 'pointer',
      padding: 0,
      transition: 'filter .15s ease',
      ...style
    },
    onMouseEnter: e => {
      e.currentTarget.style.filter = 'brightness(0.94)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.filter = 'none';
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Canonical text input — 1px ink hairline, 6px radius. */
function Input({
  label,
  hint,
  id,
  type = 'text',
  style = {},
  invalid = false,
  ...rest
}) {
  const inputId = id || (label ? `vf-input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--vf-space-sm)'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    className: "vf-body-sm-strong",
    style: {
      color: 'var(--vf-ink)'
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    style: {
      fontFamily: 'var(--vf-font)',
      fontSize: 'var(--vf-body-sm-size)',
      lineHeight: 'var(--vf-body-sm-lh)',
      color: 'var(--vf-ink)',
      background: 'var(--vf-canvas)',
      border: `1px solid ${invalid ? 'var(--vf-primary)' : 'var(--vf-ink)'}`,
      borderRadius: 'var(--vf-radius-sm)',
      padding: '12px 16px',
      outline: 'none',
      ...style
    }
  }, rest)), hint && /*#__PURE__*/React.createElement("span", {
    className: "vf-caption",
    style: {
      color: invalid ? 'var(--vf-primary)' : 'var(--vf-body)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Dark top nav — speechmark orb left, link row + affordances right. */
function NavBar({
  links = [],
  cta,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--vf-ink)',
      color: 'var(--vf-on-dark)',
      padding: '16px 32px',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--vf-space-2xl)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SpeechmarkOrb, {
    size: 36
  }), /*#__PURE__*/React.createElement("ul", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--vf-space-2xl)',
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "vf-body-sm",
    style: {
      color: 'var(--vf-on-dark)',
      textDecoration: 'none',
      opacity: 0.92
    },
    onMouseEnter: e => {
      e.currentTarget.style.opacity = '1';
    },
    onMouseLeave: e => {
      e.currentTarget.style.opacity = '0.92';
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--vf-space-lg)'
    }
  }, cta));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/sections.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Vodafone Red — Marketing UI kit sections.
   Composes the design-system components from the bundle namespace.
   Exposes sections on window for index.html to mount. */
const VF = window.VodafoneRedDesignSystem_edc79c;
const {
  Button,
  IconButton,
  Badge,
  Card,
  SpeechmarkOrb,
  Input
} = VF;

/* ── Top nav with working search + account overlays ── */
function SiteNav({
  onSearch,
  onAccount
}) {
  const links = ['Mobile', 'Broadband', 'Business', 'Why Vodafone', 'Support'];
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--vf-ink)',
      color: 'var(--vf-on-dark)',
      padding: '16px 32px',
      position: 'sticky',
      top: 0,
      zIndex: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement(SpeechmarkOrb, {
    size: 36
  }), /*#__PURE__*/React.createElement("ul", {
    style: {
      display: 'flex',
      gap: 24,
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "vf-body-sm",
    style: {
      color: 'var(--vf-on-dark)',
      textDecoration: 'none',
      opacity: .9
    },
    onMouseEnter: e => e.currentTarget.style.opacity = 1,
    onMouseLeave: e => e.currentTarget.style.opacity = .9
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    ariaLabel: "Search",
    size: 40,
    onClick: onSearch,
    style: {
      background: 'transparent',
      border: '1px solid rgba(255,255,255,.3)',
      color: 'var(--vf-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m21 21-4.3-4.3"
  }))), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "primary",
    onClick: onAccount
  }, "My account")));
}

/* ── Dark hero band — full-bleed photo + massive uppercase headline ── */
function Hero({
  onPlay
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'relative',
      background: 'var(--vf-ink)',
      color: 'var(--vf-on-dark)',
      minHeight: 560,
      display: 'flex',
      alignItems: 'flex-end',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/placeholder-hero.png",
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: .55
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: '0 32px 56px',
      maxWidth: 1100
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "vf-eyebrow",
    style: {
      color: 'var(--vf-on-dark)',
      marginBottom: 16
    }
  }, "The future is exciting"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--vf-font)',
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '-1px',
      fontSize: 'clamp(56px, 9vw, 144px)',
      lineHeight: .82,
      margin: 0
    }
  }, "Stay", /*#__PURE__*/React.createElement("br", null), "connected"), /*#__PURE__*/React.createElement("p", {
    className: "vf-body-lg",
    style: {
      color: 'var(--vf-on-dark)',
      maxWidth: 520,
      margin: '24px 0 28px',
      opacity: .92
    }
  }, "Our biggest network upgrade yet brings faster 5G to more places than ever."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Shop now"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline-on-dark",
    onClick: onPlay
  }, "Watch the film"))));
}

/* ── Light content band — section headline + story-card grid ── */
function StoryBand() {
  const stories = [{
    image: '../../assets/placeholder-network.png',
    tag: '5G',
    title: 'Faster, everywhere',
    caption: 'Coverage that keeps up with you, in more places than ever.'
  }, {
    image: '../../assets/placeholder-device.png',
    tag: 'Devices',
    title: 'The latest handsets',
    caption: 'Trade in, upgrade, and spread the cost over 24 months.'
  }, {
    image: '../../assets/placeholder-city.png',
    tag: 'Broadband',
    title: 'Full-fibre at home',
    caption: 'Reliable speeds for the whole household, guaranteed.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--vf-canvas)',
      padding: '64px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement(SpeechmarkOrb, {
    size: 48
  }), /*#__PURE__*/React.createElement("h2", {
    className: "vf-display-md",
    style: {
      color: 'var(--vf-ink)'
    }
  }, "Why people choose Vodafone")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 24
    }
  }, stories.map(s => /*#__PURE__*/React.createElement(Card, _extends({
    key: s.title
  }, s, {
    style: {
      background: 'var(--vf-canvas-soft)'
    }
  })))));
}

/* ── Red signature CTA band ── */
function RedBand() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--vf-primary)',
      color: 'var(--vf-on-primary)',
      padding: '72px 32px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "vf-eyebrow",
    style: {
      color: 'var(--vf-on-primary)',
      marginBottom: 16,
      opacity: .85
    }
  }, "Pay monthly"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--vf-font)',
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '-1px',
      fontSize: 'clamp(40px, 6vw, 90px)',
      lineHeight: .9,
      margin: '0 0 28px',
      maxWidth: 900
    }
  }, "Ready when you are"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    style: {
      background: 'var(--vf-canvas)',
      color: 'var(--vf-primary)',
      border: '1px solid var(--vf-canvas)'
    }
  }, "Build your plan"));
}

/* ── Dark footer ── */
function SiteFooter() {
  const cols = {
    'Mobile': ['Pay monthly', 'Pay as you go', 'SIM only', 'Upgrades'],
    'Broadband': ['Full fibre', 'Home broadband', 'Coverage checker'],
    'Support': ['Help centre', 'Track an order', 'Network status', 'Contact us']
  };
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--vf-ink)',
      color: 'var(--vf-on-dark)',
      padding: '48px 32px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 64,
      flexWrap: 'wrap',
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement(SpeechmarkOrb, {
    size: 44
  }), Object.entries(cols).map(([head, items]) => /*#__PURE__*/React.createElement("div", {
    key: head,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "vf-caption-uppercase",
    style: {
      color: 'var(--vf-mute)'
    }
  }, head), items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    className: "vf-body-sm",
    style: {
      color: 'var(--vf-on-dark)',
      textDecoration: 'none',
      opacity: .85
    },
    onMouseEnter: e => e.currentTarget.style.opacity = 1,
    onMouseLeave: e => e.currentTarget.style.opacity = .85
  }, i))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(255,255,255,.25)',
      paddingTop: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "vf-caption",
    style: {
      color: 'var(--vf-mute)'
    }
  }, "\xA9 Vodafone Red Design System \xB7 Demonstration surface \xB7 Not affiliated with Vodafone Group.")));
}

/* ── Account sign-in overlay ── */
function AccountOverlay({
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(37,40,43,.6)',
      zIndex: 40,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(420px, 100%)',
      height: '100%',
      background: 'var(--vf-canvas)',
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "vf-display-sm"
  }, "Sign in"), /*#__PURE__*/React.createElement(IconButton, {
    ariaLabel: "Close",
    size: 40,
    onClick: onClose,
    style: {
      border: '1px solid var(--vf-mute)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  })))), /*#__PURE__*/React.createElement(Input, {
    label: "Email address",
    type: "email",
    placeholder: "you@example.com"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Password",
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true
  }, "Sign in"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline-red",
    fullWidth: true
  }, "Create account")));
}

/* ── Search overlay ── */
function SearchOverlay({
  onClose
}) {
  const chips = ['5G coverage', 'Upgrade my phone', 'Track order', 'Broadband deals'];
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(37,40,43,.85)',
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 120
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(680px, 90%)',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Search vodafone.com",
    autoFocus: true,
    style: {
      fontSize: 22,
      padding: '16px 20px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, chips.map(c => /*#__PURE__*/React.createElement(Badge, {
    key: c,
    style: {
      cursor: 'pointer'
    }
  }, c)))));
}
Object.assign(window, {
  SiteNav,
  Hero,
  StoryBand,
  RedBand,
  SiteFooter,
  AccountOverlay,
  SearchOverlay
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/sections.jsx", error: String((e && e.message) || e) }); }

__ds_ns.SpeechmarkOrb = __ds_scope.SpeechmarkOrb;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.NavBar = __ds_scope.NavBar;

})();
