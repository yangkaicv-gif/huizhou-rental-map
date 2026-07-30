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
  wanda: string;
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
const wanda = { lat: 22.755273, lng: 114.479920 };

const candidates: Candidate[] = [
  {
    id: 1, name: "翡翠山·珑悦", status: "首选", lat: 22.757952, lng: 114.486566,
    drive: "约28–35分钟", distance: "约18km", wanda: "约0.8km", rent: "约¥1,600–2,200", layout: "三房两卫 约90–96㎡",
    year: "2017–2020", elevation: 33, parking: "地下停车",
    view: "山景潜力高", furnish: "精装全配房源明确",
    reason: "万达与益田双商业就在旁边，项目依山；近期有精装三房两卫、家私家电齐全的挂牌。",
    caveat: "只看有客厅和主卧窗外山景实拍的具体房源，排除海景与纯楼景。",
    source: "https://huizhou.zf.58.com/ssc-67/dayawan/",
  },
  {
    id: 2, name: "灿邦珑廷", status: "推荐", lat: 22.7540, lng: 114.4818,
    drive: "约30–36分钟", distance: "约19km", wanda: "约0.3km", rent: "约¥2,000–3,000", layout: "三房两卫 约102–128㎡",
    year: "2021–2023", elevation: 34, parking: "地下停车 · 车位充足",
    view: "中等，筛北／西北向", furnish: "带装修，家具逐套确认",
    reason: "万达斜对面，位置最贴合商圈，房龄也新，并有三房两卫户型。",
    caveat: "小区不等于每套都能看山；必须筛中高层朝向，并把家具清单写入合同。",
    source: "https://hui.fang.anjuke.com/loupan/463306.html",
  },
  {
    id: 3, name: "恒大悦龙台", status: "推荐", lat: 22.753241, lng: 114.465031,
    drive: "约32–40分钟", distance: "约21km", wanda: "约1.5km", rent: "约¥1,500–2,200", layout: "三房两卫 约94–108㎡",
    year: "2020–2022", elevation: 47, parking: "地下停车",
    view: "山景潜力较高", furnish: "豪装／精装全配房源明确",
    reason: "三房两卫、精装修、家电齐全的挂牌较明确，估算高程在新候选中最高。",
    caveat: "到工作地略超理想30分钟，但仍在1小时上限内；先确认早高峰路线。",
    source: "https://hui.zu.anjuke.com/haozhuang-zufang/dayawanqua/",
  },
  {
    id: 4, name: "三远大爱城", status: "备选", lat: 22.754852, lng: 114.495994,
    drive: "约26–33分钟", distance: "约17km", wanda: "约1.7km", rent: "约¥1,600–2,200", layout: "三房两卫 约89–100㎡",
    year: "2017–2020", elevation: 23, parking: "地下停车",
    view: "中等，逐套筛选", furnish: "精装、家私电器齐全",
    reason: "近期有三房两卫、家私电器齐全约1600元的挂牌，更靠近工作地方向。",
    caveat: "排除朝海、遮挡和维护差的房源，优先有连续山景视频的中高层。",
    source: "https://www.fang.com/houses/zf_49611huizhou/g23/",
  },
  {
    id: 5, name: "新华联广场", status: "谨慎", lat: 22.746568, lng: 114.526832,
    drive: "约21分钟", distance: "13.1km", wanda: "约5km", rent: "约¥1,400–1,800", layout: "三房两卫 约94–97㎡",
    year: "2020新楼栋", elevation: 10, parking: "地下停车",
    view: "以城市／园林景为主", furnish: "精装拎包入住房源多",
    reason: "通勤和全配房源都不错，但不在万达核心圈，也不是稳定山景盘。",
    caveat: "只有找到明确山景实拍且愿意牺牲万达距离时再考虑。",
    source: "https://huizhou.leyoujia.com/xq/detail/zf/15620/",
  },
  {
    id: 6, name: "龙光玖龙府", status: "谨慎", lat: 22.751192, lng: 114.537549,
    drive: "约18分钟", distance: "11.4km", wanda: "约6km", rent: "约¥1,100–2,000", layout: "三房两卫 约89–96㎡",
    year: "2020", elevation: 16, parking: "地下车库 · 约1:1",
    view: "偏城市景，山景需碰房源", furnish: "精装带家私家电房源明确",
    reason: "通勤最稳妥，但已不符合优先万达商圈的新偏好，只保留作兜底。",
    caveat: "仅在万达周边找不到合适山景全配房源时考虑。",
    source: "https://huizhou.leyoujia.com/xq/detail/772077.html",
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
      const map = L.map(mapElement.current, { zoomControl: false }).setView([22.755, 114.525], 12);
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
      const wandaIcon = L.divIcon({
        className: "project-marker-wrap",
        html: '<div class="project-marker wanda-marker"><span>万达</span></div>',
        iconSize: [52, 52], iconAnchor: [26, 26],
      });
      L.marker([wanda.lat, wanda.lng], { icon: wandaIcon })
        .addTo(map)
        .bindPopup("<b>惠州大亚湾万达广场</b><br/>龙海二路38号");
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
        <div className="criteria"><span>≤ ¥3,500</span><i />三房两卫<i />万达商圈<i />山景不看海<i />精装全配</div>
        <a className="project-link" href="https://www.amap.com/place/B0L66UCAGP" target="_blank" rel="noreferrer">在高德打开工作地 ↗</a>
      </header>

      <section className="hero" id="top">
        <div>
          <p className="eyebrow">WANDA · MOUNTAIN VIEW · RENTAL SCOUT</p>
          <h1>住在万达旁，<br/><em>推窗尽量见山</em></h1>
        </div>
        <div className="hero-copy">
          <p>新条件已加入：优先大亚湾万达商圈，只看山景或城市／园林景、排除海景；同时要求装修较好、家具家电齐全、三房两卫和停车方便。</p>
          <div className="verdict"><strong>更新后的顺序</strong><span>首看翡翠山·珑悦；再看万达对面的灿邦珑廷；恒大悦龙台地势更高；大爱城是性价比全配备选。</span></div>
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
                  <span className="card-meta">{item.drive}<i />距万达{item.wanda}<i />高程约 {item.elevation}m</span>
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
            <span><i className="dot wanda" />万达</span>
            <span><i className="dot best" />优先</span>
            <span><i className="dot caution" />谨慎</span>
            <small>虚线仅表示方位，并非驾车路线</small>
          </div>
          <article className="map-card">
            <div className="map-card-top"><span>当前查看 · {selected.status}</span><a href={`https://www.amap.com/search?query=${encodeURIComponent(selected.name + " 惠州")}`} target="_blank" rel="noreferrer">高德导航 ↗</a></div>
            <h3>{selected.name}</h3>
            <div className="map-stats">
              <span><small>驾车</small>{selected.drive}</span>
              <span><small>距万达</small>{selected.wanda}</span>
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
          <p>新候选中，恒大悦龙台估算高程约<strong>47m</strong>，翡翠山约<strong>33m</strong>，灿邦珑廷约<strong>34m</strong>，优于原先部分低洼候选。但靠山不等于不积水，仍要检查地库入口和每天通勤路线。</p>
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
            <thead><tr><th>小区</th><th>通勤／万达</th><th>房龄</th><th>户型／租金</th><th>山景潜力</th><th>装修家具</th><th>高程</th></tr></thead>
            <tbody>{candidates.map((item) => <tr key={item.id}>
              <td><strong>{item.name}</strong><small>{item.parking}</small></td>
              <td>{item.drive}<small>距万达{item.wanda}</small></td><td>{item.year}</td><td>{item.layout}<small>{item.rent}</small></td>
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

      <footer><span>大亚湾万达租房地图</span><p>建议顺序：翡翠山·珑悦 → 灿邦珑廷 → 恒大悦龙台 → 三远大爱城</p><a href="#top">回到顶部 ↑</a></footer>
    </main>
  );
}
