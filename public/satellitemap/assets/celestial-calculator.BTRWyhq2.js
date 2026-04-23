import{p as D,t as R,q as z,r as N,s as q,u as j,v as Q,w as U,x as X,y as E,O as V,M as J,E as K,T as tt}from"./main.CETTShQh.js";class at{constructor(t,s,e,a,o=null,l=null){this.blueGlobe=t,this.satelliteData=s,this.oe=e,this.detailedData=a,this.ui=o,document.celestialCalculator=this,this.controller=l,this.contentArea=null,this.satrec=null,this.observerGd=null,this.isCalculating=!1,this.results=[],this.config={searchDays:14,minElevation:5,maxDistanceKm:250}}async _reinit(){if(!this.locationSet){const t=this.blueGlobe.preferences.homeLat,s=this.blueGlobe.preferences.homeLon;this.locationSet=!!(t&&s),this.homeLat=t||0,this.homeLon=s||0,this.initializeObserver(this.homeLat,this.homeLon)}}async initialize(t){this.contentArea=t,window.celestialCalculator=this;const s=this.blueGlobe.preferences.homeLat,e=this.blueGlobe.preferences.homeLon;this.locationSet=!!(s&&e),this.homeLat=s||0,this.homeLon=e||0,this.initializeObserver(this.homeLat,this.homeLon),this.initializeSatellite(),this._buildUI()}initializeObserver(t,s){this.observerGd={longitude:D(s),latitude:D(t),height:0}}_setup(t,s){let e,a;if(t.tleData&&t.tleData.raw_tle)e=t.tleData.raw_tle.tle_line1,a=t.tleData.raw_tle.tle_line2;else if(t.tle_line1&&t.tle_line2)e=t.tle_line1,a=t.tle_line2;else throw console.error("No valid tle data found"),new Error("No valid TLE data found in normalized satellite data");if(console.log(`Using normalized satellite data for ${t.sat_name} (${s})`),this.satrec=R(e,a),!this.satrec)throw console.error("twoline2satrec failed"),new Error("Failed to parse TLE data from normalized satellite");this.tle1=e,this.tle2=a,this.normalizedSatellite=t}initializeSatellite(){var a,o,l,n;let t=this.blueGlobe.getLoadedSatellites();const s=((a=this.detailedData)==null?void 0:a.norad_id)||((o=this.satelliteData)==null?void 0:o.norad_id)||25544;this.usingDefaultSatellite=!((l=this.detailedData)!=null&&l.norad_id)&&!((n=this.satelliteData)!=null&&n.norad_id);let e=t.find(i=>i.norad_id===s);e?this._setup(e,s):(console.warn("going to load 25544"),this.blueGlobe.loadsats(null,null,!1,[25544]).then(i=>{console.warn("found 25544"),this.blueGlobe._deploySatelliteData(i),t=this.blueGlobe.getLoadedSatellites(),e=t.find(r=>r.norad_id===s),this._setup(e,s)}))}_buildUI(){this.contentArea.innerHTML=`
            <div class="space-y-4">
                <div class="py-4" id="celestial-intro-message">
                    <h2 class="text-lg font-semibold text-white mb-2">Celestial Transit Calculator</h2>
                    <p class="text-sm text-gray-400 leading-relaxed max-w-2xl">
                        Calculate when a satellite will cross the face of a celestial body, near your location.
                        The calculation runs in your browser using SGP4 propagation and astronomical ephemerides.
                    </p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <select id="satellite-select" class="select select-sm select-bordered">
                        ${this.buildSatelliteOptions()}
                    </select>
                    <span class="text-xs text-gray-500">or</span>
                    <input type="number" id="norad-id-input" class="input input-sm input-bordered w-28" placeholder="NORAD ID">
                    <select id="celestial-body" class="select select-sm select-bordered">
                        <option value="sun">Sun</option>
                        <option value="moon">Moon</option>
                        <option value="jupiter">Jupiter</option>
                        <option value="mars">Mars</option>
                        <option value="saturn">Saturn</option>
                        <option value="venus">Venus</option>
                    </select>
                    <button id="celestial-refresh-btn" class="btn btn-sm btn-primary">
                        <svg class="w-4 h-4 refresh-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                        <span class="loading loading-spinner loading-sm hidden"></span>
                        <span class="button-text">Calculate</span>
                    </button>
                    <div class="flex-1"></div>
                    <button id="celestial-settings-btn" class="btn btn-sm btn-ghost text-gray-500" title="Advanced settings">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                    </button>
                </div>
                
                <!-- Removed large info banner - calculation is fast enough -->

                <div id="celestial-settings-panel" class="hidden bg-base-200 rounded-lg p-4 space-y-3">
                    <h4 class="font-semibold">Search Settings</h4>
                    
                    <!-- Calculation Mode Section -->
                    <div class="flex flex-wrap gap-4">
                        <label class="form-control min-w-0 flex-1">
                            <div class="label">
                                <span class="label-text">Calculation Mode</span>
                            </div>
                            <select id="calc-mode" class="select select-sm select-bordered">
                                <option value="predict">Predict</option>
                                <option value="from-here">From Here</option>
                            </select>
                        </label>
                        <label class="form-control min-w-0 flex-1">
                            <div class="label">
                                <span class="label-text">UTC Time (enter as UTC)</span>
                            </div>
                            <input type="datetime-local" id="utc-time" class="input input-sm input-bordered" 
                                   step="1" disabled>
                        </label>
                        <!-- Body selector moved to toolbar -->
                    </div>
                    
                    <div class="flex flex-wrap gap-4">
                        <label class="form-control min-w-0 flex-1">
                            <div class="label">
                                <span class="label-text">Search Days</span>
                            </div>
                            <input type="number" id="search-days" class="input input-sm input-bordered" 
                                   value="${this.config.searchDays}" min="1" max="30">
                        </label>
                        <label class="form-control min-w-0 flex-1">
                            <div class="label">
                                <span class="label-text">Max Distance (km)</span>
                            </div>
                            <input type="number" id="max-distance" class="input input-sm input-bordered" 
                                   value="${this.config.maxDistanceKm}" min="50" max="1000" step="50">
                        </label>
                        <!-- Satellite selector moved to toolbar -->
                    </div>
                    
                    <!-- Location Override Section -->
                    <div class="divider divider-start text-xs">Location Override (Optional)</div>
                    <div class="flex flex-wrap gap-4">
                        <label class="form-control min-w-0 flex-1">
                            <div class="label">
                                <span class="label-text">Latitude (°)</span>
                            </div>
                            <input type="number" id="override-lat" class="input input-sm input-bordered [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                   placeholder="Leave empty for home: ${this.homeLat.toFixed(6)}" min="-90" max="90" step="0.000001">
                        </label>
                        <label class="form-control min-w-0 flex-1">
                            <div class="label">
                                <span class="label-text">Longitude (°)</span>
                            </div>
                            <input type="number" id="override-lon" class="input input-sm input-bordered [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                   placeholder="Leave empty for home: ${this.homeLon.toFixed(6)}" min="-180" max="180" step="0.000001">
                        </label>
                        <label class="form-control min-w-0 flex-1">
                            <div class="label">
                                <span class="label-text">Altitude (m)</span>
                            </div>
                            <input type="number" id="override-alt" class="input input-sm input-bordered" 
                                   placeholder="0" min="-500" max="9000" step="1">
                        </label>
                    </div>
                    
                    <div class="text-xs text-base-content/60 mt-2">
                        <p><strong>Predict Mode:</strong> Search future conjunctions using simulation time</p>
                        <p><strong>From Here Mode:</strong> Find optimal time for conjunction from fixed location</p>
                        <p><strong>Search Days:</strong> How many days ahead to search (Predict mode only)</p>
                        <p><strong>Max Distance:</strong> Maximum distance from home to optimal viewing location (Predict mode only)</p>
                        <p><strong>Location Override:</strong> Use custom coordinates and altitude instead of your home location</p>
                        <p class="text-warning mt-1">Note: Distance filtering will be implemented with precise backend calculations</p>
                    </div>
                    <button id="apply-settings-btn" class="btn btn-sm btn-primary">Apply Settings</button>
                </div>
                
                <div id="celestial-status" class="text-center py-8 hidden">
                    <div class="loading loading-spinner loading-md"></div>
                    <p class="text-sm text-base-content/70 mt-2">Searching for celestial transits...</p>
                </div>

                    <!-- Transit Gallery -->
                    <div id="transit-gallery" class="w-full border border-gray-700 rounded-lg shadow-lg shadow-black/30 p-4">
                        <h3 class="text-sm font-semibold text-white mb-3">Transit Museum</h3>
                        <div class="transit-gallery overflow-x-auto">
                            <div class="flex space-x-4 pb-2" style="min-width: fit-content;">

                                <!-- Ed Morana Lunar Transit -->
                                <div class="transit-item flex-shrink-0 cursor-pointer bg-gray-800/50 rounded-lg p-2 hover:bg-gray-700/60 transition-colors border border-gray-700/50"
                                     onclick="celestialCalculator.loadTransitSettings('2006-10-06T07:45:31.000Z', 37.69613, -121.398181, 0, 'moon', 25544)">
                                    <img src="/images/transits/transit1.jpeg"
                                         alt="ISS Lunar Transit by Ed Morana"
                                         class="w-20 h-auto rounded mb-2 mx-auto"
                                         style="max-width: 80px;">
                                    <div class="text-xs text-center">
                                        <div class="font-semibold text-white">ISS Lunar Transit</div>
                                        <div class="text-gray-400">Oct 6, 2006</div>
                                        <div class="text-gray-400">📸 <a href="https://pictures.ed-morana.com/ISSTransits/#ISSLunarTransits"
                                             target="_blank" class="text-blue-400 hover:text-blue-300">Ed Morana</a></div>
                                    </div>
                                </div>

                                <!-- Athens Sun transit -->
                                <div class="transit-item flex-shrink-0 cursor-pointer bg-gray-800/50 rounded-lg p-2 hover:bg-gray-700/60 transition-colors border border-gray-700/50"
                                     onclick="celestialCalculator.loadTransitSettings('2010-05-25T07:43:55.000Z',
                                     38.26924417, 23.684344, 0, 'sun', 25544)">
                                     <!-- 38.328045, 23.599842, -->
                                    <img src="/images/transits/transit2.jpeg"
                                         alt="ISS Sun Transit by A.Ayiomamitis"
                                         class="w-20 h-auto rounded mb-2 mx-auto"
                                         style="max-width: 80px;">
                                    <div class="text-xs text-center">
                                        <div class="font-semibold text-white">ISS Sun Transit</div>
                                        <div class="text-gray-400">May 15, 2010</div>
                                        <div class="text-gray-400">📸 <a href="https://www.perseus.gr/Astro-Sat-Trans-2010-05-25.htm"
                                             target="_blank" class="text-blue-400 hover:text-blue-300">A.Ayiomamitis</a></div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                
                <div id="celestial-results" class="space-y-4 hidden">
                    <!-- Results will be populated here -->
                </div>
            </div>
        `,this._setupEventListeners()}buildSatelliteOptions(){var o,l,n,i;const t=((o=this.detailedData)==null?void 0:o.sat_name)||((l=this.satelliteData)==null?void 0:l.name)||"ISS",s=((n=this.detailedData)==null?void 0:n.norad_id)||((i=this.satelliteData)==null?void 0:i.norad_id)||25544,e=[{name:"ISS",noradId:25544},{name:"CSS (Tiangong)",noradId:43013},{name:"HST (Hubble)",noradId:20580}];let a=`<option value="current">${t} (Current)</option>`;return e.forEach(r=>{r.noradId!==s&&(a+=`<option value="${r.noradId}">${r.name}</option>`)}),a}loadTransitSettings(t,s,e,a,o,l){const n=this.contentArea.querySelector("#calc-mode");n&&(n.value="from-here",n.dispatchEvent(new Event("change")));const i=this.contentArea.querySelector("#utc-time");if(i){const p=new Date(t),v=p.getUTCFullYear(),f=String(p.getUTCMonth()+1).padStart(2,"0"),b=String(p.getUTCDate()).padStart(2,"0"),w=String(p.getUTCHours()).padStart(2,"0"),m=String(p.getUTCMinutes()).padStart(2,"0"),S=String(p.getUTCSeconds()).padStart(2,"0"),y=`${v}-${f}-${b}T${w}:${m}:${S}`;i.value=y}const r=this.contentArea.querySelector("#celestial-body");r&&(r.value=o);const c=this.contentArea.querySelector("#override-lat"),h=this.contentArea.querySelector("#override-lon"),d=this.contentArea.querySelector("#override-alt");c&&(c.value=s),h&&(h.value=e),d&&(d.value=a);const u=this.contentArea.querySelector("#celestial-settings-panel"),g=this.contentArea.querySelector("#apply-settings-btn");u&&u.classList.contains("hidden")&&u.classList.remove("hidden"),setTimeout(()=>{g&&g.click()},1e3),console.log(`Loaded transit settings: ${t}, ${s}°, ${e}°, ${a}m, ${o}, NORAD ${l}`)}_setupEventListeners(){const t=this.contentArea.querySelector("#celestial-settings-btn"),s=this.contentArea.querySelector("#celestial-settings-panel"),e=this.contentArea.querySelector("#celestial-refresh-btn");t.addEventListener("click",()=>{const i=s.classList.contains("hidden");s.classList.toggle("hidden"),i?(e.disabled=!0,e.classList.add("opacity-50","cursor-not-allowed")):(e.disabled=!1,e.classList.remove("opacity-50","cursor-not-allowed"))}),e.addEventListener("click",()=>{this.calculateCelestialTransits()}),this.contentArea.querySelector("#apply-settings-btn").addEventListener("click",()=>{try{this.updateSettings(),s.classList.add("hidden"),e.disabled=!1,e.classList.remove("opacity-50","cursor-not-allowed"),this.calculateCelestialTransits()}catch(i){console.error("Settings validation failed:",i)}});const o=this.contentArea.querySelector("#satellite-select"),l=this.contentArea.querySelector("#norad-id-input");o.addEventListener("change",()=>{l.value="",this._switchSatellite(o.value==="current"?null:parseInt(o.value))}),l.addEventListener("change",()=>{const i=parseInt(l.value);i>0&&(o.value="",this._switchSatellite(i))}),this.contentArea.querySelector("#calc-mode").addEventListener("change",()=>{this.handleCalculationModeChange()}),this.handleCalculationModeChange()}async _switchSatellite(t){var s,e;if(!t){const a=((s=this.detailedData)==null?void 0:s.norad_id)||((e=this.satelliteData)==null?void 0:e.norad_id)||25544,l=this.blueGlobe.getLoadedSatellites().find(n=>n.norad_id===a);l&&this._setup(l,a);return}try{let a=this.blueGlobe.getLoadedSatellites(),o=a.find(l=>l.norad_id===t);if(!o){const l=await this.blueGlobe.loadsats(null,null,!1,[t]);this.blueGlobe._deploySatelliteData(l),a=this.blueGlobe.getLoadedSatellites(),o=a.find(n=>n.norad_id===t)}o?this._setup(o,t):this.showToast(`Satellite ${t} not found`,"error")}catch(a){console.error("Failed to switch satellite:",a),this.showToast(`Failed to load satellite ${t}`,"error")}}updateSettings(){try{this.config.searchDays=parseInt(this.contentArea.querySelector("#search-days").value),this.config.minElevation=0,this.config.maxDistanceKm=parseFloat(this.contentArea.querySelector("#max-distance").value),this.config.calculationMode=this.contentArea.querySelector("#calc-mode").value,this.config.utcTime=this.contentArea.querySelector("#utc-time").value,this.config.celestialBody=this.contentArea.querySelector("#celestial-body").value;const t=this.contentArea.querySelector("#norad-id-input"),s=this.contentArea.querySelector("#satellite-select");this.config.selectedSatellite=t!=null&&t.value&&parseInt(t.value)>0?t.value:(s==null?void 0:s.value)||"current";const e=this.contentArea.querySelector("#override-lat").value,a=this.contentArea.querySelector("#override-lon").value,o=this.contentArea.querySelector("#override-alt").value;if(e||a||o){if(!e||!a)throw new Error("Both latitude and longitude must be provided for location override");const l=parseFloat(e),n=parseFloat(a),i=o?parseFloat(o):0;if(isNaN(l)||l<-90||l>90)throw new Error("Latitude must be between -90 and 90 degrees");if(isNaN(n)||n<-180||n>180)throw new Error("Longitude must be between -180 and 180 degrees");if(o&&(isNaN(i)||i<-500||i>9e3))throw new Error("Altitude must be between -500 and 9000 meters");this.homeLat=l,this.homeLon=n,this.homeAlt=i}else this.homeLat=this.blueGlobe.preferences.homeLat,this.homeLon=this.blueGlobe.preferences.homeLon,this.homeAlt=0}catch(t){throw this.showToast(t.message,"error"),t}}handleCalculationModeChange(){const t=this.contentArea.querySelector("#calc-mode").value,s=this.contentArea.querySelector("#utc-time"),e=this.contentArea.querySelector("#search-days"),a=this.contentArea.querySelector("#max-distance");if(t==="predict"){s.disabled=!0,e.disabled=!1,a.disabled=!1;const o=this.blueGlobe.wallclock?new Date(this.blueGlobe.wallclock.now()):new Date;s.value=this.formatDateTimeLocal(o)}else if(t==="from-here"){s.disabled=!1,e.disabled=!0,a.disabled=!0;const o=new Date;s.value=this.formatDateTimeLocal(o)}}formatDateTimeLocal(t){const s=t.getUTCFullYear(),e=String(t.getUTCMonth()+1).padStart(2,"0"),a=String(t.getUTCDate()).padStart(2,"0"),o=String(t.getUTCHours()).padStart(2,"0"),l=String(t.getUTCMinutes()).padStart(2,"0"),n=String(t.getUTCSeconds()).padStart(2,"0");return`${s}-${e}-${a}T${o}:${l}:${n}`}async calculateCelestialTransits(){if(this.isCalculating)return;const t=this.contentArea.querySelector("#calc-mode").value;this.config.calculationMode=t,this.config.celestialBody=this.contentArea.querySelector("#celestial-body").value,this.config.searchDays=parseInt(this.contentArea.querySelector("#search-days").value)||this.config.searchDays,this.config.maxDistanceKm=parseFloat(this.contentArea.querySelector("#max-distance").value)||this.config.maxDistanceKm;const s=this.contentArea.querySelector("#celestial-status");if(this._reinit(),t==="predict"&&!this.locationSet){this.showToast("Please set Home in settings to predict nearby transits","info"),s.classList.remove("hidden"),s.innerHTML=`
                <p class="text-sm text-base-content/70 text-center py-3">To calculate transits of a satellite over sun or moon near your location, please <a href="#" onclick="window.appRouter?.navigate('/settings'); return false;" class="text-blue-400 hover:text-blue-300 underline">set your home in Settings</a></p>
            `;return}this.isCalculating=!0;const e=this.contentArea.querySelector("#celestial-refresh-btn"),a=e==null?void 0:e.querySelector(".refresh-icon"),o=e==null?void 0:e.querySelector(".loading-spinner"),l=e==null?void 0:e.querySelector(".button-text");this.contentArea.querySelector("#celestial-intro-message"),a&&a.classList.add("hidden"),o&&o.classList.remove("hidden"),l&&(l.textContent="Calculating..."),e&&(e.disabled=!0);const n=this.contentArea.querySelector("#celestial-results");s.classList.remove("hidden"),n.classList.add("hidden");try{if(!this.satrec)throw new Error("No satellite data available");if(s.innerHTML=`
                <p class="text-sm text-base-content/70 text-center py-8">Calculating satellite positions and celestial body locations...</p>
            `,!this.testKnownTransit())return console.warn("test known failed"),!1;let i;if(this.config.calculationMode==="from-here")i=await this.findOptimalConjunctionTime();else{const r=new Date(this.blueGlobe.wallclock.now()),c=this.contentArea.querySelector("#utc-time");c.value=this.formatDateTimeLocal(r),this.config.utcTime=c.value,i=await this.findCelestialTransits()}s.classList.add("hidden"),this.displayResults(i)}catch(i){console.error("Celestial transit calculation error:",i),s.innerHTML=`
                <div class="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div>
                        <h4 class="font-bold">Transit not detected</h4>
                        <p class="text-sm">Calculations failed to find a transit near this time and place.</p>
                    </div>
                </div>
            `}finally{this.isCalculating=!1;const i=this.contentArea.querySelector("#celestial-refresh-btn"),r=i==null?void 0:i.querySelector(".refresh-icon"),c=i==null?void 0:i.querySelector(".loading-spinner"),h=i==null?void 0:i.querySelector(".button-text");r&&r.classList.remove("hidden"),c&&c.classList.add("hidden"),h&&(h.textContent="Calculate"),i&&(i.disabled=!1)}}async findCelestialTransits(){var f,b,w;const t=new Date,s=new Date(t.getTime()+this.config.searchDays*24*60*60*1e3);this.shadowStats={pointingTowardEarth:0,pointingAwayFromEarth:0,nearestDistance:null,nearestPoint:null},console.log(`=== RAY-CASTING CELESTIAL SEARCH START (${this.config.celestialBody}) ===`),console.log(`Time range: ${t.toISOString()} to ${s.toISOString()}`),console.log(`Max distance from home: ${this.config.maxDistanceKm} km`);const e=[],a=5*1e3;let o=0;const l=[],n=new Map,i=this.blueGlobe.preferences.homeLat,r=this.blueGlobe.preferences.homeLon,c=this.config.celestialBody||"sun",h=c!=="sun"&&c!=="moon";let d=null,u=0;for(let m=t.getTime();m<=s.getTime();m+=a){o++,o%1e3===0&&await new Promise($=>setTimeout($,0));const S=this.calculateSatellitePosition(m);if(!S||S.lookAngles.elevation<this.config.minElevation||this.haversineDistance(this.blueGlobe.preferences.homeLat,this.blueGlobe.preferences.homeLon,S.geodetic.latitude,S.geodetic.longitude)>1e3)continue;if(h){if(!d||m-d>3e5){const $=this.getSunPosition(new Date(m));u=z($.rightAscension,$.declination,new Date(m),i,r).elevation,d=m}if(u>-6)continue}const M=[{type:c,icon:{moon:"🌙",sun:"☀️",jupiter:"♃",mars:"♂",saturn:"♄",venus:"♀"}[c]||"🪐"}];for(const $ of M){if(n.has($.type)&&m<n.get($.type))continue;const T=this.shadowLine(m,$.type);if(T&&T.good){const _=this.getDebugPositions(m,T.lat,T.lon,this.tle1,this.tle2,$.type);console.log(`🎯 Transit hit found for ${$.type} at ${new Date(m).toISOString()}, distance: ${T.distanceToHome.toFixed(1)}km - ${_} ${T.lat} ${T.lon}`),n.set($.type,m+1e3*3600),e.push({time:m,celestial:$.type,lat:T.lat,lon:T.lon,distance:T.distanceToHome})}}}const g=await this.processTransitLines(e);if(this.combineAllGeoJSON(),console.log(`Ray-casting results: ${e.length} initial trigger events for ${this.config.celestialBody}`),console.log(`Optimized results: ${g.length} closest-to-home transit points`),this.shadowStats&&(console.log(`Shadow stats: ${this.shadowStats.pointingTowardEarth} toward earth, ${this.shadowStats.pointingAwayFromEarth} away`),this.shadowStats.nearestPoint&&console.log(`Nearest shadow point: ${(f=this.shadowStats.nearestDistance)==null?void 0:f.toFixed(1)}km from home (${(b=this.shadowStats.nearestPoint.lat)==null?void 0:b.toFixed(2)}, ${(w=this.shadowStats.nearestPoint.lon)==null?void 0:w.toFixed(2)} at ${this.shadowStats.nearestPoint.time})`)),g.length===0)return[];const p=this.findBestTransitPerDay(g);console.log(`Returning ${p.length} daily best transits`);const v=this.rankNewTransitsByProximity(p);return console.log("Ranked transits for table:",v.length,v),[this.config.maxDistanceKm,(this.config.maxDistanceKm*1e3,this.createCircleGeoJSON(i,r,this.config.maxDistanceKm)),...l.map(m=>({type:"Feature",properties:{time:m.time,celestialType:m.type,distanceFromHome:m.distance,stage:m.stage,"marker-color":this.getStageColor(m.stage,m.type),"marker-size":m.stage==="detection"?"medium":m.stage==="optimal"?"large":"small",celestial_az:m.celestial_az||"N/A",celestial_el:m.celestial_el||"N/A",satellite_az:m.satellite_az||"N/A",satellite_el:m.satellite_el||"N/A",utc:m.utc||m.time},geometry:{type:"Point",coordinates:[m.lon,m.lat]}}))],v.slice(0,20)}async findOptimalConjunctionTime(){var i,r;console.log("=== FROM HERE MODE: Finding optimal conjunction time ===");const t=this.config.utcTime;if(!t)throw new Error("UTC time is required for From Here mode");const s=new Date(t+"Z");if(isNaN(s.getTime()))throw new Error("Invalid UTC time format");console.log(`Input time: ${s.toISOString()}`),console.log(`Location: ${this.homeLat.toFixed(6)}, ${this.homeLon.toFixed(6)}, ${this.homeAlt||0}m`),console.log(`Celestial body: ${this.config.celestialBody}`);const e=await this.fetchBestTLEForTime(this.normalizedSatellite.norad_id,s),a=parseFloat(document.getElementById("override-lat").value)||this.homeLat,o=parseFloat(document.getElementById("override-lon").value)||this.homeLon,l=parseFloat(document.getElementById("override-alt").value)||0,n={time:s.toISOString(),lat:a,lon:o,elevation:l,body:this.config.celestialBody,tle1:e.tle1,tle2:e.tle2,locked:!0,quiet:!0};console.log("Calling /api/transit with locked mode:",n);try{const c=this.loadLeaflet(),h=await fetch(`${this.blueGlobe.apiBaseUrl}/api/transit`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.blueGlobe.apiKey||"session_key"}`},body:JSON.stringify(n)}),d=await h.json();if(console.log("Locked mode API response:",d),d.error||d.status==="error")throw new Error(d.error||d.message||"Locked mode calculation failed");if(!h.ok)throw new Error(`API Error ${h.status}: ${d.error||"Failed to get locked transit details"}`);if(d.status==="success")return[{time:new Date(((i=d.transit_details)==null?void 0:i.timestamp)||s.toISOString()).getTime(),celestial:this.config.celestialBody,lat:this.homeLat,lon:this.homeLon,distance:0,stage:"optimal",separation:(r=d.transit_quality)!=null&&r.angular_separation_arcsec?`${d.transit_quality.angular_separation_arcsec.toFixed(2)}"`:"N/A",apiResponse:d,fromHereMode:!0}];throw new Error("No optimal conjunction found within search parameters")}catch(c){throw console.error("Error in findOptimalConjunctionTime:",c),c}}async validateCenterlinePoint(t,s,e,a){try{const o=this.tle1,l=this.tle2,n=await fetch(`${this.blueGlobe.apiBaseUrl}/api/validate-position`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({time:t.toISOString(),lat:s,lon:e,elevation:0,tle1:o,tle2:l})});if(!n.ok)throw new Error(`Validation API error: ${n.status}`);const i=await n.json();console.log(`
🔍 PYTHON VALIDATION for ${a.toUpperCase()} at ${t.toISOString()}:`),console.log(`   Location: ${s.toFixed(6)}°, ${e.toFixed(6)}°`),console.log(`   Satellite Az/El: ${i.satellite.azimuth.toFixed(1)}°, ${i.satellite.altitude.toFixed(1)}°`),console.log(`   Above horizon: ${i.validation.above_horizon}`),console.log(`   Distance: ${i.satellite.distance_km.toFixed(1)} km
`),i.validation.above_horizon||console.warn(`⚠️  WARNING: Satellite below horizon (${i.satellite.altitude.toFixed(1)}°) - centerline point invalid!`)}catch(o){console.error("❌ Failed to validate centerline point:",o.message)}}stillOk(t,s){const e=this.shadowLine(t,s);if(!e)return!1;const a=this.blueGlobe.preferences.homeLat,o=this.blueGlobe.preferences.homeLon,l=this.config.maxDistanceKm*1.1;return this.haversineDistance(a,o,e.lat,e.lon)>l?!1:e}async findValidEndpoints(t,s,e,a){const n=Math.floor(30);let i=t,r=t,c=this.stillOk(t,s),h=this.stillOk(t,s),d=c,u=t,g=this.haversineDistance(e,a,c.lat,c.lon);for(let v=1;v<=n;v++){let f=t-v*2*1e3,b=t+v*2*1e3,w,m;if(w=this.stillOk(f,s)){i=f,c=w;const S=this.haversineDistance(e,a,w.lat,w.lon);S<g&&(g=S,d=w,u=f)}if(m=this.stillOk(b,s)){r=b,h=m;const S=this.haversineDistance(e,a,m.lat,m.lon);S<g&&(g=S,d=m,u=b)}}const p=(r-i)/(1e3*60);return console.log(`     Valid endpoints found: ${p.toFixed(1)} minute window`),console.log(`     Optimal point: ${d.lat.toFixed(6)}°, ${d.lon.toFixed(6)}° (${g.toFixed(1)}km from home)`),{point1:c,point2:h,time1:new Date(i),time2:new Date(r),optimalPoint:d,optimalTime:new Date(u)}}async isValidTransitPoint(t,s,e,a){var o,l;console.log(`🔍 Validating point: ${s.toFixed(4)}, ${e.toFixed(4)} at ${t.toISOString()}`);try{const n=await fetch(`${this.blueGlobe.apiBaseUrl}/api/validate-position`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({time:t.toISOString(),lat:s,lon:e,elevation:0,tle1:this.tle1,tle2:this.tle2,celestial:a})});if(!n.ok)return!1;const i=await n.json();if(i.alignment&&console.log(`     Validation: sat=${i.satellite.altitude.toFixed(1)}°, ${a}=${i.celestial.altitude.toFixed(1)}°, sep=${i.alignment.separation_deg.toFixed(1)}°, aligned=${i.alignment.is_aligned}`),((o=i.validation)==null?void 0:o.is_valid_transit)!==!0){console.error("🚨 FIRST VALIDATION FAILURE - STOPPING FOR DEBUG"),console.error("================================================"),console.error(`📅 Time: ${t.toISOString()}`),console.error(`📍 Location: ${s.toFixed(6)}°, ${e.toFixed(6)}°`),console.error(`🛰️  Satellite: Az=${i.satellite.azimuth.toFixed(1)}°, El=${i.satellite.altitude.toFixed(1)}°`),console.error(`${a==="sun"?"🌞":"🌙"} ${a}: Az=${i.celestial.azimuth.toFixed(1)}°, El=${i.celestial.altitude.toFixed(1)}°`),console.error(`🔄 Angular Separation: ${i.alignment.separation_deg.toFixed(2)}°`),console.error(`❌ Failed because: sat_above=${i.validation.above_horizon}, ${a}_above=${i.validation.celestial_above_horizon}, aligned=${i.alignment.is_aligned}`);const r=a==="sun"?this.getSunPositionAccurate(t,s,e):this.getMoonPositionAccurate(t,s,e);throw r&&console.error(`🔍 JS astronomy-engine RA/Dec: ${r.rightAscension.toFixed(2)}°, ${r.declination.toFixed(2)}°`),new Error("VALIDATION_DEBUG_STOP")}return((l=i.validation)==null?void 0:l.is_valid_transit)===!0}catch(n){return console.warn(`Validation failed for ${s.toFixed(4)}, ${e.toFixed(4)}:`,n.message),!1}}_calculateSatellitePosition(t,s){const e=N(this.satrec,t);if(e.error)throw new Error(`Satellite propagation error: ${e.error}`);const a=e.position,o=e.velocity,l=q(t),n=j(a,l);Q(s);const i=U(s,n),r=X(a,l);return{position:a,velocity:o,lookAngles:{azimuth:E(i.azimuth),elevation:E(i.elevation),rangeSat:i.rangeSat},geodetic:{latitude:E(r.latitude),longitude:E(r.longitude),height:r.height}}}calculateSatellitePosition(t){const s=t instanceof Date?t:new Date(t);return this._calculateSatellitePosition(s,this.observerGd)}getMoonPosition(t){return this.blueGlobe.moonTransitions.getCelestialEquatorial(t,!0)}getSunPosition(t){return this.blueGlobe.sunTransitions.getCelestialEquatorial(t,!0)}getSunPositionAccurate(t,s=0,e=0){try{const a=new V(s,e,0),o=t instanceof Date?t:new Date(t),l=J(o),n=K("Sun",l,a,!0,!0);return{rightAscension:n.ra*15,declination:n.dec,source:"astronomy-engine"}}catch(a){return console.error("❌ getSunPositionAccurate failed:",a),null}}getMoonPositionAccurate(t,s=0,e=0){try{const a=new V(s,e,0),o=t instanceof Date?t:new Date(t),l=J(o),n=K("Moon",l,a,!0,!0);return{rightAscension:n.ra*15,declination:n.dec,source:"astronomy-engine"}}catch(a){return console.error("❌ getMoonPositionAccurate failed:",a),null}}calculateAngularSeparation(t,s,e,a){const o=D(t),l=D(s),n=D(e),i=D(a),r=Math.sin(l)*Math.sin(i)+Math.cos(l)*Math.cos(i)*Math.cos(o-n);return E(Math.acos(Math.max(-1,Math.min(1,r))))}dateToJulianDay(t){return t.getTime()/864e5+24405875e-1}calculateTransitCenterline(t,s,e,a){try{const{propagate:o,gstime:l,eciToEcf:n}=satellite,i=l(t),r=this._getTransitions(a);if(!r)return console.warn(`No transitions available for ${a}`),null;const h=r.getCelestialEquatorial(t,!0).vectorTEME;if(!h)return console.warn(`Failed to get ${a} TEME vector`),null;const d=n({x:h[0],y:h[1],z:h[2]},i),u=[d.x,d.y,d.z],g=o(this.satrec,t);if(!g.position)return console.error("propagate failure"),null;const p=n(g.position,i),v=[p.x,p.y,p.z],f=this._intersectionLatLon(v,u,!0);if(!f)return null;{const S={latitude:f.lat,longitude:f.lon,height:0},y=this._calculateSatellitePosition(t,S);if(!y||isNaN(y.lookAngles.elevation))return console.log("Invalid satPos, returning null"),null;if(y.lookAngles.elevation<0)return null;const x=z(raRad,decRad,t,f.lat,f.lon);if(!x||x.elevation<0)return null;console.log("Elevation at:",f.lat,f.lon,y.lookAngles.elevation,x.elevation)}const b=this.blueGlobe.preferences.homeLat,w=this.blueGlobe.preferences.homeLon,m=this.haversineDistance(b,w,f.lat,f.lon);return{lat:f.lat,lon:f.lon,distanceFromHome:m}}catch(o){return console.warn(`Ray-casting failed: ${o.message}`),null}}_getTransitions(t){return t==="sun"&&this.blueGlobe.sunTransitions?this.blueGlobe.sunTransitions:t==="moon"&&this.blueGlobe.moonTransitions?this.blueGlobe.moonTransitions:(this._planetTransitions||(this._planetTransitions={}),this._planetTransitions[t]||(this._planetTransitions[t]=new tt(t,null,0,0,0)),this._planetTransitions[t])}shadowLine(t,s){const e=t instanceof Date?t:new Date(t),{propagate:a}=satellite,o=a(this.satrec,e);if(o.error)return console.warn("satellite propagation error"),null;const l=[o.position.x,o.position.y,o.position.z];let n;const i=this._getTransitions(s);if(!i)return console.warn(`No transitions available for ${s}`),null;if(n=i.getCelestialEquatorial(e,!0).vectorTEME,!n)return console.warn(`Failed to get ${s} vector in TEME`),null;const c=Math.sqrt(n[0]**2+n[1]**2+n[2]**2),h=[-n[0]/c,-n[1]/c,-n[2]/c],u=((I,O)=>I[0]*O[0]+I[1]*O[1]+I[2]*O[2]<0)(l,h);if(this.shadowStats||(this.shadowStats={pointingTowardEarth:0,pointingAwayFromEarth:0}),u)this.shadowStats.pointingTowardEarth++;else return this.shadowStats.pointingAwayFromEarth++,null;const g=6378.137,p=1/298.257223563,v=g*(1-p),[f,b,w]=l,[m,S,y]=h,x=(m*m+S*S)/(g*g)+y*y/(v*v),M=2*((f*m+b*S)/(g*g)+w*y/(v*v)),$=(f*f+b*b)/(g*g)+w*w/(v*v)-1,T=M*M-4*x*$;if(T<0)return null;const _=Math.sqrt(T),k=(-M-_)/(2*x),A=(-M+_)/(2*x);let C=k>0?k:A;if(C<=0)return console.warn("❌ No valid intersection (t <= 0)"),null;const P=[f+C*m,b+C*S,w+C*y],B=satellite.gstime(e);satellite.eciToEcf({x:P[0],y:P[1],z:P[2]},B);const G=satellite.eciToGeodetic({x:P[0],y:P[1],z:P[2]},B),Z=satellite.radiansToDegrees(G.latitude),W=satellite.radiansToDegrees(G.longitude),Y=G.height,F={lat:Z,lon:W,alt:Y};if(F&&this.blueGlobe.preferences){const I=this.blueGlobe.preferences.homeLat,O=this.blueGlobe.preferences.homeLon,H=this.haversineDistance(I,O,F.lat,F.lon);if((!this.shadowStats.nearestDistance||H<this.shadowStats.nearestDistance)&&(this.shadowStats.nearestDistance=H,this.shadowStats.nearestPoint={lat:F.lat,lon:F.lon,time:e.toISOString(),celestialType:s}),H<=this.config.maxDistanceKm)return this.addShadowHit(F,e,s,H),{...F,distanceToHome:H,good:!0}}return F}calculateBlackoutTime(t){return new Date(t.getTime()+5560800+6e5)}getDebugPositions(t,s,e,a,o,l){try{const n=new Date(t),i=R(a,o),r=N(i,n);if(r.error)return`SAT_ERROR: ${r.error}`;const c={longitude:D(e),latitude:D(s),height:0},h=q(n),d=j(r.position,h),u=U(c,d),g=E(u.azimuth),p=E(u.elevation);let v="N/A",f="N/A";const b=this._getTransitions(l);if(b){const w=b.getCelestialEquatorial(n,!0);if(w&&w.rightAscension!==void 0&&w.declination!==void 0){const m=z(w.rightAscension,w.declination,n,s,e);m&&(v=m.azimuth.toFixed(1),f=m.elevation.toFixed(1))}}return`sat ${g.toFixed(1)}°/${p.toFixed(1)}° ${l} ${v}°/${f}° ${s.toFixed(6)}/${e.toFixed(6)} ${n.toISOString()}`}catch(n){return`DEBUG_ERROR: ${n.message}`}}async processTransitLines(t){if(console.log(`
🔄 PHASE 2: Processing ${t.length} transit events into lines`),!t.length)return console.warn("❌ No transit events to process - check Phase 1 detection"),[];const s=[];this.transitLines||(this.transitLines={type:"FeatureCollection",features:[]});for(const e of t){console.log(`   Original hit: ${e.lat.toFixed(6)}°, ${e.lon.toFixed(6)}° (${e.distance.toFixed(1)}km from home)`),console.log(`   Time: ${new Date(e.time).toISOString()}`),console.log(`   Finding valid endpoints by time-stepping from ${new Date(e.time).toISOString().substring(11,19)}`);const a=this.homeLat,o=this.homeLon,l=await this.findValidEndpoints(e.time,e.celestial,a,o);if(!l){console.warn(`❌ Failed to find valid endpoints for ${e.celestial} transit`);continue}const{point1:n,point2:i,time1:r,time2:c,optimalPoint:h,optimalTime:d}=l,u=(r.getTime()-e.time)/1e3,g=(c.getTime()-e.time)/1e3;console.log(`   Point 1 (${u>=0?"+":""}${u}s): ${n.lat.toFixed(6)}°, ${n.lon.toFixed(6)}°`),console.log(`   Point 2 (${g>=0?"+":""}${g}s): ${i.lat.toFixed(6)}°, ${i.lon.toFixed(6)}°`);const p={lat:h.lat,lon:h.lon,distanceToHome:this.haversineDistance(this.homeLat,this.homeLon,h.lat,h.lon),time:d};if(p){const v=this.haversineDistance(n.lat,n.lon,i.lat,i.lon),f=(d.getTime()-e.time)/1e3;console.log(`   Line length: ${v.toFixed(1)}km`),console.log(`   Optimal point: ${p.lat.toFixed(6)}°, ${p.lon.toFixed(6)}°`),console.log(`   Distance to home: ${p.distanceToHome.toFixed(1)}km (${f>=0?"+":""}${f}s)`);const b=this.getDebugPositions(d.getTime(),p.lat,p.lon,this.tle1,this.tle2,e.celestial);if(console.log(`   Debug: ${b}`),p.distanceToHome>this.config.maxDistanceKm)continue;this.transitLines.features.push({type:"Feature",properties:{name:`${e.celestial.toUpperCase()} Endpoint 1`,description:`Time offset: ${u>=0?"+":""}${u}s`,celestial_type:e.celestial,feature_type:"endpoint",time_offset:u,"marker-color":"#00ff00","marker-size":"medium","marker-symbol":"triangle"},geometry:{type:"Point",coordinates:[n.lon,n.lat]}}),this.transitLines.features.push({type:"Feature",properties:{name:`${e.celestial.toUpperCase()} Endpoint 2`,description:`Time offset: ${g>=0?"+":""}${g}s`,celestial_type:e.celestial,feature_type:"endpoint",time_offset:g,"marker-color":"#00ff00","marker-size":"medium","marker-symbol":"triangle"},geometry:{type:"Point",coordinates:[i.lon,i.lat]}});const w=this.createGreatCircleLine(n.lat,n.lon,i.lat,i.lon,10);this.transitLines.features.push({type:"Feature",properties:{name:`${e.celestial.toUpperCase()} Transit Line`,description:`Length: ${v.toFixed(1)}km (great circle)`,celestial_type:e.celestial,feature_type:"transit_line",line_length_km:v,stroke:e.celestial==="sun"?"#ffaa00":"#aaaaff","stroke-width":3,"stroke-opacity":.8},geometry:{type:"LineString",coordinates:w}}),this.transitLines.features.push({type:"Feature",properties:{name:`${e.celestial.toUpperCase()} Optimal Point`,description:`Distance to home: ${p.distanceToHome.toFixed(1)}km (${f>=0?"+":""}${f}s)`,celestial_type:e.celestial,feature_type:"closest_point",distance_to_home_km:p.distanceToHome,t_parameter:p.t,"marker-color":"#ff00ff","marker-size":"large","marker-symbol":"star"},geometry:{type:"Point",coordinates:[p.lon,p.lat]}});let m=null;try{const y=new Date(e.time);if(e.celestial==="sun"){const x=this.getSunPosition(y),M=x.rightAscension,$=x.declination,T=z(M,$,y,p.lat,p.lon);m=T.elevation,console.log(`${e.celestial.toUpperCase()} AzEl at ${y.toISOString()} (${p.lat.toFixed(6)}, ${p.lon.toFixed(6)}): Az=${T.azimuth.toFixed(1)}° Alt=${T.elevation.toFixed(1)}°`)}else if(e.celestial==="moon"){const x=this.getMoonPosition(y),M=x.rightAscension,$=x.declination,T=z(M,$,y,p.lat,p.lon);m=T.elevation,console.log(`${e.celestial.toUpperCase()} AzEl at ${y.toISOString()} (${p.lat.toFixed(6)}, ${p.lon.toFixed(6)}): Az=${T.azimuth.toFixed(1)}° Alt=${T.elevation.toFixed(1)}°`)}}catch(y){m="fail",console.warn(`Failed to calculate ${e.celestial} altitude at closest point:`,y)}const S={time:d.getTime(),celestial:e.celestial,lat:p.lat,lon:p.lon,distance:p.distanceToHome,centerline:{lat:p.lat,lon:p.lon,distanceFromHome:p.distanceToHome,celestialAltitude:m}};s.push(S)}else console.warn("❌ Failed to find closest point on line")}return console.log(`🎯 Returning ${s.length} optimized transit objects (closest points only)`),s}findClosestPointOnLine(t,s){if(console.warn("findClosestPointOnLine is deprecated - use optimalPoint from findValidEndpoints instead"),!this.blueGlobe.preferences)return null;const e=this.blueGlobe.preferences.homeLat,a=this.blueGlobe.preferences.homeLon,o=this.haversineDistance(e,a,t.lat,t.lon);return{lat:t.lat,lon:t.lon,distanceToHome:o,t:0}}latLonToVector(t,s){const e=t*Math.PI/180,a=s*Math.PI/180,o=Math.cos(e);return[o*Math.cos(a),o*Math.sin(a),Math.sin(e)]}vectorToLatLon(t){const[s,e,a]=t,o=Math.atan2(a,Math.hypot(s,e))*180/Math.PI,l=Math.atan2(e,s)*180/Math.PI;return{lat:o,lon:l}}normalize(t){const s=Math.hypot(...t);return t.map(e=>e/s)}cross(t,s){return[t[1]*s[2]-t[2]*s[1],t[2]*s[0]-t[0]*s[2],t[0]*s[1]-t[1]*s[0]]}dot(t,s){return t[0]*s[0]+t[1]*s[1]+t[2]*s[2]}closestPointOnGreatCircleSegment(t,s,e,a,o,l){const n=this.latLonToVector(t,s),i=this.latLonToVector(e,a),r=this.latLonToVector(o,l),c=this.normalize(this.cross(n,i)),h=this.normalize(this.cross(r,c)),d=this.normalize(this.cross(c,h)),u=d.map(w=>-w),g=this.dot(r,d)>this.dot(r,u)?d:u,p=Math.acos(this.dot(n,i)),v=Math.acos(this.dot(n,g)),f=Math.acos(this.dot(g,i));let b;if(Math.abs(p-(v+f))<1e-10)b=g;else{const w=Math.acos(this.dot(r,n)),m=Math.acos(this.dot(r,i));b=w<m?n:i}return this.vectorToLatLon(b)}dumpTransitLines(){}combineAllGeoJSON(){const t={type:"FeatureCollection",features:[{type:"Feature",properties:{name:"Home Location",description:`Search center with ${this.config.maxDistanceKm}km radius`,"marker-color":"#ff0000","marker-size":"large","marker-symbol":"home"},geometry:{type:"Point",coordinates:[this.blueGlobe.preferences.homeLon,this.blueGlobe.preferences.homeLat]}},{type:"Feature",properties:{name:"Search Radius",description:`${this.config.maxDistanceKm}km search radius around home`,fill:"#ff0000","fill-opacity":.1,stroke:"#ff0000","stroke-width":2,"stroke-opacity":.5},geometry:{type:"Polygon",coordinates:[this.generateCircleCoordinates(this.blueGlobe.preferences.homeLat,this.blueGlobe.preferences.homeLon,this.config.maxDistanceKm)]}}]};this.shadowHits&&this.shadowHits.features&&t.features.push(...this.shadowHits.features),this.transitLines&&this.transitLines.features&&t.features.push(...this.transitLines.features),this.debugGeoJSON=t}createGeoJSONCopyLink(){if(!this.debugGeoJSON)return;const t=document.querySelector("#geojson-copy-btn");if(!t)return;const s=JSON.stringify(this.debugGeoJSON,null,2),e=this.debugGeoJSON.features.length;t.title=`Copy debug GeoJSON to clipboard (${e} features)`,t.onclick=async()=>{try{await navigator.clipboard.writeText(s);const a=t.innerHTML;t.innerHTML=`
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    copied
                `,t.className=t.className.replace("btn-primary","btn-success"),setTimeout(()=>{t.innerHTML=a,t.className=t.className.replace("btn-success","btn-primary")},2e3)}catch(a){console.error("❌ Failed to copy to clipboard:",a);const o=document.createElement("textarea");o.value=s,document.body.appendChild(o),o.select(),document.execCommand("copy"),document.body.removeChild(o),t.innerHTML=`
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    copied
                `}}}getTLEEpoch(){if(!this.satrec||!this.satrec.jdsatepoch)return"N/A";const t=this.satrec.jdsatepoch;return new Date((t-24405875e-1)*864e5).toISOString().split("T")[0]}getTLEAge(){if(!this.satrec||!this.satrec.jdsatepoch)return"N/A";const t=this.satrec.jdsatepoch,s=new Date((t-24405875e-1)*864e5),a=new Date().getTime()-s.getTime();return Math.floor(a/(1e3*60*60*24))}createGreatCircleLine(t,s,e,a,o=10){const l=[],n=t*Math.PI/180,i=s*Math.PI/180,r=e*Math.PI/180,c=a*Math.PI/180,h=r-n,d=c-i,u=Math.sin(h/2)*Math.sin(h/2)+Math.cos(n)*Math.cos(r)*Math.sin(d/2)*Math.sin(d/2),g=2*Math.atan2(Math.sqrt(u),Math.sqrt(1-u));for(let p=0;p<=o;p++){const v=p/o;if(v===0)l.push([s,t]);else if(v===1)l.push([a,e]);else{const f=Math.sin((1-v)*g)/Math.sin(g),b=Math.sin(v*g)/Math.sin(g),w=f*Math.cos(n)*Math.cos(i)+b*Math.cos(r)*Math.cos(c),m=f*Math.cos(n)*Math.sin(i)+b*Math.cos(r)*Math.sin(c),S=f*Math.sin(n)+b*Math.sin(r),y=Math.atan2(S,Math.sqrt(w*w+m*m)),x=Math.atan2(m,w);l.push([x*180/Math.PI,y*180/Math.PI])}}return l}generateCircleCoordinates(t,s,e){const a=[];for(let l=0;l<=64;l++){const i=l*360/64*Math.PI/180,r=t*Math.PI/180,c=s*Math.PI/180,d=e/6371,u=Math.asin(Math.sin(r)*Math.cos(d)+Math.cos(r)*Math.sin(d)*Math.cos(i)),g=c+Math.atan2(Math.sin(i)*Math.sin(d)*Math.cos(r),Math.cos(d)-Math.sin(r)*Math.sin(u));a.push([g*180/Math.PI,u*180/Math.PI])}return a}intersectRayEllipsoid(t,s,e={}){const o=e.a??6378.137,l=e.b??6356.752314245,n=e.requirePositiveT??!0;let[i,r,c]=t,[h,d,u]=s;const g=Math.hypot(h,d,u);if(g<1e-12)return{status:"miss",roots:[null,null]};h/=g,d/=g,u/=g;const p=o*o,v=l*l,f=(h*h+d*d)/p+u*u/v,b=2*((i*h+r*d)/p+c*u/v),w=(i*i+r*r)/p+c*c/v-1,m=b*b-4*f*w;if(m<-1e-12)return{status:"miss",roots:[null,null]};if(Math.abs(m)<=1e-12){const k=-b/(2*f),A=i+k*h,C=r+k*d,P=c+k*u;return n&&k<=0?{status:"miss",roots:[k,k]}:{status:"tangent",t:k,point:[A,C,P],roots:[k,k]}}const S=Math.sqrt(m),y=(-b-S)/(2*f),x=(-b+S)/(2*f);let M=null;if(n){const k=[y,x].filter(A=>A>0);if(k.length===0)return{status:"miss",roots:[y,x]};M=Math.min(...k)}else M=Math.abs(y)<Math.abs(x)?y:x;const $=i+M*h,T=r+M*d,_=c+M*u;return{status:"hit",t:M,point:[$,T,_],roots:[y,x]}}j2000ToTEME(t,s){const{jday:e}=satellite,o=(e(s.getUTCFullYear(),s.getUTCMonth()+1,s.getUTCDate(),s.getUTCHours(),s.getUTCMinutes(),s.getUTCSeconds()+s.getUTCMilliseconds()/1e3)-2451545)/36525,[l,n]=this.nutation1980(o),r=this.meanObliquity1980(o)+n,c=l*Math.cos(r),h=this.precessionMatrix1976(o),d=this.transposeMatrix(h),u=this.multiplyMatrixVector(d,t);return this.rotateZ(u,-c)}nutation1980(t){const s=Math.PI/180,e=s/3600,a=(93.27209062+17395272628478e-4*t/3600)%360,o=(297.85019547+1602961601209e-3*t/3600)%360,l=(125.04455501-69628902665e-4*t/3600)%360,n=a*s,i=o*s,r=l*s,c=(-17.2*Math.sin(r)-1.32*Math.sin(2*i)-.23*Math.sin(2*n)+.21*Math.sin(2*r))*e,h=(9.2*Math.cos(r)+.57*Math.cos(2*i)+.1*Math.cos(2*n)-.09*Math.cos(2*r))*e;return[c,h]}meanObliquity1980(t){const s=Math.PI/648e3;return(84381.448-46.815*t-59e-5*t**2+.001813*t**3)*s}precessionMatrix1976(t){const s=Math.PI/648e3,e=(2306.2181*t+.30188*t**2+.017998*t**3)*s,a=(2004.3109*t-.42665*t**2-.041833*t**3)*s,o=(2306.2181*t+1.09468*t**2+.018203*t**3)*s,l=Math.cos(o),n=Math.sin(o),i=Math.cos(a),r=Math.sin(a),c=Math.cos(e),h=Math.sin(e);return[[l*i*c-n*h,-l*i*h-n*c,-l*r],[n*i*c+l*h,-n*i*h+l*c,-n*r],[r*c,-r*h,i]]}transposeMatrix(t){return[[t[0][0],t[1][0],t[2][0]],[t[0][1],t[1][1],t[2][1]],[t[0][2],t[1][2],t[2][2]]]}rotateZ(t,s){const e=Math.cos(s),a=Math.sin(s);return[t[0]*e-t[1]*a,t[0]*a+t[1]*e,t[2]]}rotationZ(t){const s=Math.cos(t),e=Math.sin(t);return[[s,e,0],[-e,s,0],[0,0,1]]}multiplyMatrixVector(t,s){return[t[0][0]*s[0]+t[0][1]*s[1]+t[0][2]*s[2],t[1][0]*s[0]+t[1][1]*s[1]+t[1][2]*s[2],t[2][0]*s[0]+t[2][1]*s[1]+t[2][2]*s[2]]}precessionMatrix(t,s){const e=(t-s)/36525,a=(2306.2181+1.39656*e-139e-6*e*e)*e*Math.PI/(180*3600),o=(2306.2181+1.39656*e+139e-6*e*e)*e*Math.PI/(180*3600),l=(2004.3109-.8533*e-217e-6*e*e)*e*Math.PI/(180*3600),n=Math.cos(o),i=Math.sin(o),r=Math.cos(l),c=Math.sin(l),h=Math.cos(a),d=Math.sin(a);return[[h*n*r-d*i,-d*n*r-h*i,-i*c],[h*i*r+d*n,-d*i*r+h*n,n*c],[h*c,-d*c,r]]}addShadowHit(t,s,e,a,o){this.shadowHits||(this.shadowHits={type:"FeatureCollection",features:[]});const l=this.determineCelestialType(e,a,s),n={type:"Feature",properties:{time:s.toISOString(),distance_to_home_km:Math.round(o*100)/100,celestial_type:l,marker_color:l==="sun"?"#ffff00":"#c0c0c0",marker_size:"small"},geometry:{type:"Point",coordinates:[t.lon,t.lat]}};this.shadowHits.features.push(n)}determineCelestialType(t,s,e){return Math.abs(s*180/Math.PI)>25?"moon":"sun"}dumpShadowHits(){if(this.shadowStats){const t=this.shadowStats.pointingTowardEarth+this.shadowStats.pointingAwayFromEarth;console.log(`
📊 SHADOW DIRECTION STATS:`),console.log(`- Pointing toward Earth: ${this.shadowStats.pointingTowardEarth} (${(this.shadowStats.pointingTowardEarth/t*100).toFixed(1)}%)`),console.log(`- Pointing away from Earth: ${this.shadowStats.pointingAwayFromEarth} (${(this.shadowStats.pointingAwayFromEarth/t*100).toFixed(1)}%)`),console.log(`- Total shadow rays checked: ${t}`),this.shadowStats.nearestDistance!==void 0&&(console.log(`
🎯 NEAREST SHADOW INTERSECTION:`),console.log(`- Distance to home: ${this.shadowStats.nearestDistance.toFixed(1)} km`),console.log(`- Location: ${this.shadowStats.nearestPoint.lat.toFixed(4)}°, ${this.shadowStats.nearestPoint.lon.toFixed(4)}°`),console.log(`- Time: ${this.shadowStats.nearestPoint.time}`),this.shadowStats.nearestDistance>200&&console.log(`⚠️  Closest shadow is ${(this.shadowStats.nearestDistance-200).toFixed(1)} km beyond 200km search radius`))}if(this.shadowHits&&this.shadowHits.features.length>0){const t=this.shadowHits.features.filter(e=>e.properties.celestial_type==="sun").length,s=this.shadowHits.features.filter(e=>e.properties.celestial_type==="moon").length;console.log(`
📊 Shadow hits summary: ${t} Sun hits, ${s} Moon hits (${this.shadowHits.features.length} total within 200km)`)}else console.log("No shadow hits found within 200km radius")}clearShadowHits(){this.shadowHits={type:"FeatureCollection",features:[]}}testKnownTransit(){console.log("🧪 RAYCAST KNOWN GOOD TRANSIT");const t=new Date("2025-08-21T05:08:31.920Z"),s=-34.14011111111111,e=150+51/60+40.69/3600,{twoline2satrec:a}=satellite,n=a("1 25544U 98067A   25223.82969193  .00008972  00000-0  16234-3 0  9996","2 25544  51.6349  31.2739 0001221 180.1031 179.9958 15.50462832523795"),i=this.satrec;this.satrec=n,console.log(`- Test time: ${t.toISOString()}`),console.log(`- Test location: ${s.toFixed(6)}°, ${e.toFixed(6)}° (Sydney)`),console.log("- Celestial object: SUN");let r=!0;try{const c=this.getSunPosition(t);console.log("debug sunPos at time ",c);const h=this.shadowLine(t,"sun");if(h){const d=this.haversineDistance(s,e,h.lat,h.lon);console.log("✅ Shadow intersection found:"),console.log(`   - Shadow location: ${h.lat.toFixed(6)}°, ${h.lon.toFixed(6)}°`),console.log(`   - Distance to Sydney: ${d.toFixed(1)} km`),d<=200?(console.log("🎯 SUCCESS: Shadow within 200km radius!"),r=!1):console.log(`⚠️  Shadow ${(d-200).toFixed(1)} km beyond search radius`)}else console.log("❌ No shadow intersection found")}catch(c){console.log(`❌ Test failed: ${c.message}`)}finally{this.satrec=i}return console.log(`🧪 Test complete
`),!r}_intersectionLatLon(t,s,e=!0){let a=s[0]-t[0],o=s[1]-t[1],l=s[2]-t[2];if(e){const i=6356.752314245,r=a*a/(6378.137*6378.137)+o*o/(6378.137*6378.137)+l*l/(i*i),c=2*(t[0]*a/(6378.137*6378.137)+t[1]*o/(6378.137*6378.137)+t[2]*l/(i*i)),h=t[0]*t[0]/(6378.137*6378.137)+t[1]*t[1]/(6378.137*6378.137)+t[2]*t[2]/(i*i)-1,d=c*c-4*r*h;if(d<0)return null;const u=Math.sqrt(d),g=(-c-u)/(2*r),p=(-c+u)/(2*r),v=g>0&&g<p?g:p,f=t[0]+a*v,b=t[1]+o*v,w=t[2]+l*v,m=Math.sqrt(f*f+b*b),S=(6378.137*6378.137-i*i)/(6378.137*6378.137);let y=Math.atan2(w,m),x,M;for(let T=0;T<10;T++){const _=Math.sin(y),k=Math.cos(y);x=6378.137/Math.sqrt(1-S*_*_),M=m/k-x;const A=Math.atan2(w,m*(1-S*x/(x+M)));if(Math.abs(A-y)<1e-12)break;y=A}const $=Math.atan2(b,f);return{lat:y*180/Math.PI,lon:$*180/Math.PI}}else{const i=a*a+o*o+l*l,r=2*(t[0]*a+t[1]*o+t[2]*l),c=t[0]**2+t[1]**2+t[2]**2-6378.137**2,h=r*r-4*i*c;if(h<0)return null;const d=Math.sqrt(h),u=(-r-d)/(2*i),g=(-r+d)/(2*i),p=u>0&&u<g?u:g,v=t[0]+a*p,f=t[1]+o*p,b=t[2]+l*p,w=Math.atan2(f,v)*180/Math.PI,m=Math.sqrt(v*v+f*f);return{lat:Math.atan2(b,m)*180/Math.PI,lon:w}}}haversineDistance(t,s,e,a){const l=(e-t)*Math.PI/180,n=(a-s)*Math.PI/180,i=Math.sin(l/2)*Math.sin(l/2)+Math.cos(t*Math.PI/180)*Math.cos(e*Math.PI/180)*Math.sin(n/2)*Math.sin(n/2);return 6371*(2*Math.atan2(Math.sqrt(i),Math.sqrt(1-i)))}getStageColor(t,s){switch(t){case"detection":return"#0066ff";case"optimize_forward":case"optimize_backward":return"#ff3300";case"optimal":return"#00ff00";default:return s==="moon"?"#0066ff":"#ff3300"}}findClosestPointOnCenterline(t,s,e,a){try{const o=this.blueGlobe.preferences.homeLat,l=this.blueGlobe.preferences.homeLon;if(!o||!l)return null;let n=null,i=1/0;for(let r=-300;r<=300;r+=2){const c=new Date(t+r*1e3),h=this.calculateSatellitePosition(c),d=a==="moon"?this.getMoonPosition(c):this.getSunPosition(c);if(h&&d){const u=this.calculateTransitCenterline(c,d,h,a);if(u){const g=this.haversineDistance(o,l,u.lat,u.lon);g<i&&(i=g,console.log("Found a new minimum distance",i),n={lat:u.lat,lon:u.lon,distanceFromHome:g})}}}return console.log(n?`🎯 Found closest centerline point: ${i.toFixed(1)}km from home`:`X did not find closest centerline point: ${i.toFixed(1)}km from home`),n}catch(o){return console.error("Error finding closest centerline point:",o),null}}getDistanceAtTime(t,s){try{const e=this.calculateSatellitePosition(t);if(!e||e.lookAngles.elevation<this.config.minElevation)return null;const a=s.type==="moon"?this.getMoonPosition(t):this.getSunPosition(t);if(!a)return null;const o=this.calculateTransitCenterline(t,a,e,s.type);return o?o.distanceFromHome:null}catch{return null}}findBestTransitPerDay(t){const s=new Map;for(const e of t){const a=new Date(e.time).toISOString().split("T")[0]+"-"+e.celestial;(!s.has(a)||e.distance<s.get(a).distance)&&s.set(a,e)}return Array.from(s.values())}rankNewTransitsByProximity(t){return t.sort((e,a)=>e.distance-a.distance).map((e,a)=>{var v,f,b,w,m,S;let o="bronze";a===0?o="gold":a===1&&(o="silver");const l=((v=e.centerline)==null?void 0:v.lat)||e.lat,n=((f=e.centerline)==null?void 0:f.lon)||e.lon,i=this._calculateSatellitePosition(new Date(e.time),{latitude:D(l),longitude:D(n),height:0});if(!i||!i.lookAngles)return console.warn("Failed to get satellite position for event at closest point:",e),null;const r=i.lookAngles.range||400,c=i.lookAngles.elevation||0,h=i.lookAngles.azimuth||0;console.log("Satellite data for ranking:",{time:new Date(e.time).toISOString(),range:i.lookAngles.range,elevation:c,azimuth:h});const d=2*Math.atan(.073/(2*r))*(180/Math.PI)*3600,u=this.getSunPosition(new Date(e.time)),p=z(u.rightAscension,u.declination,new Date(e.time),e.lat,e.lon).elevation<-18;return{time:e.time,celestial:e.celestial,targetType:e.celestial,rank:o,separation:0,elevation:c,azimuth:h,distance:r,angularSize:d,isNighttime:p,centerline:{lat:((b=e.centerline)==null?void 0:b.lat)||e.lat,lon:((w=e.centerline)==null?void 0:w.lon)||e.lon,distanceFromHome:((m=e.centerline)==null?void 0:m.distanceFromHome)||e.distance,celestialAltitude:(S=e.centerline)==null?void 0:S.celestialAltitude},edgeSeparation:0,inUmbra:!1,note:`${e.distance.toFixed(1)}km from home`}})}rankTransitsByProximity(t){return t.sort((e,a)=>e.distance-a.distance).map((e,a)=>{let o="bronze";a===0?o="gold":a===1&&(o="silver");const l=e.satPos.distance||400,n=2*Math.atan(.073/(2*l))*(180/Math.PI)*3600,i=(e.targetType==="moon",.25),r=0,c=this.getSunPosition(new Date(e.time)),h=z(c.rightAscension,c.declination,new Date(e.time),e.centerline.lat,e.centerline.lon),d=h.elevation<-18;return{time:e.time,targetType:e.targetType,rank:o,separation:0,elevation:e.satPos.lookAngles.elevation,azimuth:e.satPos.lookAngles.azimuth,distance:e.satPos.distance,angularSize:n,isNighttime:d,sunElevation:h.elevation,edgeSeparation:r,isTransit:!0,celestialRadius:i,centerlineDistance:e.distance,centerlineLat:e.lat,centerlineLon:e.lon}})}calculateAngularSize(t){return 2*Math.atan(.01/(2*t))*180/Math.PI*3600}createTransitResult(t,s,e){const a=e==="moon"?s.moonSeparation:s.sunSeparation;let o;e==="moon"?o=s.moonPos.angularSize/60/2:o=.25;const l=a-o;return{time:t,targetType:e,angularSize:s.angularSize,elevation:s.satPos.lookAngles.elevation,azimuth:s.satPos.lookAngles.azimuth,distance:s.satPos.lookAngles.rangeSat,separation:a,edgeSeparation:l,isTransit:l<0,celestialRadius:o,isNighttime:s.isNighttime,sunElevation:s.sunAzEl?s.sunAzEl.elevation:-90}}removeDuplicateTransits(t){const s=[];t.sort((a,o)=>a.time-o.time);for(const a of t){const o=s.some(l=>Math.abs(a.time-l.time)<18e5&&a.targetType===l.targetType);if(!o||a.separation<existing.separation)if(o){const l=s.findIndex(n=>Math.abs(a.time-n.time)<18e5&&a.targetType===n.targetType);s[l]=a}else s.push(a)}return s}displayResults(t){var l;const s=this.contentArea.querySelector("#celestial-results");if(this._transitDataById=this._transitDataById||{},t.forEach((n,i)=>{const r=`${n.celestial}_${n.time}`;this._transitDataById[r]=n}),t.length===1&&t[0].fromHereMode){this._lockedModeActive=!0,this.displayFromHereResults(t[0]),s.classList.remove("hidden");return}else this._lockedModeActive=!1;if(t.length===0){s.innerHTML=`
                <div class="alert alert-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <h4 class="font-bold">No celestial transits found</h4>
                        <p class="text-sm">No transits of ${this.config.celestialBody.charAt(0).toUpperCase()+this.config.celestialBody.slice(1)} within ${this.config.maxDistanceKm}km in the next ${this.config.searchDays} days.${(l=this.shadowStats)!=null&&l.nearestDistance?` Nearest pass was ${this.shadowStats.nearestDistance.toFixed(0)}km away on ${new Date(this.shadowStats.nearestPoint.time).toLocaleDateString()}.`:""} Try increasing search days or max distance.</p>
                    </div>
                </div>
            `,s.classList.remove("hidden");return}const e={moon:"🌙",sun:"☀️",jupiter:"♃",mars:"♂",saturn:"♄",venus:"♀",mercury:"☿"},a={};for(const n of t)a[n.celestial]||(a[n.celestial]=[]),a[n.celestial].push(n);console.log(`DEBUG: Total transits: ${t.length}, groups: ${Object.keys(a).join(", ")}`);let o=`
            <div class="flex items-center justify-between mb-3">
                <h4 class="font-semibold text-white">Found ${t.length} celestial transit(s)</h4>
                <button id="geojson-copy-btn" class="btn btn-xs btn-outline btn-primary" title="Copy debug GeoJSON to clipboard">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    geojson
                </button>
            </div>
            <div class="overflow-x-auto">
                <table class="table table-xs">
                    <thead>
                        <tr>
                            <th class="text-left w-[6.5rem]">Details</th>
                            <th>Date & Time (Local)</th>
                            <th class="text-right">Alt</th>
                            <th class="text-right">Az</th>
                            <th class="text-right">Distance from Home</th>
                        </tr>
                    </thead>
                    <tbody>`;for(const[n,i]of Object.entries(a)){const r=e[n]||"🪐",c=n.charAt(0).toUpperCase()+n.slice(1);o+=this.renderTransitRows(`${r} ${c} Transits`,i)}o+=`
                    </tbody>
                </table>
            </div>`,s.innerHTML=o,s.classList.remove("hidden"),document.getElementById("transit-gallery").style.display="none",this.createGeoJSONCopyLink(),this.results=t}renderTransitRows(t,s){const a=s.sort((o,l)=>o.time-l.time).map((o,l)=>{var g;const n=new Date(o.time).toLocaleDateString("en-US",{month:"numeric",day:"numeric"}),i=new Date(o.time).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),r=new Date(o.time).toISOString().replace("T"," ").replace(".000Z"," UTC"),c=((g=o.centerline)==null?void 0:g.celestialAltitude)!=null?` (${o.celestial}: ${o.centerline.celestialAltitude.toFixed(1)}°)`:"",h=N(this.satrec,o.time);if(q(o.time),h.position){const p=h.position;`${p.x.toFixed(1)}${p.y.toFixed(1)}${p.z.toFixed(1)}`}let d="";if(o.celestial==="moon"){const p=new Date(o.time).getHours();d=p<6||p>20?" 🌃":" ☀️"}const u=`${o.celestial}_${o.time}`;return`
                <tr class="hover:bg-base-200/50">
                    <td class="text-left">
                        <button class="btn btn-xs btn-primary" onclick="window.celestialCalculator.toggleTransitDetails('${u}', '${o.targetType}', '${new Date(o.time).toISOString()}')">
                            <span class="details-btn-text-${u}">Details</span>
                            <span class="details-btn-icon-${u}">▼</span>
                        </button>
                    </td>
                    <td class="text-sm font-mono">
                        <div>${n} ${i}${d}</div>
                        <div class="text-xs text-base-content/60">${r}${c}</div>
                    </td>
                    <td class="text-right">${o.elevation.toFixed(1)}°</td>
                    <td class="text-right">${o.azimuth.toFixed(0)}°</td>
                    <td class="text-right">
                        <span class="${o.rank==="gold"?"text-yellow-400":o.rank==="silver"?"text-gray-300":"text-amber-600"}">
                            ${o.centerline.distanceFromHome?o.centerline.distanceFromHome.toFixed(0):"N/A"} km
                        </span>
                        ${o.rank==="gold"?" 🥇":o.rank==="silver"?" 🥈":o.rank==="bronze"?" 🥉":""}
                    </td>
                </tr>
                <tr id="details-row-${u}" class="hidden">
                    <td colspan="5" class="p-0">
                        <div class="bg-base-100 border-t border-base-300 p-4">
                            <div id="details-content-${u}" class="space-y-4">
                                <!-- Placeholder content - will be populated when Details is clicked -->
                                <div class="flex items-center justify-center py-8 text-base-content/50">
                                    <div class="loading loading-spinner loading-sm mr-2"></div>
                                    <span>Click Details to load precise transit analysis...</span>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            `}).join("");return`
            <tr class="bg-base-200">
                <td colspan="5" class="font-bold text-lg text-left py-2">${t}</td>
            </tr>
            ${a}
        `}getResults(){return this.results}async toggleTransitDetails(t,s,e){const a=document.getElementById(`details-row-${t}`),o=document.getElementById(`details-content-${t}`),l=document.querySelector(`.details-btn-text-${t}`),n=document.querySelector(`.details-btn-icon-${t}`);a.classList.contains("hidden")?(a.classList.remove("hidden"),l.textContent="Hide",n.textContent="▲",o.querySelector(".loading")&&await this.loadTransitDetails(t,s,e,o)):(a.classList.add("hidden"),l.textContent="Details",n.textContent="▼")}async loadTransitDetails(t,s,e,a){try{console.log(`Loading detailed transit: ${t}, ${s}, ${e}`),a.innerHTML=`
                <div class="flex items-center justify-center py-4">
                    <div class="loading loading-spinner loading-md mr-3"></div>
                    <span>Calculating precise transit details...</span>
                </div>
            `;const o=this._transitDataById&&this._transitDataById[t];if(console.log("Transit ID:",t),console.log("Available transit IDs:",this._transitDataById?Object.keys(this._transitDataById):"none"),console.log("Found transit data:",o),!o)throw new Error(`Transit data not found for ID: ${t}`);if(!o.centerline||!o.centerline.lat||!o.centerline.lon)throw new Error(`Transit data missing centerline coordinates: ${JSON.stringify(o)}`);const l=o.centerline.lat,n=o.centerline.lon,i=0;console.log(`Using optimal centerline coordinates: ${l.toFixed(6)}, ${n.toFixed(6)}`);const r={time:e,lat:l,lon:n,elevation:i,body:s,tle1:this.tle1,tle2:this.tle2,quiet:!0};console.log("Calling /api/transit with:",r);const c=this.loadLeaflet(),h=await fetch(`${this.blueGlobe.apiBaseUrl}/api/transit`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.blueGlobe.apiKey||"session_key"}`},body:JSON.stringify(r)}),d=await h.json();if(console.log("Transit API response:",d),d.error||d.status==="error")throw new Error(d.error||d.message||"Transit calculation failed");if(!h.ok)throw new Error(`API Error ${h.status}: ${d.error||"Failed to get transit details"}`);await c,this._cachedTransitData=this._cachedTransitData||{};const u=Object.keys(this._cachedTransitData).length;this._cachedTransitData[u]=d;const g=this.formatTransitApiResponse(d,s,u);a.innerHTML=g}catch(o){console.error("Error loading transit details:",o),a.innerHTML=`
                <div class="_alert _alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Error loading transit details: ${o.message}</span>
                </div>
            `}}async simulateBackendCall(){return new Promise(t=>setTimeout(t,800+Math.random()*1200))}formatTransitApiResponse(t,s,e){try{const a=t.transit_details,o=t.summary,l=s==="sun"?"☀️":"🌙",n=s.charAt(0).toUpperCase()+s.slice(1),i=s==="sun";return`
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <!-- Row 1: Transit Geometry + Celestial Position | Transit Animation -->
                    <div class="transit-section">
                        <h4 class="transit-section-title">🎯 Transit Geometry</h4>
                        <div class="transit-data">
                            <div class="transit-data-row"><span class="transit-data-label">Azimuth</span><span class="transit-data-value">${a.satellite_position.azimuth_deg.toFixed(1)}°</span></div>
                            <div class="transit-data-row"><span class="transit-data-label">Altitude</span><span class="transit-data-value">${a.satellite_position.altitude_deg.toFixed(1)}°</span></div>
                            <div class="transit-data-row"><span class="transit-data-label">Transit Duration</span><span class="transit-data-value">${a.transit_geometry.transit_duration_s<.01?a.transit_geometry.transit_duration_s.toFixed(4):a.transit_geometry.transit_duration_s.toFixed(2)}s</span></div>
                            <div class="transit-data-row"><span class="transit-data-label">Path Width</span><span class="transit-data-value">${a.transit_geometry.visibility_path_width_km<1?(a.transit_geometry.visibility_path_width_km*1e3).toFixed(0)+" m":a.transit_geometry.visibility_path_width_km.toFixed(1)+" km"}</span></div>
                            <div class="transit-data-row"><span class="transit-data-label">Transit Chord</span><span class="transit-data-value">${a.transit_geometry.transit_chord_arcmin.toFixed(2)}′</span></div>
                            <div class="transit-data-row"><span class="transit-data-label">Size Ratio</span><span class="transit-data-value">${a.transit_geometry.size_ratio.toFixed(1)}:1 (${a.celestial_position.angular_size_arcmin.toFixed(1)}′ vs ${a.satellite_position.angular_size_arcsec.toFixed(2)}″)</span></div>
                        </div>
                        <h4 class="transit-section-title mt-3">${l} ${n} Position</h4>
                        <div class="transit-data">
                            <div class="transit-data-row"><span class="transit-data-label">Distance</span><span class="transit-data-value">${(a.celestial_position.distance_km/1e3).toFixed(0)}k km</span></div>
                            <div class="transit-data-row"><span class="transit-data-label">RA / Dec</span><span class="transit-data-value">${a.celestial_position.ra_hours.toFixed(2)}h, ${a.celestial_position.dec_degrees.toFixed(2)}°</span></div>
                            <div class="transit-data-row"><span class="transit-data-label">Angular Size</span><span class="transit-data-value">${a.celestial_position.angular_size_arcmin.toFixed(1)}′</span></div>
                        </div>
                    </div>

                    ${t.visualization&&t.visualization.svg_animation?`
                    <div class="transit-section">
                        <h4 class="transit-section-title">📺 Transit Animation</h4>
                        <div class="transit-data flex justify-center">
                            ${t.visualization.svg_animation}
                        </div>
                    </div>
                    `:""}

                    <!-- Row 2: Viewing Location | Lighting Conditions -->
                    <div class="transit-section">
                        <h4 class="transit-section-title">📍 Viewing Location</h4>
                        <div class="transit-data">
                            <div class="transit-data-row"><span class="transit-data-label">Latitude</span><span class="transit-data-value">${a.location.latitude.toFixed(6)}°N</span></div>
                            <div class="transit-data-row"><span class="transit-data-label">Longitude</span><span class="transit-data-value">${a.location.longitude.toFixed(6)}°E</span></div>
                            <div class="transit-data-row"><span class="transit-data-label">Elevation</span><span class="transit-data-value">${a.location.elevation_m.toFixed(0)} m</span></div>
                            <div class="transit-data-row"><span class="transit-data-label">Optimal Time</span><span class="transit-data-value">${new Date(a.timestamp).toISOString().replace("T"," ").replace(".000Z"," UTC")}</span></div>
                            <div class="transit-data-row"><span class="transit-data-label">Distance from Home</span><span class="transit-data-value">${this.haversineDistance(this.blueGlobe.preferences.homeLat,this.blueGlobe.preferences.homeLon,a.location.latitude,a.location.longitude).toFixed(1)} km</span></div>
                        </div>
                        <div class="mt-3">
                            <button class="btn btn-sm btn-outline" data-index="${e}" onclick="document.celestialCalculator.toggleTransitMap(this.dataset.index, this)">
                                <span class="map-btn-text">Show Map</span>
                                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.894A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7l6-3 5.447 2.894A1 1 0 0121 7.618v10.764a1 1 0 01-.553.894L15 17l-6 3z"></path>
                                </svg>
                            </button>
                        </div>
                        <div id="transit-map-${e}" class="hidden mt-3" style="height: 300px; border-radius: 0.5rem; overflow: hidden;"></div>
                    </div>

                    <div class="transit-section">
                        <h4 class="transit-section-title">🌅 Lighting Conditions</h4>
                        <div class="transit-data">
                            <div class="transit-data-row"><span class="transit-data-label">Shadow Condition</span><span class="transit-data-value ${a.shadow_conditions.in_shadow?"text-blue-400":"text-yellow-400"}">${a.shadow_conditions.shadow_condition}</span></div>
                            ${i?"":`
                                <div class="transit-data-row"><span class="transit-data-label">Sun Altitude</span><span class="transit-data-value">${a.sun_position.altitude_deg.toFixed(1)}°</span></div>
                                <div class="transit-data-row"><span class="transit-data-label">Sun Azimuth</span><span class="transit-data-value">${a.sun_position.azimuth_deg.toFixed(1)}°</span></div>
                            `}
                            ${a.illumination?`
                                <div class="transit-data-row"><span class="transit-data-label">Moon Phase</span><span class="transit-data-value">${a.illumination.illumination_percent.toFixed(1)}%</span></div>
                                <div class="transit-data-row"><span class="transit-data-label">Phase Angle</span><span class="transit-data-value">${a.illumination.phase_angle_deg.toFixed(1)}°</span></div>
                            `:""}
                        </div>
                    </div>

                    <!-- Row 3: Satellite Position | Satellite Motion -->
                    <div class="transit-section">
                        <h4 class="transit-section-title">🛰️ Satellite Position</h4>
                        <div class="transit-data">
                            <div class="transit-data-row"><span class="transit-data-label">Distance</span><span class="transit-data-value">${a.satellite_position.distance_km.toFixed(1)} km</span></div>
                            <div class="transit-data-row"><span class="transit-data-label">Angular Size</span><span class="transit-data-value">${a.satellite_position.angular_size_arcsec.toFixed(2)}″</span></div>
                            <div class="transit-data-row"><span class="transit-data-label">Effective Diameter</span><span class="transit-data-value">${a.satellite_position.effective_diameter_m.toFixed(1)} m</span></div>
                        </div>
                    </div>

                    <div class="transit-section">
                        <h4 class="transit-section-title">🚀 Satellite Motion</h4>
                        <div class="transit-data">
                            <div class="transit-data-row"><span class="transit-data-label">Angular Speed</span><span class="transit-data-value">${a.velocity_components.angular_arcmin_per_s.toFixed(2)}′/s</span></div>
                            <div class="transit-data-row"><span class="transit-data-label">Total Speed</span><span class="transit-data-value">${a.velocity_components.total_km_per_s.toFixed(2)} km/s</span></div>
                            <div class="transit-data-row"><span class="transit-data-label">Transverse</span><span class="transit-data-value">${a.velocity_components.transverse_km_per_s.toFixed(2)} km/s</span></div>
                            <div class="transit-data-row"><span class="transit-data-label">Radial</span><span class="transit-data-value">${a.velocity_components.radial_km_per_s.toFixed(2)} km/s</span></div>
                            <div class="transit-data-row"><span class="transit-data-label">Direction from Zenith</span><span class="transit-data-value">${a.velocity_components.direction_from_zenith_deg.toFixed(1)}°</span></div>
                        </div>
                    </div>

                </div>

                <div class="mt-4 pt-3 border-t border-gray-700">
                    <div class="space-y-1">
                        <span class="inline-block text-xs font-medium text-green-400 bg-green-900/30 px-2 py-0.5 rounded">High-Precision Data</span>
                        <div class="text-xs text-gray-500 leading-relaxed">
                            calculated on ${new Date().toISOString().split("T")[0]} UTC using the latest TLE available (age of TLE: ${this.getTLEAge()} days, epoch of TLE: ${this.getTLEEpoch()}).
                            Elevation/Azimuth and conjunctions are Apparent, with refraction estimates for 15°C and 1010mb, and parallax with ellipsoid WGS84 globe.
                            TLE accuracy is best on the actual day of transit, the track can move significantly day by day.
                        </div>
                    </div>
                </div>
            `}catch(a){return console.error("Error formatting API response:",a),`
                <div class="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Error formatting transit details: ${a.message}</span>
                </div>
                <pre class="text-xs bg-base-300 p-3 rounded overflow-auto">${JSON.stringify(t)}</pre>
            `}}logCelestialDebug(t,s,e,a){const o=t.toLocaleString();let l="N/A";if(s.type==="sun"&&this.blueGlobe.sunTransitions){const[i,r]=this.blueGlobe.sunTransitions.getSubsolarPoint(t);l=`subsolar[${i.toFixed(2)}°, ${r.toFixed(2)}°]`}else if(s.type==="moon"&&this.blueGlobe.moonTransitions){const[i,r]=this.blueGlobe.moonTransitions.getSublunarPoint(t);l=`sublunar[${i.toFixed(2)}°, ${r.toFixed(2)}°]`}const n=t.toISOString();console.log(`📍 ${s.icon} ${o} (UTC: ${n}) | ${l} | ${e.toFixed(0)}km ${a}`)}async loadLeaflet(){if(!window.L)return new Promise((t,s)=>{const e=document.createElement("link");e.rel="stylesheet",e.href="/leaflet/leaflet.css",e.onload=()=>{console.log("Leaflet CSS loaded successfully");const a=document.createElement("script");a.src="/leaflet/leaflet.js",a.onload=()=>{delete L.Icon.Default.prototype._getIconUrl,L.Icon.Default.mergeOptions({iconRetinaUrl:"/leaflet/images/marker-icon-2x.png",iconUrl:"/leaflet/images/marker-icon.png",shadowUrl:"/leaflet/images/marker-shadow.png"}),t()},a.onerror=s,document.head.appendChild(a)},e.onerror=s,document.head.appendChild(e)})}showTransitMap(t,s,e=!1){var r;if(console.log("showTransitMap called with:",{leafletLoaded:!!window.L,transitDetails:!!t.transit_details,location:(r=t.transit_details)==null?void 0:r.location,mapContainerId:s}),!window.L||!t.transit_details){console.error("Leaflet not loaded or transit_details missing:",{leafletLoaded:!!window.L,transitDetails:!!t.transit_details});return}const{latitude:a,longitude:o}=t.transit_details.location,l=L.map(s).setView([a,o],12);L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors",maxZoom:18}).addTo(l),t.visualization&&t.visualization.geojson&&(console.log("Leaflet loaded:",!!window.L),console.log("Creating map for container:",s),console.log("Default icon paths:",L.Icon.Default.prototype.options),L.geoJSON(t.visualization.geojson,{style:function(c){switch(c.properties.type){case"centerline":return{color:"#2d8a2f",weight:2,opacity:.8};case"visibility_zone":return{color:"#ff3300",weight:0,fillColor:"#ff3300",fillOpacity:.15,stroke:!1};default:return{color:"#ff3300",weight:3,opacity:.9,fillOpacity:.2}}},pointToLayer:function(c,h){if(c.properties.type==="timing")return L.marker(h,{icon:L.divIcon({html:`<div style="
                                    background: rgba(255,255,255,0.8);
                                    padding: 2px 8px;
                                    border-radius: 3px;
                                    font-size: 11px;
                                    font-weight: bold;
                                    color: #333;
                                    border: 1px solid #666;
                                    text-align: center;
                                    min-width: 35px;
                                    white-space: nowrap;
                                ">${c.properties.label}s</div>`,className:"timing-label",iconSize:[24,16],iconAnchor:[12,8]})});if(c.properties.type==="position"){const d=c.properties.subtype;let u="#0066cc",g=6;return d==="photography"?(u="#cc0066",g=8):d==="optimal"?(u="#0066cc",g=7):d==="original"&&(u="#666666",g=5),L.circleMarker(h,{radius:g,fillColor:u,stroke:!1,fillOpacity:.8})}return L.circleMarker(h,{radius:5})},onEachFeature:function(c,h){c.properties&&c.properties.name&&h.bindPopup(`
                            <strong>${c.properties.name}</strong><br>
                            ${c.properties.description||""}
                        `)}}).addTo(l)),L.marker([a,o]).addTo(l).bindPopup(`
                <strong>Viewing Location</strong><br>
                ${a.toFixed(6)}°, ${o.toFixed(6)}°<br>
                Distance from Home: ${this.haversineDistance(this.blueGlobe.preferences.homeLat,this.blueGlobe.preferences.homeLon,a,o).toFixed(1)} km
            `);const n=this.blueGlobe.preferences.homeLat,i=this.blueGlobe.preferences.homeLon;return n&&i&&!e&&(L.marker([n,i]).addTo(l).bindPopup("<strong>Your Home Location</strong>"),l.fitBounds([[n,i],[a,o]],{padding:[20,20]})),l}toggleTransitMap(t,s){const e=document.getElementById(`transit-map-${t}`),a=s.querySelector(".map-btn-text");if(!e||!this._cachedTransitData||!this._cachedTransitData[t]){console.error("Map container or transit data not found");return}if(e.classList.contains("hidden")){if(e.classList.remove("hidden"),a.textContent="Hide Map",!e._leafletMap){const o=this._lockedModeActive||!1;e._leafletMap=this.showTransitMap(this._cachedTransitData[t],`transit-map-${t}`,o)}}else e.classList.add("hidden"),a.textContent="Show Map"}createCircleGeoJSON(t,s,e){const l=[];for(let n=0;n<=64;n++){const i=-n*360/64*Math.PI/180,r=t*Math.PI/180,c=s*Math.PI/180,h=e/6371,d=Math.asin(Math.sin(r)*Math.cos(h)+Math.cos(r)*Math.sin(h)*Math.cos(i)),u=c+Math.atan2(Math.sin(i)*Math.sin(h)*Math.cos(r),Math.cos(h)-Math.sin(r)*Math.sin(d)),g=d*180/Math.PI,p=u*180/Math.PI;l.push([p,g])}return{type:"Polygon",coordinates:[l]}}getHistoricalDateSuffix(){var a,o;if(!((o=(a=this.blueGlobe)==null?void 0:a.wallclock)!=null&&o.now))return"";const t=this.blueGlobe.wallclock.now(),s=Date.now();return Math.abs(t-s)/(1e3*60*60)>12?` - (Historical, from ${new Date(t).toISOString().split("T")[0]})`:""}showToast(t,s="info"){let e=document.getElementById("toast-container");e||(e=document.createElement("div"),e.id="toast-container",e.style.position="fixed",e.style.top="20px",e.style.right="20px",e.style.zIndex="9999",document.body.appendChild(e));const a={success:`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>`,error:`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>`,warning:`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>`,info:`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>`},o=`toast-${Date.now()}`,l=document.createElement("div");l.id=o,l.className=`toast-base toast-${s}`,l.innerHTML=`
            <div class="toast-icon toast-icon-${s}">
                ${a[s]}
            </div>
            <div class="toast-message">${t}</div>
            <button type="button" onclick="document.getElementById('${o}').remove()" 
                    style="margin-left: auto; padding: 0.25rem; background: transparent; border: none; color: rgba(255,255,255,0.7); cursor: pointer;">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        `,e.appendChild(l),setTimeout(()=>{document.getElementById(o)&&l.remove()},5e3)}async fetchBestTLEForTime(t,s){try{console.log(`Fetching best TLE for NORAD ${t} before ${s.toISOString()}`);const e=await fetch(`${this.blueGlobe.apiBaseUrl}/tle/${t}?timestamp_before=${encodeURIComponent(s.toISOString())}`,{method:"GET",headers:{Authorization:`Bearer ${this.blueGlobe.apiKey||"session_key"}`}});if(!e.ok)throw new Error(`TLE fetch failed: ${e.status}`);const a=await e.json();if(console.log("TLE API response:",a),!a.success||!a.data||a.data.length===0)return console.warn("No TLE found for specified time, falling back to current TLE"),{tle1:this.tle1,tle2:this.tle2};const o=a.data[0];return!o.raw_tle||!o.raw_tle.tle_line1||!o.raw_tle.tle_line2?(console.warn("Invalid TLE data received, falling back to current TLE"),{tle1:this.tle1,tle2:this.tle2}):(console.log(`Using TLE from ${o.timestamp} for time ${s.toISOString()}`),{tle1:o.raw_tle.tle_line1,tle2:o.raw_tle.tle_line2,epoch:o.timestamp})}catch(e){return console.error("Error fetching TLE for time:",e),console.warn("Falling back to current TLE"),{tle1:this.tle1,tle2:this.tle2}}}displayFromHereResults(t){const s=this.contentArea.querySelector("#celestial-results"),e={moon:"🌙",sun:"☀️",venus:"♀️",mercury:"☿️"},a={moon:"Moon",sun:"Sun",venus:"Venus",mercury:"Mercury"},o=e[t.celestial]||"🌟",l=a[t.celestial]||t.celestial,n=new Date(t.time);let i=0;t.apiResponse&&(this._cachedTransitData=this._cachedTransitData||{},i=Object.keys(this._cachedTransitData).length,this._cachedTransitData[i]=t.apiResponse);const r=`
            <div class="bg-base-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-4">
                    <h4 class="font-semibold text-white flex items-center gap-2">
                        ${o} Optimal ${l} Conjunction Found
                    </h4>
                </div>
                
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-base-content/60">Optimal Time:</span>
                            <div class="font-mono text-primary">${n.toLocaleString()}</div>
                        </div>
                        <div>
                            <span class="text-base-content/60">Location:</span>
                            <div class="font-mono">${t.lat.toFixed(6)}°, ${t.lon.toFixed(6)}°</div>
                        </div>
                        <div>
                            <span class="text-base-content/60">Separation:</span>
                            <div class="font-mono text-success">${t.separation||"Calculating..."}</div>
                        </div>
                        <div>
                            <span class="text-base-content/60">Mode:</span>
                            <div class="badge badge-accent badge-sm">From Here</div>
                        </div>
                    </div>
                    
                    ${t.apiResponse?`
                        <div class="divider divider-start text-xs">Detailed Results</div>
                        <div id="transit-details-from-here" class="bg-base-300 rounded-lg p-3">
                            ${this.formatTransitApiResponse(t.apiResponse,t.celestial,i)}
                        </div>
                    `:`
                        <div class="alert alert-info">
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span>Optimal conjunction time found! The satellite and ${l.toLowerCase()} will be closest at the time shown above.</span>
                        </div>
                    `}
                </div>
            </div>
        `;s.innerHTML=r}displayPlanetaryChallenge(t){const s=this.contentArea.querySelector("#celestial-results"),e=t.charAt(0).toUpperCase()+t.slice(1),a=`
            <div class="bg-base-200 rounded-lg p-6">
                <div class="flex items-center justify-center mb-6">
                    <h4 class="font-semibold text-white flex items-center gap-3 text-xl">
                        ${e} Transit Challenge 
                    </h4>
                </div>
                
                <div class="prose prose-sm max-w-none text-base-content/90 leading-relaxed">
                    <p>
                        While catching a satellite passing across the face of ${e} or Mercury is certainly possible in theory, 
                        and would create an impressive picture, the task is daunting.
                    </p>
                    
                    <p>
                        An object like the ISS would be so large from the magnification it would almost blot out the planet but it is also 
                        moving so quickly it would pass in just <strong class="text-warning">16 milliseconds</strong> meaning a shutter speed of 
                        <strong class="text-primary">1/1000th</strong> would be required to freeze it. That suggests only high speed film stands a chance.
                    </p>
                    
                    <p>
                        Another challenge is the path prediction error term of a satellite like the ISS, combined with the tiny errors possible with 
                        predicting where ${e} will be at the right moment means that a prediction might be accurate but miss by just 
                        the diameter of the ISS - placing the satellite off the planet entirely.
                    </p>
                    
                    <div class="alert alert-warning mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <h4 class="font-bold">Guinness World Record Territory!</h4>
                            <p class="text-sm">In summary, snapping a terresitial satellite photo bombing a planet may be .. quite a task.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;s.innerHTML=a,s.classList.remove("hidden")}}export{at as CelestialCalculator};
