/* 첫 화면·제출 완료 화면의 배경 그래픽: 육각 네트워크, 빛줄기, 구체 (포스터 톤)
 * [data-hero-art] 요소 안에 SVG를 그린다. 같은 결과가 나오도록 난수는 고정 시드를 쓴다. */
(() => {
  "use strict";

  const W = 1200;
  const H = 900;
  const LIGHT = { x: 1125, y: 285 };   // 빛줄기가 모이는 지점

  function seeded(seed) {
    let s = seed;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  }

  const f = (n) => Math.round(n * 10) / 10;

  // 아래에서 출발해 오른쪽 위 광원으로 휘어 들어가는 빛줄기
  function trails(rand) {
    const out = [];
    const count = 26;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const sx = -60 + 820 * t + (rand() - 0.5) * 30;
      const sy = H + 30;
      const ex = LIGHT.x + (t - 0.5) * 70;
      const ey = LIGHT.y + 18 + (t - 0.5) * 30;
      const c1x = sx + 260 + 120 * t;
      const c1y = 760 - 80 * t - rand() * 40;
      const c2x = ex - 360 + 160 * t;
      const c2y = ey + 150 - 60 * t;
      const d = `M${f(sx)} ${f(sy)} C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(ex)} ${f(ey)}`;
      const width = 0.5 + rand() * 1.4;
      const kind = i % 5 === 2 ? "pulse" : i % 3 === 0 ? "flow" : "still";
      const delay = (-rand() * 6).toFixed(2);
      out.push(`<path class="trail trail--${kind}" d="${d}" stroke-width="${width.toFixed(2)}" style="animation-delay:${delay}s" />`);
    }
    return out.join("");
  }

  // 육각 격자 위에서 몇 개의 육각형·꼭짓점만 밝게 (분자 네트워크 느낌)
  function lattice(rand) {
    const size = 34;                       // 육각형 한 변
    const w = Math.sqrt(3) * size;
    const hex = (cx, cy) => {
      const pts = [];
      for (let k = 0; k < 6; k++) {
        const a = Math.PI / 180 * (60 * k - 30);
        pts.push([cx + size * Math.cos(a), cy + size * Math.sin(a)]);
      }
      return pts;
    };
    const cells = [];
    for (let row = -1; row < 9; row++) {
      for (let col = -1; col < 12; col++) {
        const cx = 640 + col * w + (row % 2 ? w / 2 : 0);
        const cy = -20 + row * size * 1.5;
        cells.push({ cx, cy, pts: hex(cx, cy) });
      }
    }
    const faint = cells.map((c) => `<polygon points="${c.pts.map((p) => p.map(f).join(",")).join(" ")}" />`).join("");

    const lit = [];
    const nodes = [];
    const pick = [[2, 3], [3, 3], [3, 4], [2, 5], [5, 7], [6, 7], [1, 8], [4, 9]];
    pick.forEach(([row, col]) => {
      const c = cells[(row + 1) * 13 + (col + 1)];
      if (!c) return;
      lit.push(`<polygon points="${c.pts.map((p) => p.map(f).join(",")).join(" ")}" />`);
      c.pts.forEach((p, k) => {
        if ((k + row) % 2 === 0) nodes.push(`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${(1.6 + rand() * 1.6).toFixed(1)}" />`);
      });
    });
    return { faint, lit: lit.join(""), nodes: nodes.join("") };
  }

  function dust(rand) {
    const out = [];
    for (let i = 0; i < 46; i++) {
      const x = 500 + rand() * 700;
      const y = 40 + rand() * 820;
      out.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${(0.5 + rand() * 1.1).toFixed(1)}" opacity="${(0.25 + rand() * 0.6).toFixed(2)}" />`);
    }
    return out.join("");
  }

  function svg() {
    const rand = seeded(20251114);
    const net = lattice(rand);
    return `
<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMaxYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="ha-orb" cx="0.72" cy="0.45" r="0.75">
      <stop offset="0" stop-color="#2f7cff" stop-opacity="0.55" />
      <stop offset="0.55" stop-color="#123a8c" stop-opacity="0.35" />
      <stop offset="1" stop-color="#0a1733" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="ha-rim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0.45" stop-color="#47d6ff" stop-opacity="0" />
      <stop offset="1" stop-color="#7fe6ff" stop-opacity="0.85" />
    </linearGradient>
    <radialGradient id="ha-light" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#e9fbff" stop-opacity="0.95" />
      <stop offset="0.18" stop-color="#5fdcff" stop-opacity="0.55" />
      <stop offset="1" stop-color="#1e6dff" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="ha-trail" gradientUnits="userSpaceOnUse" x1="0" y1="${H}" x2="${LIGHT.x}" y2="${LIGHT.y}">
      <stop offset="0" stop-color="#1e6dff" stop-opacity="0" />
      <stop offset="0.45" stop-color="#2fb8ff" stop-opacity="0.55" />
      <stop offset="1" stop-color="#cdf6ff" stop-opacity="0.95" />
    </linearGradient>
    <radialGradient id="ha-fade" cx="0.8" cy="0.2" r="0.62">
      <stop offset="0" stop-color="#fff" stop-opacity="1" />
      <stop offset="1" stop-color="#fff" stop-opacity="0" />
    </radialGradient>
    <mask id="ha-mask"><rect width="${W}" height="${H}" fill="url(#ha-fade)" /></mask>
  </defs>

  <g class="ha-net" mask="url(#ha-mask)">
    <g class="ha-net__faint">${net.faint}</g>
    <g class="ha-net__lit">${net.lit}</g>
    <g class="ha-net__nodes">${net.nodes}</g>
  </g>

  <g class="ha-orb">
    <circle cx="-150" cy="430" r="400" fill="url(#ha-orb)" />
    <circle cx="-150" cy="430" r="400" fill="none" stroke="url(#ha-rim)" stroke-width="1.6" />
  </g>

  <g class="ha-dust">${dust(rand)}</g>

  <g class="ha-trails" stroke="url(#ha-trail)" fill="none" stroke-linecap="round">${trails(rand)}</g>

  <g class="ha-light">
    <circle cx="${LIGHT.x}" cy="${LIGHT.y}" r="150" fill="url(#ha-light)" />
    <ellipse cx="${LIGHT.x}" cy="${LIGHT.y + 22}" rx="96" ry="16" fill="none" stroke="#7fe6ff" stroke-opacity="0.6" stroke-width="1.2" />
    <ellipse cx="${LIGHT.x}" cy="${LIGHT.y + 22}" rx="150" ry="26" fill="none" stroke="#47a8ff" stroke-opacity="0.25" stroke-width="1" />
  </g>
</svg>`;
  }

  // 숨겨진 화면의 SVG에 정의된 그라데이션은 다른 SVG에서 참조가 깨지므로, 그림마다 id를 따로 붙인다
  const markup = svg();
  document.querySelectorAll("[data-hero-art]").forEach((el, i) => {
    el.innerHTML = markup.replace(/(id="|url\(#)ha-/g, `$1ha${i}-`);
  });
})();
