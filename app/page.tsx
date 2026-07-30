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
  groups: ("山景优先" | "通勤优先")[];
  rent: string;
  layout: string;
  year: string;
  elevation: number;
  parking: string;
  view: string;
  furnish: string;
  reason: string;
  caveat: string;
  source: string;
};

const project = { lat: 22.766711, lng: 114.606199 };

const candidates: Candidate[] = [
  {
    id: 1, name: "翡翠山·珑悦", status: "首选", lat: 22.757952, lng: 114.486566,
    drive: "约28–35分钟", distance: "约18km", groups: ["山景优先"], rent: "约¥1,600–2,200", layout: "三房两卫 约90–96㎡",
    year: "2017–2020", elevation: 33, parking: "地下停车",
    view: "山景潜力高", furnish: "精装全配房源明确",
    reason: "项目依山，近期能找到精装三房两卫、家私家电齐全的挂牌；山景、生活便利和预算三项最均衡。",
    caveat: "只看有客厅和主卧窗外山景实拍的具体房源，排除海景与纯楼景。",
    source: "https://huizhou.zf.58.com/ssc-67/dayawan/",
  },
  {
    id: 2, name: "龙光玖龙府", status: "推荐", lat: 22.751192, lng: 114.537549,
    drive: "约18–25分钟", distance: "约11.4km", groups: ["通勤优先"], rent: "约¥1,100–2,000", layout: "三房两卫 约89–96㎡",
    year: "2020", elevation: 16, parking: "地下车库 · 约1:1",
    view: "山景需逐套碰房源", furnish: "精装带家私家电房源明确",
    reason: "通勤最短，三房两卫与全配房源也比较好找；不再受商圈限制后，它是最实用的工作日方案。",
    caveat: "地势不算高，山景也不是小区默认属性；重点核验地库入口、路线积水和窗外实景。",
    source: "https://huizhou.leyoujia.com/xq/detail/772077.html",
  },
  {
    id: 3, name: "海伦堡·海伦虹", status: "推荐", lat: 22.739377, lng: 114.545405,
    drive: "约20–28分钟", distance: "约12.3km", groups: ["山景优先", "通勤优先"], rent: "约¥1,600–2,500", layout: "三房两卫约100㎡（房源需等）",
    year: "2021前后", elevation: 31, parking: "地下停车",
    view: "山景潜力较高", furnish: "精装，全配逐套确认",
    reason: "通勤、估算高程和靠山环境比较均衡，适合盯三房两卫的中高层山向房。",
    caveat: "近期更容易看到四房全配，三房两卫长租供应不算稳定；不要为了赶时间接受海向或家具不全。",
    source: "https://huizhou.anjuke.com/community/view/871437",
  },
  {
    id: 4, name: "恒大悦龙台", status: "推荐", lat: 22.753241, lng: 114.465031,
    drive: "约32–40分钟", distance: "约21km", groups: ["山景优先"], rent: "约¥1,500–2,200", layout: "三房两卫 约94–108㎡",
    year: "2020–2022", elevation: 47, parking: "地下停车",
    view: "山景潜力较高", furnish: "豪装／精装全配房源明确",
    reason: "三房两卫、精装修、家电齐全的挂牌较明确，估算高程在候选中最高，防涝初筛更占优。",
    caveat: "通勤略超理想30分钟；签约前要在早高峰实测路线，并检查地库入口和低点道路。",
    source: "https://m.fang.com/zf/huizhou_xm2817163584/",
  },
  {
    id: 5, name: "泷珀花园", status: "备选", lat: 22.713778, lng: 114.529096,
    drive: "约27–35分钟", distance: "约16km", groups: ["山景优先"], rent: "约¥2,300–3,300", layout: "三房两卫 约106㎡",
    year: "2023", elevation: 13, parking: "地下停车",
    view: "近山，朝向决定实景", furnish: "新房精装，家具需逐套确认",
    reason: "房龄最新、户型和装修条件强，预算也能覆盖；适合把“新、装修好”放在更前面的选择。",
    caveat: "长租挂牌较少，估算高程也不高；只能看有完整家具、明确山景且地库防倒灌记录良好的房源。",
    source: "https://mobile.anjuke.com/esf/huizhou-cm1379188/",
  },
  {
    id: 6, name: "碧桂园城央印象", status: "备选", lat: 22.7505, lng: 114.5000,
    drive: "约25–33分钟", distance: "约16km", groups: ["通勤优先"], rent: "约¥2,700–3,200", layout: "四房两卫（满足≥三房）",
    year: "2021前后", elevation: 16, parking: "地下停车",
    view: "山景潜力中等", furnish: "精装、品牌家具家电挂牌明确",
    reason: "四房两卫、装修与家具配置更强，仍在3500元预算内；适合重视居住品质和空间。",
    caveat: "地图点位为小区近似中心；高程偏低且山景不稳定，必须现场核对楼栋、朝向与暴雨积水史。",
    source: "https://www.fang.com/houses/zf_49744huizhou/g24/",
  },
];

