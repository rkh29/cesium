import{_ as P}from"./main.CETTShQh.js";class S{constructor(t,a,n,o,d=null,r=null){this.blueGlobe=t,this.satelliteData=a,this.oe=n,this.detailedData=o,this.ui=d,this.controller=r,this.contentArea=null,this.chartInstance=null,this.isUPlotLoaded=!1}async initialize(t){this.contentArea=t,await this.loadUPlot(),this._buildUI(),this.checkAndLoadFromUrlParams()}async loadUPlot(){if(!this.isUPlotLoaded)try{const t=document.createElement("link");t.rel="stylesheet",t.href="https://cdn.jsdelivr.net/npm/uplot@1.6.24/dist/uPlot.min.css",document.head.appendChild(t);const a=await P(()=>import("https://cdn.jsdelivr.net/npm/uplot@1.6.24/dist/uPlot.esm.js"),[]);window.uPlot=a.default||a,this.isUPlotLoaded=!0,console.log("uPlot loaded successfully for altitude history")}catch(t){throw console.error("Failed to load uPlot:",t),t}}_buildUI(){var a,n;const t=((a=this.detailedData)==null?void 0:a.norad_id)||((n=this.satelliteData)==null?void 0:n.norad_id);this.contentArea.innerHTML=`
            <div class="space-y-4">
                <div class="bg-base-200/50 rounded-lg p-4">
                    <p class="text-sm text-base-content/90 leading-relaxed">
                        Track satellite orbital decay and altitude changes over time. 
                        Enter NORAD IDs to compare orbital lifetimes across multiple satellites.
                    </p>
                </div>
                
                <div class="bg-base-200 rounded-lg p-4 space-y-3">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">NORAD IDs (comma or newline separated)</span>
                        </label>
                        <textarea id="satellite-norads"
                                  class="textarea textarea-sm textarea-bordered resize-none"
                                  rows="2"
                                  placeholder="Paste or enter NORAD IDs:&#10;25544, 43013, 20580&#10;or paste multiple lines">${t||""}</textarea>
                    </div>
                    
                    <div class="flex gap-2">
                        <button id="load-altitude-data-btn" class="btn btn-sm btn-primary">
                            <svg class="w-4 h-4 refresh-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                            </svg>
                            <span class="loading loading-spinner loading-sm hidden"></span>
                            <span class="button-text">Plot</span>
                        </button>
                        
                        <button id="load-recent-data-btn" class="btn btn-sm btn-primary">
                            <svg class="w-4 h-4 recent-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span class="loading loading-spinner loading-sm hidden"></span>
                            <span class="button-text">Plot Recent</span>
                        </button>
                    </div>
                    
                    <div class="text-xs text-base-content/60">
                        <p><strong>Maximum 20 satellites</strong> per chart. Supports comma-separated or line-separated NORAD IDs.</p>
                    </div>
                </div>

                <div id="altitude-status" class="text-center py-8 hidden">
                    <div class="loading loading-spinner loading-md"></div>
                    <p class="text-sm text-base-content/70 mt-2">Loading altitude history...</p>
                </div>

                <div id="altitude-chart-container" class="bg-base-300/60 rounded-lg p-4 hidden">
                    <div id="altitude-chart" style="width: 100%; height: 400px;"></div>
                </div>
                
                <div id="altitude-summary" class="space-y-2 p-4 hidden">
                </div>
            </div>
        `,this._setupEventListeners()}checkAndLoadFromUrlParams(){const a=new URLSearchParams(window.location.search).get("norad");if(a){const n=this.contentArea.querySelector("#satellite-norads");n&&(n.value=a,setTimeout(()=>{console.log(`🚀 Auto-loading altitude data from URL parameter: ${a}`),this.loadAltitudeDataFromUI(!1)},100))}}_setupEventListeners(){const t=this.contentArea.querySelector("#load-altitude-data-btn"),a=this.contentArea.querySelector("#load-recent-data-btn"),n=this.contentArea.querySelector("#satellite-norads");t.addEventListener("click",()=>{this.loadAltitudeDataFromUI(!1)}),a.addEventListener("click",()=>{this.loadAltitudeDataFromUI(!0)}),n.addEventListener("keypress",o=>{o.key==="Enter"&&this.loadAltitudeDataFromUI(!1)})}async loadAltitudeDataFromUI(t=!1){const n=this.contentArea.querySelector("#satellite-norads").value.trim();if(!n){this.showToast("Please enter at least one NORAD ID","warning"),this.showEmptyChart();return}const o=n.split(/[,\n\r]/).map(d=>parseInt(d.trim())).filter(d=>!isNaN(d)&&d>0);if(o.length===0){this.showToast("No valid NORAD IDs provided","error"),this.showEmptyChart();return}o.length>20&&(this.showToast("Maximum 20 satellites allowed. Using first 20.","warning"),o.splice(20)),await this.loadAltitudeData(o,t)}async loadAltitudeData(t,a=!1){if(!t||t.length===0){this.showToast("No NORAD IDs provided","error");return}const n=this.contentArea.querySelector("#altitude-status"),o=this.contentArea.querySelector("#altitude-chart-container"),d=this.contentArea.querySelector("#altitude-summary"),r=a?this.contentArea.querySelector("#load-recent-data-btn"):this.contentArea.querySelector("#load-altitude-data-btn"),f=r==null?void 0:r.querySelector(a?".recent-icon":".refresh-icon"),u=r==null?void 0:r.querySelector(".loading-spinner"),c=r==null?void 0:r.querySelector(".button-text");n.classList.remove("hidden"),o.classList.add("hidden"),d.classList.add("hidden"),f&&f.classList.add("hidden"),u&&u.classList.remove("hidden"),c&&(c.textContent="Loading..."),r&&(r.disabled=!0);try{let g=`${this.blueGlobe.apiBaseUrl||"https://api.satellitemap.space"}/api/satellite-lifetime?norad_ids=${t.join(",")}`;a&&(g+="&days=90"),console.log(`📊 Fetching ${a?"recent (90 days)":"all"} altitude data for: ${t.join(", ")}`);const m=await fetch(g,{headers:this.blueGlobe.getAuthHeaders?this.blueGlobe.getAuthHeaders():{}});if(!m.ok)throw new Error(`HTTP ${m.status}: ${m.statusText}`);const y=await m.json();if(!y.success)throw new Error(y.error||"Failed to load altitude data");console.log(`✅ Loaded altitude data for ${y.satellite_count} satellites with ${y.total_data_points} data points`),y.total_data_points==0&&this.showToast("No altitude history available for this satellite","info"),n.classList.add("hidden"),o.classList.remove("hidden"),d.classList.remove("hidden"),this.renderChart(y)}catch(h){console.error("Failed to load altitude data:",h),this.showToast(`Failed to load data: ${h.message}`,"error"),n.innerHTML=`
                <div class="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h3 class="font-bold">Failed to load altitude data</h3>
                        <div class="text-xs">${h.message}</div>
                    </div>
                </div>
            `}finally{f&&f.classList.remove("hidden"),u&&u.classList.add("hidden"),c&&(c.textContent=a?"Plot Recent":"Plot"),r&&(r.disabled=!1)}}renderChart(t){const a=this.contentArea.querySelector("#altitude-chart");if(!a||!window.uPlot||!t.satellites||t.satellites.length===0)return;this.chartInstance&&(this.chartInstance._resizeListener&&window.removeEventListener("resize",this.chartInstance._resizeListener),this.chartInstance.destroy(),this.chartInstance=null);const n=new Set;t.satellites.forEach(s=>{s.altitude_data.forEach(e=>n.add(e.date))});const o=Array.from(n).sort(),d=o.map(s=>Math.floor(new Date(s).getTime()/1e3)),r=[{label:"Date",value:(s,e,p,_)=>e==null?"----------":new Date(e*1e3).toISOString().split("T")[0]}],f=[d],u=["#3B82F6","#EF4444","#10B981","#F59E0B","#8B5CF6","#EC4899","#06B6D4","#84CC16","#F97316","#6366F1"];if(t.satellites.length===1){const s=t.satellites[0];r.push({label:`Apogee (${s.norad_id})`,stroke:"#EF4444",width:2,points:{show:!1},scale:"altitude",gaps:(l,i,k,A)=>!0,value:(l,i)=>i==null?"---.-- km":i.toFixed(2)+" km"}),r.push({label:`Perigee (${s.norad_id})`,stroke:"#10B981",width:2,points:{show:!1},scale:"altitude",gaps:(l,i,k,A)=>!0,value:(l,i)=>i==null?"---.-- km":i.toFixed(2)+" km"}),r.push({label:`Period (${s.norad_id})`,stroke:"#F59E0B",width:2,points:{show:!1},scale:"period",gaps:(l,i,k,A)=>!0,value:(l,i)=>i==null?"---.-- min":i.toFixed(2)+" min"});const e=new Array(d.length).fill(null),p=new Array(d.length).fill(null),_=new Array(d.length).fill(null);s.altitude_data.forEach(l=>{const i=o.indexOf(l.date);if(i>=0&&(l.h_apogee_km!==void 0&&(e[i]=l.h_apogee_km),l.h_perigee_km!==void 0&&(p[i]=l.h_perigee_km),l.mean_motion_rev_day!==void 0&&l.mean_motion_rev_day>0)){const k=1440/l.mean_motion_rev_day;_[i]=k}}),f.push(e),f.push(p),f.push(_)}else t.satellites.forEach((s,e)=>{const p=u[e%u.length];r.push({label:`${s.norad_id}`,stroke:p,width:1,points:{show:!1},gaps:(l,i,k,A)=>!0,value:(l,i)=>i==null?"---.-- km":i.toFixed(2)+" km"});const _=new Array(d.length).fill(null);s.altitude_data.forEach(l=>{const i=o.indexOf(l.date);i>=0&&(_[i]=l.altitude_km)}),f.push(_)});let c=1/0,h=-1/0,g=1/0,m=-1/0;t.satellites.length===1?t.satellites[0].altitude_data.forEach(e=>{if(e.h_apogee_km!==void 0&&e.h_apogee_km<c&&(c=e.h_apogee_km),e.h_apogee_km!==void 0&&e.h_apogee_km>h&&(h=e.h_apogee_km),e.h_perigee_km!==void 0&&e.h_perigee_km<c&&(c=e.h_perigee_km),e.h_perigee_km!==void 0&&e.h_perigee_km>h&&(h=e.h_perigee_km),e.mean_motion_rev_day!==void 0&&e.mean_motion_rev_day>0){const p=1440/e.mean_motion_rev_day;p<g&&(g=p),p>m&&(m=p)}}):t.satellites.forEach(s=>{s.altitude_range&&(s.altitude_range.min<c&&(c=s.altitude_range.min),s.altitude_range.max>h&&(h=s.altitude_range.max))});const x=(h-c)*.05;c=Math.floor(c-x),h=Math.ceil(h+x);const b=t.satellites.length===1?`Orbital Parameters - ${t.satellites[0].norad_id}`:"Mean semi-major-axis–derived altitude - history";let v,w;t.satellites.length===1&&g!==1/0&&m!==-1/0?(v={x:{time:!0},altitude:{auto:!1,range:[c,h]},period:{auto:!1,range:[g,m]}},w=[{stroke:"#fff",grid:{stroke:"#444",width:1},ticks:{stroke:"#fff"}},{scale:"altitude",label:"Altitude (km)",stroke:"#fff",grid:{stroke:"#444",width:1},ticks:{stroke:"#fff"}},{side:1,scale:"period",label:"Period (minutes)",stroke:"#F59E0B",grid:{show:!1},ticks:{stroke:"#F59E0B"},size:50}]):(v={x:{time:!0},y:{auto:!1,range:[c,h]}},w=[{stroke:"#fff",grid:{stroke:"#444",width:1},ticks:{stroke:"#fff"}},{label:"Altitude (km)",stroke:"#fff",grid:{stroke:"#444",width:1},ticks:{stroke:"#fff"}}]);const D=t.satellites.length===1&&g!==1/0&&m!==-1/0?[10,10,40,10]:[10,10,40,10],I={width:a.clientWidth,height:400,padding:D,title:b,scales:v,axes:w,series:r,legend:{show:!0,live:!0,markers:{show:!1},values:[]},cursor:{drag:{x:!0,y:!1}},hooks:{drawClear:[s=>{const e=s.ctx,{left:p,top:_,width:l,height:i}=s.bbox;e.save(),e.fillStyle="#000000",e.fillRect(p,_,l,i),e.restore()}],ready:[s=>{const e=s.root.querySelector(".u-legend");e&&(e.style.fontFamily='monospace, "Courier New", Courier',e.style.fontSize="12px",e.style.lineHeight="0.8",e.style.paddingBottom="3em",e.querySelectorAll(".u-series").forEach((_,l)=>{if(_.style.lineHeight="0.8",_.style.padding="0",_.style.margin="0",l>0&&s.series[l]){const i=_.querySelector(".u-label");i&&(i.style.color=s.series[l].stroke,i.style.fontWeight="bold")}}))}]}};try{const s=a.querySelector(".uplot");if(s&&s.remove(),this.chartInstance=new window.uPlot(I,f,a),this.chartInstance&&!this.chartInstance._resizeListener){const e=()=>{this.chartInstance&&a.clientWidth>0&&a.clientHeight>0&&this.chartInstance.setSize({width:a.clientWidth,height:a.clientHeight})};window.addEventListener("resize",e),this.chartInstance._resizeListener=e}}catch(s){console.error("Failed to create altitude chart:",s),this.showToast("Failed to create chart","error")}}renderSummary(t){var o,d,r,f;const a=this.contentArea.querySelector("#altitude-summary");if(!a||!t.satellites)return;let n=`
            <div class="bg-base-200/50 rounded-lg p-4">
                <h4 class="font-semibold mb-3">Altitude Data Summary</h4>
                <div class="overflow-x-auto">
                    <table class="table table-zebra table-compact text-xs">
                        <thead>
                            <tr>
                                <th>Satellite</th>
                                <th>Data Points</th>
                                <th>Date Range</th>
                                <th>Alt Range (km)</th>
                                <th>Current Trend</th>
                            </tr>
                        </thead>
                        <tbody>
        `;t.satellites.forEach(u=>{var m,y,x,b,v,w;const c=this.calculateTrend(u.altitude_data),h=c>0?"↗️":c<0?"↘️":"→",g=c>0?"text-green-400":c<0?"text-red-400":"text-gray-400";n+=`
                <tr>
                    <td class="font-mono">${u.norad_id}</td>
                    <td>${u.data_points.toLocaleString()}</td>
                    <td class="text-xs">${(m=u.date_range)==null?void 0:m.start} to ${(y=u.date_range)==null?void 0:y.end}</td>
                    <td>${(b=(x=u.altitude_range)==null?void 0:x.min)==null?void 0:b.toFixed(1)} - ${(w=(v=u.altitude_range)==null?void 0:v.max)==null?void 0:w.toFixed(1)}</td>
                    <td class="${g}">${h} ${Math.abs(c).toFixed(2)} km/day</td>
                </tr>
            `}),n+=`
                        </tbody>
                    </table>
                </div>
                <div class="text-xs text-base-content/60 mt-3">
                    <p><strong>Total Data Points:</strong> ${t.total_data_points.toLocaleString()}</p>
                    <p><strong>Altitude Range:</strong> ${(d=(o=t.altitude_range)==null?void 0:o.min)==null?void 0:d.toFixed(1)} - ${(f=(r=t.altitude_range)==null?void 0:r.max)==null?void 0:f.toFixed(1)} km</p>
                </div>
            </div>
        `,a.innerHTML=n}calculateTrend(t){if(!t||t.length<2)return 0;const a=t.length,n=Math.max(1,Math.floor(a*.1)),o=t.slice(0,n),d=t.slice(-n),r=o.reduce((g,m)=>g+m.altitude_km,0)/o.length,f=d.reduce((g,m)=>g+m.altitude_km,0)/d.length,u=new Date(o[0].date),h=(new Date(d[d.length-1].date)-u)/(1e3*60*60*24);return h>0?(f-r)/h:0}showEmptyChart(){const t=this.contentArea.querySelector("#altitude-chart-container"),a=this.contentArea.querySelector("#altitude-summary");this.contentArea.querySelector("#altitude-status").classList.add("hidden"),t.classList.remove("hidden"),a.classList.add("hidden");const o=this.contentArea.querySelector("#altitude-chart");o&&(this.chartInstance&&(this.chartInstance._resizeListener&&window.removeEventListener("resize",this.chartInstance._resizeListener),this.chartInstance.destroy(),this.chartInstance=null),o.innerHTML="")}showToast(t,a="info"){this.ui&&typeof this.ui._showToast=="function"?this.ui._showToast(t,a):console.log(`${a.toUpperCase()}: ${t}`)}}export{S as AltitudeHistory};
