"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Candidate = {
  id: number;
  name: string;
  status: "首选" | "推荐" | "备选" | "谨慎";
  lat: number;
  lng: number;
  drive: string;
  distance: string;
  rent: string;
  layout: string;
  year: string;
  elevation: number;
  parking: string;
  reason: string;
  caveat: string;
  source: string;
};

const project = { lat: 22.766711, lng: 114.606199 };

const candidates: Candidate[] = [
  {
    id: 1, name: "龙光玖龙府", status: "首选", lat: 22.751192, lng: 114.537549,
    drive: "约18分钟", distance: "11.4km", rent: "约¥1,100–2,000", layout: "三房两卫 89–96㎡",
    year: "2020", elevation: 16, parking: "地下车库 · 约1:1",
    reason: "通勤、房龄、户型和预算最均衡，三房两卫供应相对明确。",
    caveat: "看房时确认车位是否随租，以及车库入口暴雨倒灌记录。",
    source: "https://huizhou.leyoujia.com/xq/detail/772077.html",
  },
  {
    id: 2, name: "新华联广场", status: "推荐", lat: 22.746568, lng: 114.526832,
    drive: "约21分钟", distance: "13.1km", rent: "约¥1,150–1,800", layout: "三房两卫 95–97㎡",
    year: "2011–2020", elevation: 10, parking: "地下停车",
    reason: "商业和日常配套最好，近期三房两卫房源较多。",
    caveat: "只看2020年前后较新楼栋；不同分期房龄差异很大。",
    source: "https://huizhou.leyoujia.com/xq/detail/zf/15620/",
  },
  {
    id: 3, name: "泷珀花园", status: "推荐", lat: 22.713778, lng: 114.529096,
    drive: "约29分钟", distance: "16.0km", rent: "需实时询价", layout: "三房两卫 约106㎡",
    year: "2023", elevation: 13, parking: "地下车库 · 约0.88/户",
    reason: "六个候选中房龄最新，居住品质和拎包入住概率较高。",
    caveat: "公开长租房源偏少，需要让中介定向找三房两卫。",
    source: "https://shenzhen.leyoujia.com/xq/detail/846775.html",
  },
  {
    id: 4, name: "海伦堡·海伦虹", status: "备选", lat: 22.739377, lng: 114.545405,
    drive: "约21分钟", distance: "12.3km", rent: "需实时询价", layout: "三房两卫 约115㎡",
    year: "2018", elevation: 31, parking: "地下停车",
    reason: "估算地面高程在候选中最高，通勤也控制在半小时左右。",
    caveat: "当前公开房源以两房为主，三房两卫需蹲房源。",
    source: "https://huizhou.anjuke.com/community/view/871437",
  },
  {
    id: 5, name: "碧桂园城市之光", status: "谨慎", lat: 22.726355, lng: 114.527466,
    drive: "约25分钟", distance: "14.5km", rent: "约¥1,300–1,900", layout: "三房两卫 113–125㎡",
    year: "2019–2020", elevation: 4, parking: "小区停车位",
    reason: "户型宽敞、生活方便，租金远低于预算上限。",
    caveat: "估算地势偏低，暴雨积水是硬伤；必须雨后实地踩点。",
    source: "https://m.fang.com/xiaoqu/strategy/huizhou/2817162892.html",
  },
  {
    id: 6, name: "小城故事花园", status: "谨慎", lat: 22.768478, lng: 114.644110,
    drive: "约10分钟", distance: "4.9km", rent: "约¥1,000–1,500", layout: "三房多为一卫",
    year: "2017", elevation: 3, parking: "小区停车位",
    reason: "离项目最近，开车约10分钟，适合把通勤放在第一位。",
    caveat: "地势估算低且多数三房只有一卫，不完全满足你的硬条件。",
    source: "https://huizhou.leyoujia.com/xq/detail/43885.html",
  },
];

const statusClass = (status: Candidate["status"]) =>
  status === "首选" ? "best" : status === "推荐" ? "good" : status === "备选" ? "backup" : "caution";