const statusClass = (status: Candidate["status"]) =>
  status === "首选" ? "best" : status === "推荐" ? "good" : status === "备选" ? "backup" : "caution";

export default function Home() {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<number, any>>({});
  const [active, setActive] = useState(1);
  const [filter, setFilter] = useState<"全部" | "山景优先" | "通勤优先">("全部");
  const [mapReady, setMapReady] = useState(false);

  const visible = useMemo(() => candidates.filter((item) => {
    if (filter !== "全部") return item.groups.includes(filter);
    return true;
  }), [filter]);

  useEffect(() => {
    let cancelled = false;
    const init = () => {
      if (cancelled || !mapElement.current || mapRef.current || !(window as any).L) return;
      const L = (window as any).L;
      const map = L.map(mapElement.current, { zoomControl: false }).setView([22.748, 114.535], 12);
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
        <div className="criteria"><span>≤ ¥3,500</span><i />至少三房两卫<i />山景不看海<i />精装全配<i />通勤≤1小时</div>
        <a className="project-link" href="https://www.amap.com/place/B0L66UCAGP" target="_blank" rel="noreferrer">在高德打开工作地 ↗</a>
      </header>

      <section className="hero" id="top">
        <div>
          <p className="eyebrow">MOUNTAIN VIEW · COMMUTE · RENTAL SCOUT</p>
          <h1>不再限定商圈，<br/><em>只找合适的山景房</em></h1>
        </div>
        <div className="hero-copy">
          <p>已放开商圈限制。现在按山景、到宙邦项目通勤、装修家具与防涝重新筛选；仍坚持整租、至少三房两卫、停车方便，并控制在每月3,500元以内。</p>
          <div className="verdict"><strong>新的看房顺序</strong><span>山景综合首看翡翠山；通勤首看龙光玖龙府；海伦虹兼顾两者；恒大悦龙台地势更高。</span></div>
        </div>
      </section>

      <section className="workspace">
        <aside className="list-panel">
          <div className="panel-head">
            <div><small>SHORTLIST</small><h2>候选小区</h2></div>
            <span className="count">{visible.length} 个</span>
          </div>
          <div className="filters" role="group" aria-label="筛选候选小区">
            {(["全部", "山景优先", "通勤优先"] as const).map((label) =>
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
            <span><i className="dot caution" />备选</span>
            <small>虚线仅表示方位，并非驾车路线</small>
          </div>
          <article className="map-card">
            <div className="map-card-top"><span>当前查看 · {selected.status}</span><a href={`https://www.amap.com/search?query=${encodeURIComponent(selected.name + " 惠州")}`} target="_blank" rel="noreferrer">高德导航 ↗</a></div>
            <h3>{selected.name}</h3>
            <div className="map-stats">
              <span><small>驾车</small>{selected.drive}</span>
              <span><small>参考租金</small>{selected.rent}</span>
              <span><small>估算高程</small>{selected.elevation} m</span>
            </div>
            <p>{selected.reason}</p>
          </article>
        </div>
      </section>

      <section className="detail-section">
        <div className="section-title"><p className="eyebrow">UNIT-LEVEL CHECK</p><h2>小区选对后，还要锁定具体房源</h2></div>
        <div className="notes-grid">
          <article><span>01 · 景观</span><h3>只收“山景实拍”</h3><p>让中介从客厅和主卧窗边拍连续视频，白天确认能看山；明确拒绝海景、湾景和纯楼景。</p></article>
          <article><span>02 · 朝向</span><h3>用指南针核方向</h3><p>优先朝西、北或西北且无遮挡的中高层房源；同一小区不同楼栋景观差异很大。</p></article>
          <article><span>03 · 装修</span><h3>看维护，不只看照片</h3><p>检查墙角霉斑、柜体受潮、空调异味、床垫和沙发状态；精装交付不等于当前保养好。</p></article>
          <article><span>04 · 全配</span><h3>家具清单写进合同</h3><p>床垫、沙发、餐桌、衣柜、窗帘、冰箱、洗衣机、热水器及每个房间空调逐项写入交接单。</p></article>
        </div>
      </section>

      <section className="risk-section">
        <div>
          <p className="eyebrow light">FLOOD CHECK</p>
          <h2>高程只是第一道筛选，<br/>不是“不淹”的保证</h2>
        </div>
        <div className="risk-copy">
          <p>候选中，恒大悦龙台估算高程约<strong>47m</strong>，翡翠山约<strong>33m</strong>，海伦虹约<strong>31m</strong>，防涝初筛更占优。但靠山不等于不积水，仍要检查地库入口、低点道路和每天通勤路线。</p>
          <div className="risk-links">
            <a href="https://m.huizhou.bendibao.com/news/111448.shtm" target="_blank" rel="noreferrer">官方易涝点整理 ↗</a>
            <a href="https://static.nfnews.com/content/202605/19/c12443813.html?enterColumnId=8102" target="_blank" rel="noreferrer">澳头排水整治 ↗</a>
            <a href="https://open-meteo.com/en/docs/elevation-api" target="_blank" rel="noreferrer">高程数据说明 ↗</a>
          </div>
        </div>
      </section>

      <section className="comparison">
        <div className="section-title"><p className="eyebrow">SIDE BY SIDE</p><h2>按新条件重新排序</h2></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>小区</th><th>通勤</th><th>房龄</th><th>户型／租金</th><th>山景潜力</th><th>装修家具</th><th>高程</th></tr></thead>
            <tbody>{candidates.map((item) => <tr key={item.id}>
              <td><strong>{item.name}</strong><small>{item.parking}</small></td>
              <td>{item.drive}<small>{item.distance}</small></td><td>{item.year}</td><td>{item.layout}<small>{item.rent}</small></td>
              <td>{item.view}</td><td>{item.furnish}</td><td>{item.elevation}m</td>
            </tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="sources">
        <details>
          <summary>数据口径与免责声明 <span>＋</span></summary>
          <p>通勤时间为高德道路的非实时区间估算；租金来自近期公开挂牌。山景、装修和家具是具体房源属性，网站只标注小区潜力与挂牌证据，签约前必须以现场和合同交接单为准。高程来自 Open‑Meteo 约90米分辨率数字高程，不代表具体楼栋或地库入口。</p>
          <div className="source-list">{candidates.map((item) => <a href={item.source} target="_blank" rel="noreferrer" key={item.id}>{item.name}房源参考 ↗</a>)}</div>
        </details>
      </section>

      <footer><span>大亚湾山景租房地图</span><p>建议顺序：翡翠山·珑悦 → 龙光玖龙府 → 海伦虹 → 恒大悦龙台</p><a href="#top">回到顶部 ↑</a></footer>
    </main>
  );
}