export default function Home() {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<number, any>>({});
  const [active, setActive] = useState(1);
  const [filter, setFilter] = useState<"全部" | "优先看" | "需谨慎">("全部");
  const [mapReady, setMapReady] = useState(false);

  const visible = useMemo(() => candidates.filter((item) => {
    if (filter === "优先看") return item.status !== "谨慎";
    if (filter === "需谨慎") return item.status === "谨慎";
    return true;
  }), [filter]);

  useEffect(() => {
    let cancelled = false;
    const init = () => {
      if (cancelled || !mapElement.current || mapRef.current || !(window as any).L) return;
      const L = (window as any).L;
      const map = L.map(mapElement.current, { zoomControl: false }).setView([22.748, 114.574], 12);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors", maxZoom: 19,
      }).addTo(map);
      const projectIcon = L.divIcon({
        className: "project-marker-wrap",
        html: '<div class="project-marker"><span>工作</span></div>',
        iconSize: [52, 52], iconAnchor: [26, 26],
      });
      L.marker([project.lat, project.lng], { icon: projectIcon })
        .addTo(map)
        .bindPopup("<b>宙邦化工项目</b><br/>滨海十路1号");
      candidates.forEach((item) => {
        const icon = L.divIcon({
          className: "candidate-marker-wrap",
          html: `<div class="candidate-marker ${statusClass(item.status)}">${item.id}</div>`,
          iconSize: [38, 38], iconAnchor: [19, 19],
        });
        const marker = L.marker([item.lat, item.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${item.name}</b><br/>${item.drive} · ${item.rent}<br/>估算高程 ${item.elevation}m`);
        marker.on("click", () => setActive(item.id));
        markersRef.current[item.id] = marker;
        L.polyline([[item.lat, item.lng], [project.lat, project.lng]], {
          color: item.status === "谨慎" ? "#c96b3b" : "#17755c",
          weight: 1.5, opacity: .34, dashArray: "5 7",
        }).addTo(map);
      });
      mapRef.current = map;
      setMapReady(true);
    };
    const existing = document.querySelector<HTMLScriptElement>('script[data-leaflet="true"]');
    if ((window as any).L) init();
    else {
      if (!document.querySelector('link[data-leaflet="true"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.dataset.leaflet = "true";
        document.head.appendChild(link);
      }
      const script = existing ?? document.createElement("script");
      if (!existing) {
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.dataset.leaflet = "true";
        document.body.appendChild(script);
      }
      script.addEventListener("load", init, { once: true });
    }
    return () => { cancelled = true; };
  }, []);

  const focus = (item: Candidate) => {
    setActive(item.id);
    mapRef.current?.flyTo([item.lat, item.lng], 14, { duration: .8 });
    markersRef.current[item.id]?.openPopup();
  };

  const selected = candidates.find((item) => item.id === active) ?? candidates[0];

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="回到顶部"><span>住</span> 惠州租房选址</a>
        <div className="criteria"><span>≤ ¥3,500</span><i />三房两卫<i />驾车 ≤ 30min<i />避开低洼</div>
        <a className="project-link" href="https://www.amap.com/place/B0L66UCAGP" target="_blank" rel="noreferrer">在高德打开工作地 ↗</a>
      </header>

      <section className="hero" id="top">
        <div>
          <p className="eyebrow">DAYA BAY · RENTAL SCOUT</p>
          <h1>住得方便，也要<br/><em>离积水远一点</em></h1>
        </div>
        <div className="hero-copy">
          <p>以宙邦化工20万吨电池化学品项目为圆心，按你的预算、户型、通勤、房龄和停车需求，筛出 6 个值得实地看的小区。</p>
          <div className="verdict"><strong>先看结论</strong><span>龙光玖龙府最均衡；想住新看泷珀；最看重地势可蹲海伦虹。</span></div>
        </div>
      </section>

      <section className="workspace">
        <aside className="list-panel">
          <div className="panel-head">
            <div><small>SHORTLIST</small><h2>候选小区</h2></div>
            <span className="count">{visible.length} 个</span>
          </div>
          <div className="filters" role="group" aria-label="筛选候选小区">
            {(["全部", "优先看", "需谨慎"] as const).map((label) =>
              <button key={label} className={filter === label ? "active" : ""} onClick={() => setFilter(label)}>{label}</button>
            )}
          </div>
          <div className="cards">
            {visible.map((item) => (
              <button className={`place-card ${active === item.id ? "selected" : ""}`} key={item.id} onClick={() => focus(item)}>
                <span className={`rank ${statusClass(item.status)}`}>{item.id}</span>
                <span className="card-main">
                  <span className="card-title"><strong>{item.name}</strong><b className={statusClass(item.status)}>{item.status}</b></span>
                  <span className="card-meta">{item.drive}<i />{item.distance}<i />高程约 {item.elevation}m</span>
                  <span className="card-rent">{item.rent}<small>/ 月</small></span>
                </span>
                <span className="arrow">›</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="map-shell">
          <div ref={mapElement} className="map" aria-label="候选小区位置地图" />
          {!mapReady && <div className="map-loading">正在加载地图…</div>}
          <div className="legend">
            <span><i className="dot project" />工作地</span>
            <span><i className="dot best" />优先</span>
            <span><i className="dot caution" />谨慎</span>
            <small>虚线仅表示方位，并非驾车路线</small>
          </div>
          <article className="map-card">
            <div className="map-card-top"><span>当前查看 · {selected.status}</span><a href={`https://www.amap.com/search?query=${encodeURIComponent(selected.name + " 惠州")}`} target="_blank" rel="noreferrer">高德导航 ↗</a></div>
            <h3>{selected.name}</h3>
            <div className="map-stats">
              <span><small>驾车</small>{selected.drive}</span>
              <span><small>参考租金</small>{selected.rent.replace("约", "")}</span>
              <span><small>估算高程</small>{selected.elevation} m</span>
            </div>
            <p>{selected.reason}</p>
          </article>
        </div>
      </section>

      <section className="detail-section">
        <div className="section-title"><p className="eyebrow">VIEWING NOTES</p><h2>看房时，重点核对这三件事</h2></div>
        <div className="notes-grid">
          <article><span>01</span><h3>先查水，再看装修</h3><p>问物业 2026 年台风期间地库是否进水、车库坡道有没有挡水板和备用泵；最好大雨后再去一次。</p></article>
          <article><span>02</span><h3>锁定“两卫”</h3><p>平台上的“三房”不一定是两卫。小城故事多数三房为一卫；签约前以房本户型和现场为准。</p></article>
          <article><span>03</span><h3>车位写进合同</h3><p>确认月租是否含固定车位、管理费和电动车充电；地下车位同时检查入口标高与排水沟。</p></article>
        </div>
      </section>

      <section className="risk-section">
        <div>
          <p className="eyebrow light">FLOOD CHECK</p>
          <h2>高程只是第一道筛选，<br/>不是“不淹”的保证</h2>
        </div>
        <div className="risk-copy">
          <p>大亚湾官方既有易涝点包括<strong>大亚湾大道—中兴二路</strong>、<strong>龙海三路—龙山三路</strong>等路口；澳头新澳大道与安惠大道环岛也曾因积水进行排水整治。选房还要看小区排水、地库入口和每天通勤路线。</p>
          <div className="risk-links">
            <a href="https://m.huizhou.bendibao.com/news/111448.shtm" target="_blank" rel="noreferrer">官方易涝点整理 ↗</a>
            <a href="https://static.nfnews.com/content/202605/19/c12443813.html?enterColumnId=8102" target="_blank" rel="noreferrer">澳头排水整治 ↗</a>
            <a href="https://open-meteo.com/en/docs/elevation-api" target="_blank" rel="noreferrer">高程数据说明 ↗</a>
          </div>
        </div>
      </section>

      <section className="comparison">
        <div className="section-title"><p className="eyebrow">SIDE BY SIDE</p><h2>六个候选，一眼比较</h2></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>小区</th><th>通勤</th><th>房龄</th><th>目标户型</th><th>参考租金</th><th>高程</th><th>判断</th></tr></thead>
            <tbody>{candidates.map((item) => <tr key={item.id}>
              <td><strong>{item.name}</strong><small>{item.parking}</small></td>
              <td>{item.drive}<small>{item.distance}</small></td><td>{item.year}</td><td>{item.layout}</td>
              <td>{item.rent}</td><td>{item.elevation}m</td><td><span className={`table-tag ${statusClass(item.status)}`}>{item.status}</span></td>
            </tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="sources">
        <details>
          <summary>数据口径与免责声明 <span>＋</span></summary>
          <p>通勤时间为高德地图非实时驾车估算，早晚高峰可能明显增加；租金来自公开挂牌，随房源变化；高程来自 Open‑Meteo 约90米分辨率数字高程，仅作区域筛选，不代表具体楼栋、道路或地库入口标高。所谓“首选/推荐”是基于你当前条件的初筛，不构成房屋安全保证。</p>
          <div className="source-list">{candidates.map((item) => <a href={item.source} target="_blank" rel="noreferrer" key={item.id}>{item.name}房源参考 ↗</a>)}</div>
        </details>
      </section>

      <footer><span>惠州租房选址地图</span><p>建议看房顺序：龙光玖龙府 → 新华联新楼栋 → 泷珀 → 海伦虹</p><a href="#top">回到顶部 ↑</a></footer>
    </main>
  );
}
