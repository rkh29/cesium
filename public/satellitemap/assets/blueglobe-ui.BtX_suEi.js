const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/trains-calculator.CE8JuwZT.js","assets/main.CETTShQh.js","assets/main.2XFAytbH.css","assets/transits-calculator.Cvm8clep.js","assets/interference-calculator.D1nsl3IM.js","assets/celestial-calculator.BTRWyhq2.js","assets/altitude-history.BEHCWo-t.js"])))=>i.map(i=>d[i]);
import{_ as M,S as te,D as f,g as ye,F as ve,a as H,I as we,b as xe,G as ke,C as Se,i as Ee,c as Ce,d as V,f as se,e as ae,B as ne,H as Le,l as Ae,h as Ie,j as Me,k as Te,m as Be,n as $e}from"./main.CETTShQh.js";function $(d){return Array.isArray?Array.isArray(d):he(d)==="[object Array]"}function Fe(d){if(typeof d=="string")return d;let e=d+"";return e=="0"&&1/d==-1/0?"-0":e}function Pe(d){return d==null?"":Fe(d)}function T(d){return typeof d=="string"}function de(d){return typeof d=="number"}function De(d){return d===!0||d===!1||ze(d)&&he(d)=="[object Boolean]"}function ue(d){return typeof d=="object"}function ze(d){return ue(d)&&d!==null}function L(d){return d!=null}function K(d){return!d.trim().length}function he(d){return d==null?d===void 0?"[object Undefined]":"[object Null]":Object.prototype.toString.call(d)}const He="Incorrect 'index' type",Re=d=>`Invalid value for key ${d}`,Ne=d=>`Pattern length exceeds max of ${d}.`,Oe=d=>`Missing ${d} property in key`,je=d=>`Property 'weight' in key '${d}' must be a positive integer`,ie=Object.prototype.hasOwnProperty;class Ue{constructor(e){this._keys=[],this._keyMap={};let t=0;e.forEach(s=>{let a=pe(s);this._keys.push(a),this._keyMap[a.id]=a,t+=a.weight}),this._keys.forEach(s=>{s.weight/=t})}get(e){return this._keyMap[e]}keys(){return this._keys}toJSON(){return JSON.stringify(this._keys)}}function pe(d){let e=null,t=null,s=null,a=1,i=null;if(T(d)||$(d))s=d,e=oe(d),t=G(d);else{if(!ie.call(d,"name"))throw new Error(Oe("name"));const n=d.name;if(s=n,ie.call(d,"weight")&&(a=d.weight,a<=0))throw new Error(je(n));e=oe(n),t=G(n),i=d.getFn}return{path:e,id:t,weight:a,src:s,getFn:i}}function oe(d){return $(d)?d:d.split(".")}function G(d){return $(d)?d.join("."):d}function qe(d,e){let t=[],s=!1;const a=(i,n,o)=>{if(L(i))if(!n[o])t.push(i);else{let l=n[o];const r=i[l];if(!L(r))return;if(o===n.length-1&&(T(r)||de(r)||De(r)))t.push(Pe(r));else if($(r)){s=!0;for(let c=0,g=r.length;c<g;c+=1)a(r[c],n,o+1)}else n.length&&a(r,n,o+1)}};return a(d,T(e)?e.split("."):e,0),s?t:t[0]}const Ve={includeMatches:!1,findAllMatches:!1,minMatchCharLength:1},Ke={isCaseSensitive:!1,ignoreDiacritics:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:(d,e)=>d.score===e.score?d.idx<e.idx?-1:1:d.score<e.score?-1:1},Ge={location:0,threshold:.6,distance:100},We={useExtendedSearch:!1,getFn:qe,ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1};var m={...Ke,...Ve,...Ge,...We};const Ze=/[^ ]+/g;function Ye(d=1,e=3){const t=new Map,s=Math.pow(10,e);return{get(a){const i=a.match(Ze).length;if(t.has(i))return t.get(i);const n=1/Math.pow(i,.5*d),o=parseFloat(Math.round(n*s)/s);return t.set(i,o),o},clear(){t.clear()}}}class Q{constructor({getFn:e=m.getFn,fieldNormWeight:t=m.fieldNormWeight}={}){this.norm=Ye(t,3),this.getFn=e,this.isCreated=!1,this.setIndexRecords()}setSources(e=[]){this.docs=e}setIndexRecords(e=[]){this.records=e}setKeys(e=[]){this.keys=e,this._keysMap={},e.forEach((t,s)=>{this._keysMap[t.id]=s})}create(){this.isCreated||!this.docs.length||(this.isCreated=!0,T(this.docs[0])?this.docs.forEach((e,t)=>{this._addString(e,t)}):this.docs.forEach((e,t)=>{this._addObject(e,t)}),this.norm.clear())}add(e){const t=this.size();T(e)?this._addString(e,t):this._addObject(e,t)}removeAt(e){this.records.splice(e,1);for(let t=e,s=this.size();t<s;t+=1)this.records[t].i-=1}getValueForItemAtKeyId(e,t){return e[this._keysMap[t]]}size(){return this.records.length}_addString(e,t){if(!L(e)||K(e))return;let s={v:e,i:t,n:this.norm.get(e)};this.records.push(s)}_addObject(e,t){let s={i:t,$:{}};this.keys.forEach((a,i)=>{let n=a.getFn?a.getFn(e):this.getFn(e,a.path);if(L(n)){if($(n)){let o=[];const l=[{nestedArrIndex:-1,value:n}];for(;l.length;){const{nestedArrIndex:r,value:c}=l.pop();if(L(c))if(T(c)&&!K(c)){let g={v:c,i:r,n:this.norm.get(c)};o.push(g)}else $(c)&&c.forEach((g,u)=>{l.push({nestedArrIndex:u,value:g})})}s.$[i]=o}else if(T(n)&&!K(n)){let o={v:n,n:this.norm.get(n)};s.$[i]=o}}}),this.records.push(s)}toJSON(){return{keys:this.keys,records:this.records}}}function ge(d,e,{getFn:t=m.getFn,fieldNormWeight:s=m.fieldNormWeight}={}){const a=new Q({getFn:t,fieldNormWeight:s});return a.setKeys(d.map(pe)),a.setSources(e),a.create(),a}function Xe(d,{getFn:e=m.getFn,fieldNormWeight:t=m.fieldNormWeight}={}){const{keys:s,records:a}=d,i=new Q({getFn:e,fieldNormWeight:t});return i.setKeys(s),i.setIndexRecords(a),i}function j(d,{errors:e=0,currentLocation:t=0,expectedLocation:s=0,distance:a=m.distance,ignoreLocation:i=m.ignoreLocation}={}){const n=e/d.length;if(i)return n;const o=Math.abs(s-t);return a?n+o/a:o?1:n}function Je(d=[],e=m.minMatchCharLength){let t=[],s=-1,a=-1,i=0;for(let n=d.length;i<n;i+=1){let o=d[i];o&&s===-1?s=i:!o&&s!==-1&&(a=i-1,a-s+1>=e&&t.push([s,a]),s=-1)}return d[i-1]&&i-s>=e&&t.push([s,i-1]),t}const z=32;function Qe(d,e,t,{location:s=m.location,distance:a=m.distance,threshold:i=m.threshold,findAllMatches:n=m.findAllMatches,minMatchCharLength:o=m.minMatchCharLength,includeMatches:l=m.includeMatches,ignoreLocation:r=m.ignoreLocation}={}){if(e.length>z)throw new Error(Ne(z));const c=e.length,g=d.length,u=Math.max(0,Math.min(s,g));let h=i,p=u;const b=o>1||l,_=b?Array(g):[];let y;for(;(y=d.indexOf(e,p))>-1;){let k=j(e,{currentLocation:y,expectedLocation:u,distance:a,ignoreLocation:r});if(h=Math.min(k,h),p=y+c,b){let B=0;for(;B<c;)_[y+B]=1,B+=1}}p=-1;let v=[],w=1,x=c+g;const S=1<<c-1;for(let k=0;k<c;k+=1){let B=0,A=x;for(;B<A;)j(e,{errors:k,currentLocation:u+A,expectedLocation:u,distance:a,ignoreLocation:r})<=h?B=A:x=A,A=Math.floor((x-B)/2+B);x=A;let D=Math.max(1,u-A+1),E=n?g:Math.min(u+A,g)+c,F=Array(E+2);F[E+1]=(1<<k)-1;for(let I=E;I>=D;I-=1){let O=I-1,ee=t[d.charAt(O)];if(b&&(_[O]=+!!ee),F[I]=(F[I+1]<<1|1)&ee,k&&(F[I]|=(v[I+1]|v[I])<<1|1|v[I+1]),F[I]&S&&(w=j(e,{errors:k,currentLocation:O,expectedLocation:u,distance:a,ignoreLocation:r}),w<=h)){if(h=w,p=O,p<=u)break;D=Math.max(1,2*u-p)}}if(j(e,{errors:k+1,currentLocation:u,expectedLocation:u,distance:a,ignoreLocation:r})>h)break;v=F}const C={isMatch:p>=0,score:Math.max(.001,w)};if(b){const k=Je(_,o);k.length?l&&(C.indices=k):C.isMatch=!1}return C}function et(d){let e={};for(let t=0,s=d.length;t<s;t+=1){const a=d.charAt(t);e[a]=(e[a]||0)|1<<s-t-1}return e}const U=String.prototype.normalize?d=>d.normalize("NFD").replace(/[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]/g,""):d=>d;class fe{constructor(e,{location:t=m.location,threshold:s=m.threshold,distance:a=m.distance,includeMatches:i=m.includeMatches,findAllMatches:n=m.findAllMatches,minMatchCharLength:o=m.minMatchCharLength,isCaseSensitive:l=m.isCaseSensitive,ignoreDiacritics:r=m.ignoreDiacritics,ignoreLocation:c=m.ignoreLocation}={}){if(this.options={location:t,threshold:s,distance:a,includeMatches:i,findAllMatches:n,minMatchCharLength:o,isCaseSensitive:l,ignoreDiacritics:r,ignoreLocation:c},e=l?e:e.toLowerCase(),e=r?U(e):e,this.pattern=e,this.chunks=[],!this.pattern.length)return;const g=(h,p)=>{this.chunks.push({pattern:h,alphabet:et(h),startIndex:p})},u=this.pattern.length;if(u>z){let h=0;const p=u%z,b=u-p;for(;h<b;)g(this.pattern.substr(h,z),h),h+=z;if(p){const _=u-z;g(this.pattern.substr(_),_)}}else g(this.pattern,0)}searchIn(e){const{isCaseSensitive:t,ignoreDiacritics:s,includeMatches:a}=this.options;if(e=t?e:e.toLowerCase(),e=s?U(e):e,this.pattern===e){let b={isMatch:!0,score:0};return a&&(b.indices=[[0,e.length-1]]),b}const{location:i,distance:n,threshold:o,findAllMatches:l,minMatchCharLength:r,ignoreLocation:c}=this.options;let g=[],u=0,h=!1;this.chunks.forEach(({pattern:b,alphabet:_,startIndex:y})=>{const{isMatch:v,score:w,indices:x}=Qe(e,b,_,{location:i+y,distance:n,threshold:o,findAllMatches:l,minMatchCharLength:r,includeMatches:a,ignoreLocation:c});v&&(h=!0),u+=w,v&&x&&(g=[...g,...x])});let p={isMatch:h,score:h?u/this.chunks.length:1};return h&&a&&(p.indices=g),p}}class P{constructor(e){this.pattern=e}static isMultiMatch(e){return re(e,this.multiRegex)}static isSingleMatch(e){return re(e,this.singleRegex)}search(){}}function re(d,e){const t=d.match(e);return t?t[1]:null}class tt extends P{constructor(e){super(e)}static get type(){return"exact"}static get multiRegex(){return/^="(.*)"$/}static get singleRegex(){return/^=(.*)$/}search(e){const t=e===this.pattern;return{isMatch:t,score:t?0:1,indices:[0,this.pattern.length-1]}}}class st extends P{constructor(e){super(e)}static get type(){return"inverse-exact"}static get multiRegex(){return/^!"(.*)"$/}static get singleRegex(){return/^!(.*)$/}search(e){const s=e.indexOf(this.pattern)===-1;return{isMatch:s,score:s?0:1,indices:[0,e.length-1]}}}class at extends P{constructor(e){super(e)}static get type(){return"prefix-exact"}static get multiRegex(){return/^\^"(.*)"$/}static get singleRegex(){return/^\^(.*)$/}search(e){const t=e.startsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,this.pattern.length-1]}}}class nt extends P{constructor(e){super(e)}static get type(){return"inverse-prefix-exact"}static get multiRegex(){return/^!\^"(.*)"$/}static get singleRegex(){return/^!\^(.*)$/}search(e){const t=!e.startsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}}class it extends P{constructor(e){super(e)}static get type(){return"suffix-exact"}static get multiRegex(){return/^"(.*)"\$$/}static get singleRegex(){return/^(.*)\$$/}search(e){const t=e.endsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[e.length-this.pattern.length,e.length-1]}}}class ot extends P{constructor(e){super(e)}static get type(){return"inverse-suffix-exact"}static get multiRegex(){return/^!"(.*)"\$$/}static get singleRegex(){return/^!(.*)\$$/}search(e){const t=!e.endsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}}class be extends P{constructor(e,{location:t=m.location,threshold:s=m.threshold,distance:a=m.distance,includeMatches:i=m.includeMatches,findAllMatches:n=m.findAllMatches,minMatchCharLength:o=m.minMatchCharLength,isCaseSensitive:l=m.isCaseSensitive,ignoreDiacritics:r=m.ignoreDiacritics,ignoreLocation:c=m.ignoreLocation}={}){super(e),this._bitapSearch=new fe(e,{location:t,threshold:s,distance:a,includeMatches:i,findAllMatches:n,minMatchCharLength:o,isCaseSensitive:l,ignoreDiacritics:r,ignoreLocation:c})}static get type(){return"fuzzy"}static get multiRegex(){return/^"(.*)"$/}static get singleRegex(){return/^(.*)$/}search(e){return this._bitapSearch.searchIn(e)}}class me extends P{constructor(e){super(e)}static get type(){return"include"}static get multiRegex(){return/^'"(.*)"$/}static get singleRegex(){return/^'(.*)$/}search(e){let t=0,s;const a=[],i=this.pattern.length;for(;(s=e.indexOf(this.pattern,t))>-1;)t=s+i,a.push([s,t-1]);const n=!!a.length;return{isMatch:n,score:n?0:1,indices:a}}}const W=[tt,me,at,nt,ot,it,st,be],le=W.length,rt=/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/,lt="|";function ct(d,e={}){return d.split(lt).map(t=>{let s=t.trim().split(rt).filter(i=>i&&!!i.trim()),a=[];for(let i=0,n=s.length;i<n;i+=1){const o=s[i];let l=!1,r=-1;for(;!l&&++r<le;){const c=W[r];let g=c.isMultiMatch(o);g&&(a.push(new c(g,e)),l=!0)}if(!l)for(r=-1;++r<le;){const c=W[r];let g=c.isSingleMatch(o);if(g){a.push(new c(g,e));break}}}return a})}const dt=new Set([be.type,me.type]);class ut{constructor(e,{isCaseSensitive:t=m.isCaseSensitive,ignoreDiacritics:s=m.ignoreDiacritics,includeMatches:a=m.includeMatches,minMatchCharLength:i=m.minMatchCharLength,ignoreLocation:n=m.ignoreLocation,findAllMatches:o=m.findAllMatches,location:l=m.location,threshold:r=m.threshold,distance:c=m.distance}={}){this.query=null,this.options={isCaseSensitive:t,ignoreDiacritics:s,includeMatches:a,minMatchCharLength:i,findAllMatches:o,ignoreLocation:n,location:l,threshold:r,distance:c},e=t?e:e.toLowerCase(),e=s?U(e):e,this.pattern=e,this.query=ct(this.pattern,this.options)}static condition(e,t){return t.useExtendedSearch}searchIn(e){const t=this.query;if(!t)return{isMatch:!1,score:1};const{includeMatches:s,isCaseSensitive:a,ignoreDiacritics:i}=this.options;e=a?e:e.toLowerCase(),e=i?U(e):e;let n=0,o=[],l=0;for(let r=0,c=t.length;r<c;r+=1){const g=t[r];o.length=0,n=0;for(let u=0,h=g.length;u<h;u+=1){const p=g[u],{isMatch:b,indices:_,score:y}=p.search(e);if(b){if(n+=1,l+=y,s){const v=p.constructor.type;dt.has(v)?o=[...o,..._]:o.push(_)}}else{l=0,n=0,o.length=0;break}}if(n){let u={isMatch:!0,score:l/n};return s&&(u.indices=o),u}}return{isMatch:!1,score:1}}}const Z=[];function ht(...d){Z.push(...d)}function Y(d,e){for(let t=0,s=Z.length;t<s;t+=1){let a=Z[t];if(a.condition(d,e))return new a(d,e)}return new fe(d,e)}const q={AND:"$and",OR:"$or"},X={PATH:"$path",PATTERN:"$val"},J=d=>!!(d[q.AND]||d[q.OR]),pt=d=>!!d[X.PATH],gt=d=>!$(d)&&ue(d)&&!J(d),ce=d=>({[q.AND]:Object.keys(d).map(e=>({[e]:d[e]}))});function _e(d,e,{auto:t=!0}={}){const s=a=>{let i=Object.keys(a);const n=pt(a);if(!n&&i.length>1&&!J(a))return s(ce(a));if(gt(a)){const l=n?a[X.PATH]:i[0],r=n?a[X.PATTERN]:a[l];if(!T(r))throw new Error(Re(l));const c={keyId:G(l),pattern:r};return t&&(c.searcher=Y(r,e)),c}let o={children:[],operator:i[0]};return i.forEach(l=>{const r=a[l];$(r)&&r.forEach(c=>{o.children.push(s(c))})}),o};return J(d)||(d=ce(d)),s(d)}function ft(d,{ignoreFieldNorm:e=m.ignoreFieldNorm}){d.forEach(t=>{let s=1;t.matches.forEach(({key:a,norm:i,score:n})=>{const o=a?a.weight:null;s*=Math.pow(n===0&&o?Number.EPSILON:n,(o||1)*(e?1:i))}),t.score=s})}function bt(d,e){const t=d.matches;e.matches=[],L(t)&&t.forEach(s=>{if(!L(s.indices)||!s.indices.length)return;const{indices:a,value:i}=s;let n={indices:a,value:i};s.key&&(n.key=s.key.src),s.idx>-1&&(n.refIndex=s.idx),e.matches.push(n)})}function mt(d,e){e.score=d.score}function _t(d,e,{includeMatches:t=m.includeMatches,includeScore:s=m.includeScore}={}){const a=[];return t&&a.push(bt),s&&a.push(mt),d.map(i=>{const{idx:n}=i,o={item:e[n],refIndex:n};return a.length&&a.forEach(l=>{l(i,o)}),o})}class R{constructor(e,t={},s){this.options={...m,...t},this.options.useExtendedSearch,this._keyStore=new Ue(this.options.keys),this.setCollection(e,s)}setCollection(e,t){if(this._docs=e,t&&!(t instanceof Q))throw new Error(He);this._myIndex=t||ge(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}add(e){L(e)&&(this._docs.push(e),this._myIndex.add(e))}remove(e=()=>!1){const t=[];for(let s=0,a=this._docs.length;s<a;s+=1){const i=this._docs[s];e(i,s)&&(this.removeAt(s),s-=1,a-=1,t.push(i))}return t}removeAt(e){this._docs.splice(e,1),this._myIndex.removeAt(e)}getIndex(){return this._myIndex}search(e,{limit:t=-1}={}){const{includeMatches:s,includeScore:a,shouldSort:i,sortFn:n,ignoreFieldNorm:o}=this.options;let l=T(e)?T(this._docs[0])?this._searchStringList(e):this._searchObjectList(e):this._searchLogical(e);return ft(l,{ignoreFieldNorm:o}),i&&l.sort(n),de(t)&&t>-1&&(l=l.slice(0,t)),_t(l,this._docs,{includeMatches:s,includeScore:a})}_searchStringList(e){const t=Y(e,this.options),{records:s}=this._myIndex,a=[];return s.forEach(({v:i,i:n,n:o})=>{if(!L(i))return;const{isMatch:l,score:r,indices:c}=t.searchIn(i);l&&a.push({item:i,idx:n,matches:[{score:r,value:i,norm:o,indices:c}]})}),a}_searchLogical(e){const t=_e(e,this.options),s=(o,l,r)=>{if(!o.children){const{keyId:g,searcher:u}=o,h=this._findMatches({key:this._keyStore.get(g),value:this._myIndex.getValueForItemAtKeyId(l,g),searcher:u});return h&&h.length?[{idx:r,item:l,matches:h}]:[]}const c=[];for(let g=0,u=o.children.length;g<u;g+=1){const h=o.children[g],p=s(h,l,r);if(p.length)c.push(...p);else if(o.operator===q.AND)return[]}return c},a=this._myIndex.records,i={},n=[];return a.forEach(({$:o,i:l})=>{if(L(o)){let r=s(t,o,l);r.length&&(i[l]||(i[l]={idx:l,item:o,matches:[]},n.push(i[l])),r.forEach(({matches:c})=>{i[l].matches.push(...c)}))}}),n}_searchObjectList(e){const t=Y(e,this.options),{keys:s,records:a}=this._myIndex,i=[];return a.forEach(({$:n,i:o})=>{if(!L(n))return;let l=[];s.forEach((r,c)=>{l.push(...this._findMatches({key:r,value:n[c],searcher:t}))}),l.length&&i.push({idx:o,item:n,matches:l})}),i}_findMatches({key:e,value:t,searcher:s}){if(!L(t))return[];let a=[];if($(t))t.forEach(({v:i,i:n,n:o})=>{if(!L(i))return;const{isMatch:l,score:r,indices:c}=s.searchIn(i);l&&a.push({score:r,key:e,value:i,idx:n,norm:o,indices:c})});else{const{v:i,n}=t,{isMatch:o,score:l,indices:r}=s.searchIn(i);o&&a.push({score:l,key:e,value:i,norm:n,indices:r})}return a}}R.version="7.1.0";R.createIndex=ge;R.parseIndex=Xe;R.config=m;R.parseQuery=_e;ht(ut);class yt{constructor(){this.fuse=null,this.documents=[],this.isInitialized=!1,this.fuseLoaded=!0,console.log("Fuse.js loaded successfully via import")}async initialize(){const e={includeScore:!0,includeMatches:!0,useExtendedSearch:!0,threshold:.3,distance:100,minMatchCharLength:1,keys:[{name:"norad_id",weight:90},{name:"sat_name",weight:10},{name:"constellation_name",weight:6},{name:"intldes",weight:90},{name:"sat_type",weight:4},{name:"owner",weight:3},{name:"purpose",weight:2},{name:"description",weight:1},{name:"tags",weight:2}]};this.fuse=new R([],e),this.isInitialized=!0,console.log("IncrementalSearch initialized successfully")}async populateFromAPI(e){this.isInitialized||await this.initialize();try{const t=Array.isArray(e)?e:e.satellites||e.items||[],s=[];for(const a of t){const i=this._normalizeDocument(a);i&&s.push(i)}return this.documents=s,this.fuse.setCollection(this.documents),console.log(`Added ${s.length} documents to search index`),s.length}catch(t){throw console.error("Error populating search index:",t),t}}_normalizeDocument(e){if(!e||typeof e!="object")return null;const t=e.id||e.noradId||e.norad_id||e.intlDesignator||e.intl_designator||`doc_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;return{id:String(t),sat_name:e.sat_name||e.name||e.satelliteName||e.object_name||"",norad_id:String(e.norad_id||e.noradId||""),intldes:e.intldes||e.intlDesignator||e.intl_designator||e.international_designator||"",sat_type:e.sat_type||e.objectType||e.object_type||e.type||"satellite",status:e.status||"",launch_date:e.launch_date||e.launchDate||"",decay_date:e.decay_date||e.decayDate||"",country:e.country||"",constellation_name:e.constellation_name||e.constellation||"",hardware_name:e.hardware_name||e.hardware||"",owner:e.owner||e.operator||e.country||"",purpose:e.purpose||e.mission||e.category||"",description:e.description||e.comments||"",tags:this._extractTags(e),nna:e.nna||!1,_original:e}}_extractTags(e){const t=[];return e.rcs_size&&t.push(`rcs_${e.rcs_size}`),e.launch_year&&t.push(`launch_${e.launch_year}`),e.launch_date&&t.push(`launched_${e.launch_date.substring(0,4)}`),e.decay_date&&t.push("decayed"),e.operational_status&&t.push(e.operational_status),e.orbit_class&&t.push(e.orbit_class),e.orbit_type&&t.push(e.orbit_type),e.tags&&Array.isArray(e.tags)&&t.push(...e.tags),t.join(" ")}addDocument(e){if(!this.isInitialized)throw new Error("Search index not initialized");this.documents.push(e),this.fuse.setCollection(this.documents)}updateDocument(e){if(!this.isInitialized)throw new Error("Search index not initialized");const t=this.documents.findIndex(s=>s.id===e.id);t!==-1&&(this.documents[t]=e,this.fuse.setCollection(this.documents))}removeDocument(e){if(!this.isInitialized)throw new Error("Search index not initialized");this.documents=this.documents.filter(t=>t.id!==e),this.fuse.setCollection(this.documents)}search(e,t={}){if(!this.isInitialized)throw new Error("Search index not initialized");if(!e||typeof e!="string")return[];try{const s=this.fuse.search(e),a=e.toLowerCase();return s.sort((i,n)=>{const o=(i.item.sat_name||"").toLowerCase(),l=(n.item.sat_name||"").toLowerCase(),r=o===a,c=l===a,g=o.startsWith(a),u=l.startsWith(a);return r!==c?r?-1:1:g!==u?g?-1:1:(i.score||0)-(n.score||0)}),s.map(i=>({score:typeof i.score=="number"?Math.round((1-i.score)*100)+"%":"",ref:i.item.id,document:i.item,original:i.item._original,matches:i.matches}))}catch(s){return console.error("Search error:",s),[]}}getSuggestions(e,t=10){if(!e||e.length<2)return[];const s=this.search(e),a=new Set;return s.slice(0,t*2).forEach(i=>{const n=i.document;n&&(n.name&&n.name.toLowerCase().includes(e.toLowerCase())&&a.add(n.name),n.constellation&&n.constellation.toLowerCase().includes(e.toLowerCase())&&a.add(n.constellation),n.noradId&&n.noradId.includes(e)&&a.add(n.noradId))}),Array.from(a).slice(0,t)}getStats(){return{totalDocuments:this.documents.length,isInitialized:this.isInitialized,fuseLoaded:this.fuseLoaded,searchKeys:this.fuse?this.fuse.options.keys.map(e=>e.name):[]}}clear(){this.fuse&&this.fuse.setCollection([]),this.documents=[],this.isInitialized=!1}}class vt{constructor(e){this.ui=e,this.parent=e.parent,this.modal=null,this.currentFunction=null,this.selectedFunctionKey=null,this.functionInstances=new Map,this.functionContentAreas=new Map,this.functionResults=new Map,this.functions={trains:{name:"Trains",description:"Calculate satellite train overflights for your location",icon:`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v8a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-1M6 16h2M6 8h6"/>
                </svg>`},transits:{name:"Transits",description:"Calculate satellite overflights for your location",icon:`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg>`},interference:{name:"Interference",description:"Find when other satellites interfere with line of sight",icon:`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>`},celestial:{name:"Celestial",description:"Find when satellites transit close to Moon and Sun",icon:`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                    <circle cx="12" cy="12" r="5"/>
                </svg>`},altitude:{name:"Altitude History",description:"Track satellite orbital decay and altitude changes over time",icon:`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>`}}}getCalculatorsList(){return["trains","transits","interference","celestial","altitude"].map(t=>({key:t,name:this.functions[t].name,description:this.functions[t].description,icon:this.functions[t].icon,url:this.getCalculatorUrl(t)}))}getCalculatorByKey(e){return this.functions[e]||null}getCalculatorUrl(e){return{trains:"/vis/trains",transits:"/vis/sky-transits",interference:"/vis/interference",celestial:"/vis/transit-finder",altitude:"/vis/altitude-history"}[e]||`/vis/calculators?type=${e}`}getCalculatorKeyFromUrl(e){return{"/vis/transit-finder":"celestial","/vis/interference":"interference","/vis/trains":"trains","/vis/sky-transits":"transits","/vis/altitude-history":"altitude","/transit-finder":"celestial","/interference":"interference","/sky-transits":"transits","/altitude-history":"altitude"}[e]||null}async openCalculator(e,t={},s={},a=null,i=null,n=null){if(t&&t.norad){const o=await this.parent._smartInject(t.norad);o&&(i=o.oe,a=o.satelliteData,n=o.detailedData,console.log("openCalculator() loaded satellite "+t.norad))}if(s&&(s.norad_id||s.sat_name)){const o=await this.parent._smartInject(s.norad_id?s.norad_id:s.sat_name);o&&(i=o.oe,a=o.satelliteData,n=o.detailedData,console.log("openCalculator() alternative loaded satellite "+s.sat_name))}this.selectedFunctionKey=e,await this.showFunctionsModal(a,i,n),e==="altitude"&&t.norad&&setTimeout(()=>{const o=document.querySelector("#satellite-norads");if(o){o.value=t.norad;const l=this.currentFunction;l&&l.loadAltitudeDataFromUI&&l.loadAltitudeDataFromUI()}},100)}createFunctionsButton(e,t,s){const a=document.createElement("button");return a.innerHTML=`
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <text x="1" y="18" font-family="monospace" font-size="18" font-weight="bold">f</text>
                <text x="12" y="22" font-family="monospace" font-size="12" font-weight="bold">x</text>
            </svg>
        `,a.title="Satellite Functions & Calculations",a.addEventListener("click",()=>{const i=document.getElementById("satellite_info_panel");i&&(i.style.display="none"),this.showFunctionsModal(e,t,s)}),a}_ensureModal(){if(!this.modal){this.modal=document.createElement("div"),this.modal.id="functions_modal",this.modal.className="modal",this.modal.innerHTML=`
                <div class="modal-box w-11/12 max-w-6xl">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-lg" id="functions_modal_title">Satellite Functions</h3>
                        <button type="button" class="my-close-button" id="functions_modal_close">✕</button>
                    </div>
                    <small>(Find any specific satellite using search, and use Actions .. <i>f</i><sub>x</sub> button to use the calculators for that satellite)
                    
                    <!-- Function selector - responsive tabs/dropdown -->
                    <div class="mb-4">
                        <!-- Desktop tabs -->
                        <div class="calculator-tabs-desktop" id="functions_tabs_desktop">
                            <!-- Desktop tabs will be populated dynamically -->
                        </div>
                        
                        <!-- Mobile dropdown -->
                        <div class="calculator-dropdown-mobile relative">
                            <button id="functions_dropdown_toggle" data-dropdown-toggle="functions_dropdown_menu" class="w-full flex items-center justify-between px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 hover:bg-gray-600" type="button">
                                <span id="functions_dropdown_label" class="flex items-center">Select Calculator</span>
                                <svg class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            <div id="functions_dropdown_menu" class="hidden absolute top-full left-0 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50">
                                <!-- Mobile dropdown items will be populated dynamically -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- Function content area -->
                    <div id="functions_content">
                        <!-- Content will be populated by selected function -->
                    </div>
                </div>
                <div class="modal-backdrop" id="functions_modal_backdrop"></div>
            `;const e=this.modal.querySelector("#functions_modal_close"),t=this.modal.querySelector("#functions_modal_backdrop"),s=()=>{if(this.selectedFunctionKey){const a=this.modal.querySelector("#functions_content");a&&(console.log(`Saving content for ${this.selectedFunctionKey} before modal close`),this.functionContentAreas.set(this.selectedFunctionKey,a.innerHTML))}this.modal.classList.remove("modal-open")};e.addEventListener("click",s),t.addEventListener("click",s),document.body.appendChild(this.modal)}return this.modal}async showFunctionsModal(e,t,s){const a=this._ensureModal(),i=a.querySelector("#functions_tabs_desktop"),n=a.querySelector("#functions_dropdown_label"),o=a.querySelector("#functions_dropdown_menu"),l=a.querySelector("#functions_content"),r=a.querySelector("#functions_modal_title");if(e)this.satelliteData=e,this.oe=t,this.detailedData=s;else if(console.warn("arg satelliteData is null"),this.satelliteData)e=this.satelliteData,t=this.oe,s=this.detailedData;else if(this.selectedFunctionKey!=="trains"){const h=await this.parent._smartInject("25544");h?(this.satelliteData=e=h.satelliteData,this.oe=t=h.oe,this.detailedData=s=h.detailedData,this.ui._showToast("Loaded the ISS by default","info",4e3)):this.ui._showToast("Failed to load the ISS","error",4e3)}const c=(s==null?void 0:s.sat_name)||(e==null?void 0:e.name)||"Unknown Satellite";this.selectedFunctionKey!="trains"?r.textContent=`Calculators: ${c}`:r.textContent="Calculators",i.innerHTML="",o.innerHTML="";const g=async h=>{if(this.satelliteData&&this.satelliteData.norad_id){const y={interference:`/vis/interference/${this.satelliteData.norad_id}`,celestial:`/vis/transit-finder/${this.satelliteData.norad_id}`,trains:"/vis/trains",transits:`/vis/sky-transits/${this.satelliteData.norad_id}`,altitude:`/vis/altitude-history?norad=${this.satelliteData.norad_id}`}[h];y&&window.appRouter?(window.appRouter.navigate(y),console.warn("navigate to "+y)):console.warn("failed to navigate to long url")}else console.warn("class has no satelliteData");i.querySelectorAll("button").forEach(_=>{_.classList.remove("bg-blue-600","text-white"),_.classList.add("bg-gray-700","text-gray-300","hover:bg-gray-600","hover:text-white")});const p=i.querySelector(`[data-function="${h}"]`);p&&(p.classList.remove("bg-gray-700","text-gray-300","hover:bg-gray-600","hover:text-white"),p.classList.add("bg-blue-600","text-white"));const b=this.functions[h];b&&(n.innerHTML=`${b.icon} <span class="ml-2">${b.name}</span>`),this.selectedFunctionKey=h,await this.loadFunction(h,e,t,s,l)};Object.entries(this.functions).forEach(([h,p],b)=>{const _=this.selectedFunctionKey===h||!this.selectedFunctionKey&&b===0,y=document.createElement("button");y.className=`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${_?"bg-blue-600 text-white":"bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"}`,y.innerHTML=`${p.icon} <span class="text-sm font-medium">${p.name}</span>`,y.title=p.description,y.dataset.function=h,y.addEventListener("click",()=>g(h)),i.appendChild(y);const v=document.createElement("button");v.className="w-full flex items-center px-4 py-2 text-left text-gray-200 hover:bg-gray-600 hover:text-white",v.innerHTML=`${p.icon} <span class="ml-2">${p.name}</span>`,v.dataset.function=h,v.addEventListener("click",()=>{o.classList.add("hidden"),g(h)}),o.appendChild(v),_&&(n.innerHTML=`${p.icon} <span class="ml-2">${p.name}</span>`)}),a.classList.add("modal-open");const u=this.selectedFunctionKey||Object.keys(this.functions)[0];u&&await this.loadFunction(u,e,t,s,l)}async loadFunction(e,t,s,a,i){const n=this.functions[e];if(!n){i.innerHTML='<div class="alert alert-error">Function not found</div>';return}this.currentFunction&&this.selectedFunctionKey&&this.selectedFunctionKey!==e&&(console.log(`Saving content for ${this.selectedFunctionKey} before switching to ${e}`),this.functionContentAreas.set(this.selectedFunctionKey,i.innerHTML));const o=this.functionContentAreas.get(e);if(o){console.log(`Restoring cached content for ${e}`),i.innerHTML=o;let l=this.functionInstances.get(e);if(l)l.satelliteData=t,l.oe=s,l.detailedData=a,l.ui=this.ui,l.controller=this;else{let r;switch(e){case"trains":r=(await M(()=>import("./trains-calculator.CE8JuwZT.js"),__vite__mapDeps([0,1,2]))).TrainsCalculator;break;case"transits":r=(await M(()=>import("./transits-calculator.Cvm8clep.js"),__vite__mapDeps([3,1,2]))).TransitsCalculator;break;case"interference":r=(await M(()=>import("./interference-calculator.D1nsl3IM.js"),__vite__mapDeps([4,1,2]))).InterferenceCalculator;break;case"celestial":r=(await M(()=>import("./celestial-calculator.BTRWyhq2.js"),__vite__mapDeps([5,1,2]))).CelestialCalculator;break;case"altitude":r=(await M(()=>import("./altitude-history.BEHCWo-t.js"),__vite__mapDeps([6,1,2]))).AltitudeHistory;break;default:console.error(`Unknown function key: ${e}`);return}l=new r(this.parent,t,s,a,this.ui,this),this.functionInstances.set(e,l)}this.currentFunction=l;try{await this.currentFunction.initialize(i)}catch(r){console.error(`Error re-initializing function ${e}:`,r)}return}i.innerHTML=`
            <div class="loading loading-spinner loading-lg mx-auto block"></div>
            <p class="text-center mt-4">Loading ${n.name}...</p>
        `;try{let l=this.functionInstances.get(e);if(l)l.satelliteData=t,l.oe=s,l.detailedData=a,l.ui=this.ui,l.controller=this;else{let r;switch(e){case"trains":r=(await M(()=>import("./trains-calculator.CE8JuwZT.js"),__vite__mapDeps([0,1,2]))).TrainsCalculator;break;case"transits":r=(await M(()=>import("./transits-calculator.Cvm8clep.js"),__vite__mapDeps([3,1,2]))).TransitsCalculator;break;case"interference":r=(await M(()=>import("./interference-calculator.D1nsl3IM.js"),__vite__mapDeps([4,1,2]))).InterferenceCalculator;break;case"celestial":r=(await M(()=>import("./celestial-calculator.BTRWyhq2.js"),__vite__mapDeps([5,1,2]))).CelestialCalculator;break;case"altitude":r=(await M(()=>import("./altitude-history.BEHCWo-t.js"),__vite__mapDeps([6,1,2]))).AltitudeHistory;break;default:console.error(`Unknown function key: ${e}`);return}l=new r(this.parent,t,s,a,this.ui,this),this.functionInstances.set(e,l)}this.currentFunction=l,await this.currentFunction.initialize(i)}catch(l){console.error(`Error loading function ${e}:`,l),i.innerHTML=`
                <div class="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Error loading function: ${l.message}</span>
                </div>
            `}}onCalculationComplete(e,t,s=null){s&&this.functionResults.set(e,s);const a=document.getElementById("functions_modal");if(!(a&&a.classList.contains("modal-open"))){let n="Calculation completed";e==="interference"?n=`Found ${t} interference events`:e==="transits"&&(n=`Found ${t} transit events`),this.ui._showToast(n,"success",4e3),this.functionContentAreas.delete(e)}}async handleCalculationResult(e,t,s){try{const a=await t,i=document.getElementById("functions_modal");return i&&i.classList.contains("modal-open")||this.ui._showToast(s||"Calculation completed","success",4e3),a}catch(a){const i=document.getElementById("functions_modal");throw i&&i.classList.contains("modal-open")||this.ui._showToast("Calculation failed","error",4e3),a}}registerFunction(e,t){this.functions[e]&&console.warn(`Function '${e}' already exists and will be overwritten`),this.functions[e]=t}cleanup(){if(this.currentFunction&&this.selectedFunctionKey){const e=document.querySelector("#functions_content");e&&this.functionContentAreas.set(this.selectedFunctionKey,e.innerHTML)}this.currentFunction&&typeof this.currentFunction.cleanup=="function"&&this.currentFunction.cleanup()}}class xt{constructor(e){this.parent=e,this.canvas=this.parent.canvas,this.gl=this.parent.gl,this.preferences=this.parent.preferences,this.functionsController=new vt(this),this.parent.allToolbarButtons={btn0:{id:"btn0",src:"group.svg",alt:"Constellation",title:"Constellation Filter"},btn11:{id:"btn11",src:"filter.svg",alt:"Type",title:"Type Filter"},btn13:{id:"btn13",src:"automatic.svg",alt:"Labels",title:"Auto Labels"},btn1:{id:"btn1",src:"world-svgrepo-com.svg",alt:"Borders",title:"Country Borders"},btn2:{id:"btn2",src:"globe-svgrepo-com.svg",alt:"Grid",title:"Lat/Lon Grid"},btn3:{id:"btn3",src:"globe-2-svgrepo-com.svg",alt:"Style",title:"Texture Style"},btn4:{id:"btn4",src:"rotate-axis-y-svgrepo-com.svg",alt:"Rotation",title:"Auto Rotation"},btn10:{id:"btn10",src:"stars-svgrepo-com.svg",alt:"Skybox",title:"Show Skybox"},btn5:{id:"btn5",src:"sun-svgrepo-com.svg",alt:"Lighting",title:"Sun Lighting"},btn6:{id:"btn6",src:"clouds-svgrepo-com.svg",alt:"Clouds",title:"Cloud Layer"},btn7:{id:"btn7",src:"home-1-svgrepo-com.svg",alt:"Home",title:"Home View"},btn8:{id:"btn8",src:"settings-2-svgrepo-com.svg",alt:"Settings",title:"Settings"},btn9:{id:"btn9",src:"feedback-svgrepo-com.svg",alt:"Feedback",title:"Feedback"},btn12:{id:"btn12",src:"explode.svg",alt:"LEO Explode",title:"LEO Explode View"},btn14:{id:"btn14",src:"train.svg",alt:"Trains",title:"Trains View"},btn15:{id:"btn15",src:"orbits.svg",alt:"Orbits",title:"Orbits View"}}}_t(e,t=null){const s=t||H()||"en";return(te[s]||te.en)[e]||e}_updateToolbarButtons(e,t){const s=["btn1","btn2","btn3","btn4","btn6"],a=["btn2","btn4"],i=["btn1","btn2","btn3","btn4","btn6"],n=e?s:a;i.forEach(o=>{const l=f(o);l&&(l.style.opacity="1.0",l.style.pointerEvents="auto",l.style.filter="none")}),n.forEach(o=>{const l=f(o);l&&(e||t)&&(l.style.opacity="0.3",l.style.pointerEvents="none",l.style.filter="grayscale(100%)")})}_updateAllButtonTitles(){document.querySelectorAll("#toolbar button[data-button-id]").forEach(s=>{const a=s.getAttribute("data-button-id"),i=this.parent.allToolbarButtons[a];i&&(s.title=this._t(a)||i.title)}),document.querySelectorAll("#floating_toolbar img[id]").forEach(s=>{const a=s.id,i=this.parent.allToolbarButtons[a];i&&(s.title=this._t(a)||i.title)})}_positionButtonLabel(e,t){const s=e.getBoundingClientRect(),a=e.getAttribute("data-label-pos"),i=f("toolbar"),n=i?window.getComputedStyle(i).flexDirection:"none",o=i&&n==="row";if(a==="above"||o){const l=o?-5:-10;t.style.left=s.left+s.width/2+"px",t.style.top=s.top+l+"px",t.style.transform="translateX(-50%) translateY(-100%)"}else t.style.left=s.right+3+"px",t.style.top=s.top+s.height/2+"px",t.style.transform="translateY(-50%)"}_repositionButtonLabels(){document.querySelectorAll(".button-label").forEach(t=>{const s=t.id.replace("_label",""),a=f(s);a&&this._positionButtonLabel(a,t)})}_showButtonLabel(e,t){const s=H(),a=ye(s,e,t),i=f(e);if(!i){console.warn(`_showButtonLabel ${e} not found in dom`);return}const n=i.getBoundingClientRect();if(n.width===0||n.height===0){console.warn(`Button ${e} has zero dimensions`);return}if(!a||a.trim()===""){console.warn(`No label text for button ${e}`);return}let o=f(e+"_label");o||(o=document.createElement("div"),o.id=e+"_label",o.className="button-label",document.body.appendChild(o)),this._positionButtonLabel(i,o),o.textContent=a,o.classList.remove("fade-out"),o.classList.add("fade-in"),setTimeout(()=>{o.classList.remove("fade-in"),o.classList.add("fade-out")},1e3)}_buildRequiredDOM(){if(f("standing_info")){console.log("BlueGlobe: DOM elements already exist");return}this._createStandingInfoPanel(),this._createUTCTimePanel(),this._createGroundStationInfoPanel(),this._createToolbar(),this._recreateToolbar()}_createStandingInfoPanel(){const e=document.createElement("div");e.id="standing_info";const t=document.createElement("span");t.innerHTML='🧭 <span id="azimuth_value">0°</span>';const s=document.createElement("span");s.innerHTML=" | ",s.style.margin="0 8px",s.style.color="#666";const a=document.createElement("span");a.innerHTML='∠ <span id="elevation_value">0°</span>',e.appendChild(t),e.appendChild(s),e.appendChild(a),this.parent.canvas.parentNode.insertBefore(e,this.parent.canvas.nextSibling)}_createUTCTimePanel(){const e=document.createElement("div");e.id="utc_time";const t=document.createElement("span");t.id="utc_time_text",t.textContent="00:00:01 UTC";const s=document.createElement("div");s.id="time_controls",[{id:"time_rewind",src:"rewind.svg?1",alt:"Rewind"},{id:"time_pause",src:"pp.svg?1",alt:"Pause Play"},{id:"time_fastforward",src:"ff.svg?1",alt:"Fast Forward"},{id:"time_reset",src:"repeat.svg?1",alt:"Reset"}].forEach(n=>{const o=document.createElement("img");o.src=this.parent._resolveUrl(n.src,this.parent.options.svgsPath),o.id=n.id,o.alt=n.alt,o.setAttribute("data-label-pos","above"),s.appendChild(o)}),e.appendChild(t),e.appendChild(s);const i=f("standing_info");i.parentNode.insertBefore(e,i.nextSibling)}_createToolbar(){const e=document.createElement("div");e.id="toolbar";const t=document.createElement("img");t.src=this.parent._getFpsIconUrl(60),t.id="fps_telltale",t.alt="FPS Indicator",t.style.cursor="pointer",e.appendChild(t);const s=document.createElement("img");s.src="/svgs/warning.svg",s.id="warning_flag",s.alt="API Health",s.style.cursor="pointer",s.style.display="none",e.appendChild(s);const a=document.createElement("div");a.id="frame_time_display",a.textContent="",e.appendChild(a);const i=f("utc_time");i.parentNode.insertBefore(e,i.nextSibling)}async _toggleFeedback(){if(!this.feedbackUI){const e=H();this.feedbackUI=new ve({language:e,onSubmit:async t=>{console.log("Feedback received:",t),await this._submitFeedback(t)},onCancel:()=>{console.log("Feedback cancelled")}}),await this.feedbackUI.init()}this.feedbackUI.isVisible?this.feedbackUI.hide():this.feedbackUI.show(this.parent.user?this.parent.user.email:"")}async _toggleIosTeaser(){if(!this.iosTeaser){const e=H();this.iosTeaser=new we({language:e,apiBaseUrl:this.parent.apiBaseUrl,getApiHeaders:()=>this.parent._getApiHeaders()}),await this.iosTeaser.init()}this.iosTeaser.isVisible?this.iosTeaser.hide():this.iosTeaser.show()}async _submitFeedback(e){try{const t=JSON.stringify({userAgent:navigator.userAgent,timestamp:new Date().toISOString(),url:window.location.href,webglVersion:this.parent.isWebGL2?"WebGL2":"WebGL1",maxTextureSize:this.parent.gl?this.parent.gl.getParameter(this.parent.gl.MAX_TEXTURE_SIZE):"N/A",viewport:this.parent.canvas?[this.parent.canvas.width,this.parent.canvas.height]:[0,0],dpr:window.devicePixelRatio,cons:this.parent.show_constellation,typ:this.parent.show_type,prefs:this.parent.preferences,satelliteCount:this.parent.satellites?this.parent.satellites.length:0,camera:{eye:this.parent.eye,target:this.parent.target}},null,2),s=await fetch(this.parent._getApiUrl("feedback"),{method:"POST",headers:this.parent._getApiHeaders(),body:JSON.stringify({feedback:e,technicalDetails:t})});if(s.ok){const a=await s.json();console.log("Feedback submitted successfully:",a)}else console.error("Failed to submit feedback:",s.status,s.statusText)}catch(t){console.error("Error submitting feedback:",t)}}async _initDatePicker(){if(!this.datePicker){this.datePicker=new xe({buttonText:"Set Date",wallclock:this.parent.wallclock,onDateChange:(s,a="00:00")=>{console.log("Date selected:",s,"Time:",a);const i=new Date(s+"T"+a+":00.000Z");console.log("[datepicker] selectedDate:",s,"timeVal:",a,"→ UTC:",i.toISOString()),this.parent.timewarp(i)&&this._showToast("Reloading data for different date","success",2e3),this.datePicker.updateDateText()}}),await this.datePicker.init();const e=document.getElementById("utc_time"),t=document.getElementById("utc_time_text");e&&t&&this.datePicker.button?e.insertBefore(this.datePicker.button,t):console.log("Failed to find required elements or date text not created")}}async _onDateClick(){this.datePicker&&this.datePicker.show()}async _showLocationSearch(){if(!this.geoLocationSearch){console.log("Creating geolocation search UI..."),this.locationModal=document.createElement("div"),this.locationModal.className="modal",this.locationModal.id="location-search-modal";const e=H();this.geoLocationSearch=new ke({publishableKey:this.parent.radarPublishableKey,placeholder:"Enter address or coordinates (lat, lon)...",language:e,onLocationSelect:o=>{console.log("Home location selected:",o),this.parent.preferences.homeLat=o.lat,this.parent.preferences.homeLon=o.lon,this.parent.preferences.homeAddress=o.address,this.parent._savePreferences(),this.parent._updateHomeMarker(),this.parent._clearTerrainCache(),this._hideLocationSearch(),this.parent._goToHomeOrbitalView()}}),await this.geoLocationSearch.init(),this.locationModal.innerHTML=`
                <div class="modal-backdrop"></div>
                <div class="modal-box p-6">
                    <button type="button" class="my-close-button" id="location-search-close">✕</button>

                    <h3 class="font-bold text-lg text-white mb-4">
                        ${this._t("location.title",e)}
                    </h3>

                    <div class="mb-4">
                        <div id="location-search-input-container" class="w-full">
                            <!-- GeoLocationSearch input will be inserted here -->
                        </div>
                    </div>

                    <!-- Geolocation button -->
                    <div class="mt-4" id="geolocation-section">
                        <button class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-400 bg-transparent border border-blue-400 hover:bg-blue-400 hover:text-white rounded-lg transition-colors duration-200" id="use-current-location">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polygon points="3,11 22,2 13,21 11,13 3,11"></polygon>
                            </svg>
                            ${this._t("location.use_current",e)}
                        </button>
                        <p class="text-xs text-gray-500 mt-2">${this._t("location.use_current_description",e)}</p>
                    </div>

                    <div class="mt-6">
                        <button class="btn-secondary-modal" id="location-search-cancel">
                            ${this._t("location.cancel",e)}
                        </button>
                    </div>
                </div>
            `,this.locationModal.querySelector("#location-search-input-container").appendChild(this.geoLocationSearch.container),this.geoLocationSearch.container.className="w-full";const s=this.locationModal.querySelector("#location-search-close"),a=this.locationModal.querySelector("#location-search-cancel"),i=this.locationModal.querySelector(".modal-backdrop"),n=this.locationModal.querySelector("#use-current-location");if([s,a].forEach(o=>{o&&o.addEventListener("click",()=>{this._hideLocationSearch()})}),i&&i.addEventListener("click",()=>{this._hideLocationSearch()}),n.addEventListener("click",()=>{this._getCurrentLocation()}),!navigator.geolocation){const o=this.locationModal.querySelector("#geolocation-section");o.style.display="none"}document.addEventListener("keydown",o=>{o.key==="Escape"&&this.locationModal.classList.contains("modal-open")&&this._hideLocationSearch()}),document.body.appendChild(this.locationModal)}this.locationModal.classList.add("modal-open"),setTimeout(()=>{this.geoLocationSearch.input&&this.geoLocationSearch.input.focus()},100),document.body.style.overflow="hidden"}_hideLocationSearch(){this.locationModal&&(this.locationModal.classList.remove("modal-open"),this.geoLocationSearch&&this.geoLocationSearch.clear(),document.body.style.overflow="")}async _getCurrentLocation(){const e=this.locationModal.querySelector("#use-current-location"),t=e.innerHTML,s=H();if(!navigator.geolocation){alert(this._t("location.error_unsupported",s));return}e.disabled=!0,e.innerHTML=`
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            ${this._t("location.getting_location",s)}
        `;try{const a=await new Promise((r,c)=>{navigator.geolocation.getCurrentPosition(r,c,{enableHighAccuracy:!0,timeout:1e4,maximumAge:6e4})}),i=a.coords.latitude,n=a.coords.longitude,o=a.coords.accuracy;console.log("Current location:",{lat:i,lon:n,accuracy:o});const l={lat:i,lon:n,address:`${this._t("location.current_location",s)} (±${Math.round(o)}m)`,source:"device_gps"};this.parent.preferences.homeLat=l.lat,this.parent.preferences.homeLon=l.lon,this.parent.preferences.homeAddress=l.address,this.parent._savePreferences(),this.parent._updateHomeMarker(),this.parent._clearTerrainCache(),this._hideLocationSearch(),this.parent._goToHomeOrbitalView(),console.log("Home location set to current GPS position:",l)}catch(a){console.error("Error getting current location:",a);let i="";switch(a.code){case a.PERMISSION_DENIED:i=this._t("location.error_denied",s);break;case a.POSITION_UNAVAILABLE:i=this._t("location.error_unavailable",s);break;case a.TIMEOUT:i=this._t("location.error_timeout",s);break;default:i=this._t("location.error_unknown",s);break}alert(i+" "+this._t("location.error_fallback",s))}finally{e.disabled=!1,e.innerHTML=t}}async _showSettingsPanel(){if(!this.settingsModal&&(console.log("Creating settings panel..."),this.settingsModal=document.createElement("div"),this.settingsModal.className="modal",this.settingsModal.id="settings-modal",this.settingsModal.innerHTML=`
    <div class="modal-backdrop"></div>
    <div class="modal-box flex flex-col max-h-[80vh]" id="settings_panel">
        <!-- Fixed Header -->
        <div class="flex-shrink-0 pb-4 border-b border-gray-700">
            <button type="button" class="my-close-button" id="settings-close">✕</button>
            <h3 class="font-bold text-xl text-white mb-1">
                ⚙️ ${this._t("settings.title")}
            </h3>
            <div class="text-xs text-gray-400 text-right">
                User: <span class="font-mono" id="settings-user-token">loading...</span>
            </div>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto py-4">

    <!-- Home Location Section -->
    <div class="mb-6">
        <h3 class="text-sm font-medium text-gray-400 mb-2">${this._t("settings.home_location")}</h3>
        <div class="flex gap-2 items-center">
            <input type="text" id="settings-home-address" class="bg-gray-700 border border-gray-600 text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 flex-1" readonly
                   placeholder="${this._t("settings.no_home_set")}" value="${this.parent.preferences.homeAddress||""}">
            <button class="px-3 py-2 text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg" id="settings-change-home">
                ${this._t("settings.set")}
            </button>
            <button class="px-3 py-2 text-xs font-medium text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-lg ${this.parent.preferences.homeAddress?"":"opacity-50 cursor-not-allowed"}" id="settings-clear-home" ${this.parent.preferences.homeAddress?"":"disabled"}>
                🗑️
            </button>
        </div>
    </div>

    ${this.parent.sessionManager&&this.parent.sessionManager.getToken()?`
    <!-- Email Address Section -->
    <div class="mb-6">
        <h3 class="text-sm font-medium text-gray-400 mb-2">${this._t("settings.email_address")}</h3>
        <div class="flex gap-2 items-center">
            ${this.parent.user.email?this.parent.user.emailVerified?`
                <input type="email" id="settings-email-address" class="bg-gray-700 border border-gray-600 text-white text-xs rounded-lg p-2 flex-1" readonly
                       value="${this.parent.user.email}" disabled>
                <span class="text-green-500 text-xl">✓</span>
            `:`
                <input type="email" id="settings-email-address" class="bg-gray-700 border border-gray-600 text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 flex-1"
                       placeholder="Enter email address" value="${this.parent.user.email}">
                <span class="text-yellow-500 text-xs">${this._t("settings.not_verified")}</span>
            `:`
                <input type="email" id="settings-email-address" class="bg-gray-700 border border-gray-600 text-gray-500 text-xs rounded-lg p-2 flex-1"
                       placeholder="not known" disabled>
                <a href="/login" class="px-4 py-2 text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg whitespace-nowrap">
                    ${this._t("settings.set_login_email")}
                </a>
            `}
        </div>
    </div>
    `:""}

<div id="accordion-settings" data-accordion="open">
  <div class="accordion-item border-gray-200 dark:border-gray-700 rounded-lg mb-2">
    <h2 id="heading-toolbar">
      <button type="button"
        class="flex justify-between items-center w-full p-2 text-left text-white bg-gray-800 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-t-lg focus:outline-none"
        data-accordion-target="#body-toolbar"
        aria-expanded="false"
        aria-controls="body-toolbar">
        <span>${this._t("settings.toolbar_customization")}</span>
        <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0"
             fill="none" viewBox="0 0 10 6">
          <path d="M9 5 5 1 1 5" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </h2>
    <div id="body-toolbar" class="hidden" aria-labelledby="heading-toolbar">
      <div class="p-4 bg-gray-900 text-white space-y-1">
            <!-- Active buttons -->
            <div class="mb-4">
                <label class="label">
                    <span class="label-text ">${this._t("settings.active_controls")}</span>
                </label>
                <div id="active-buttons" class="min-h-[60px] p-3 border-2 border-dashed border-blue-500 bg-gray-900 rounded-lg flex flex-wrap gap-2" style="max-width: 20em">
                    <!-- Active buttons will be populated here -->
                </div>
            </div>

            <!-- Available buttons -->
            <div class="mb-4">
                <label class="label">
                    <span class="label-text ">${this._t("settings.unused_controls")}</span>
                </label>
                <div id="available-buttons" class="min-h-[60px] p-3 border-2 border-dashed border-gray-600 bg-gray-900 rounded-lg flex flex-wrap gap-2" style="max-width: 20em">
                    <!-- Available buttons will be populated here -->
                </div>
            </div>

      </div>
    </div>
  </div>

  <div class="accordion-item border-gray-200 dark:border-gray-700 rounded-lg mb-2">
    <h2 id="heading-settings">
      <button type="button"
        class="flex justify-between items-center w-full p-2 text-left text-white bg-gray-800 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-t-lg focus:outline-none"
        data-accordion-target="#body-settings"
        aria-expanded="false"
        aria-controls="body-settings">
        <span>${this._t("settings.startup_settings")}</span>
        <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0"
             fill="none" viewBox="0 0 10 6">
          <path d="M9 5 5 1 1 5" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </h2>
    <div id="body-settings" class="hidden" aria-labelledby="heading-settings">
      <div class="p-4 bg-gray-900 text-white space-y-1">
            <!-- Language Preference -->
            <div class="mb-2">
                <div class="flex items-center justify-between">
                    <span class="text-sm text-white">${this._t("language")}</span>
                    <select class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1.5 w-32" id="settings-language">
                        <option value="">${this._t("browser_default")}</option>
                        <option value="en" ${this.parent.preferences.language==="en"?"selected":""}>English</option>
                        <option value="es" ${this.parent.preferences.language==="es"?"selected":""}>Español</option>
                        <option value="fr" ${this.parent.preferences.language==="fr"?"selected":""}>Français</option>
                        <option value="de" ${this.parent.preferences.language==="de"?"selected":""}>Deutsch</option>
                        <option value="it" ${this.parent.preferences.language==="it"?"selected":""}>Italiano</option>
                        <option value="pt" ${this.parent.preferences.language==="pt"?"selected":""}>Português</option>
                        <option value="ru" ${this.parent.preferences.language==="ru"?"selected":""}>Русский</option>
                        <option value="ja" ${this.parent.preferences.language==="ja"?"selected":""}>日本語</option>
                        <option value="zh" ${this.parent.preferences.language==="zh"?"selected":""}>中文</option>
                    </select>
                </div>
            </div>

            <!-- Boot with Constellation -->
            <div class="mb-2">
                <div class="flex items-center justify-between">
                    <span class="text-sm text-white">${this._t("settings.startup_constellation")}</span>
                    <select class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1.5 w-32" id="settings-boot-constellation">
                        <option value="">${this._t("settings.default")}</option>
                        ${Se.map((e,t)=>e?`<option value="${t+1}" ${this.parent.preferences.cons_start==t+1?"selected":""}>${e.charAt(0).toUpperCase()+e.slice(1)}</option>`:"").join("")}
                    </select>
                </div>
            </div>

            <div class="mb-2">
                <div class="flex items-center justify-between">
                    <span class="text-sm text-white">${this._t("settings.dish_faces")}</span>
                    <select class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1.5 w-32" id="settings-dish-faces">
                        <option value="" ${this.parent.preferences.dish_faces?"":"selected"}>${this._t("settings.default")}</option>
                        <option value="n" ${this.parent.preferences.dish_faces==="n"?"selected":""}>${this._t("settings.north")}</option>
                        <option value="s" ${this.parent.preferences.dish_faces==="s"?"selected":""}>${this._t("settings.south")}</option>
                        <option value="e" ${this.parent.preferences.dish_faces==="e"?"selected":""}>${this._t("settings.east")}</option>
                        <option value="w" ${this.parent.preferences.dish_faces==="w"?"selected":""}>${this._t("settings.west")}</option>
                    </select>
                </div>
            </div>

                <!-- <div class="alert alert-info mb-4">
                    <span class="text-sm">This section is not yet implemented.</span>
                </div> -->
            <!-- <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-white">Battery Saver</span>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="settings-battery-saver" class="sr-only peer" ${this.parent.batterySaver?"checked":""}>
                    <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div> -->
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-white">${this._t("settings.no_labels")}</span>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="settings-no-labels" class="sr-only peer" ${this.parent.show_labels==2?"checked":""}>
                    <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-white">${this._t("settings.start_at_home")}</span>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="settings-start-at-home" class="sr-only peer" ${this.parent.startAtHome?"checked":""}>
                    <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>

            <!-- <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-white">Data Saver</span>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="settings-data-saver" class="sr-only peer" ${this.parent.dataSaver?"checked":""}>
                    <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div> -->
      </div>
    </div>
  </div>

  <!-- This Browser Settings Accordion -->
  <div class="accordion-item border-gray-200 dark:border-gray-700 rounded-lg mb-2">
    <h2 id="heading-browser-settings">
      <button type="button"
        class="flex justify-between items-center w-full p-2 text-left text-white bg-gray-800 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-t-lg focus:outline-none"
        data-accordion-target="#body-browser-settings"
        aria-expanded="false"
        aria-controls="body-browser-settings">
        <span>${this._t("settings.browser_settings")}</span>
        <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0"
             fill="none" viewBox="0 0 10 6">
          <path d="M9 5 5 1 1 5" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </h2>
    <div id="body-browser-settings" class="hidden" aria-labelledby="heading-browser-settings">
      <div class="p-4 bg-gray-900 text-white space-y-1">
            <div class="mb-3">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-sm text-white">${this._t("settings.fps_30")}</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="settings-gpu-saver" class="sr-only peer" ${this.parent.gpuSaver?"checked":""}>
                        <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
                <p class="text-xs text-gray-500 ml-0">${this._t("settings.fps_30_desc")}</p>
            </div>
            <div class="mb-3">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-sm text-white">${this._t("settings.auto_pause")}</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="settings-auto-pause" class="sr-only peer" ${this.parent.autoPause?"checked":""}>
                        <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
                <p class="text-xs text-gray-500 ml-0">${this._t("settings.auto_pause_desc")}</p>
            </div>
            <div class="mb-3">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-sm text-white">${this._t("settings.weak_gpu")}</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="settings-weak-gpu" class="sr-only peer" ${this.parent.weakGpu?"checked":""}>
                        <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
                <p class="text-xs text-gray-500 ml-0">${this._t("settings.weak_gpu_desc")}</p>
            </div>
            <div class="mb-3">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-sm text-white">${this._t("settings.sat_visibility")}</span>
                    <select id="settings-sat-size" class="bg-gray-700 text-white text-sm rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500 p-1.5">
                        <option value="1.0" ${(this.parent.sat_size_multiple||1)===1?"selected":""}>x1.0</option>
                        <option value="1.5" ${this.parent.sat_size_multiple===1.5?"selected":""}>x1.5</option>
                        <option value="2.0" ${this.parent.sat_size_multiple===2?"selected":""}>x2.0</option>
                        <option value="2.5" ${this.parent.sat_size_multiple===2.5?"selected":""}>x2.5</option>
                    </select>
                </div>
                <p class="text-xs text-gray-500 ml-0">${this._t("settings.sat_visibility_desc")}</p>
                <p class="text-xs text-yellow-400/80 ml-0">${this._t("settings.sat_visibility_note")}</p>
            </div>
            <div class="mb-3">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-sm text-white">${this._t("settings.scroll_sensitivity")}</span>
                    <select id="settings-scroll-sensitivity" class="bg-gray-700 text-white text-sm rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500 p-1.5">
                        <option value="0.5" ${this.parent.scrollSensitivity===.5?"selected":""}>${this._t("settings.low")}</option>
                        <option value="1.0" ${(this.parent.scrollSensitivity||1)===1?"selected":""}>${this._t("settings.medium")}</option>
                        <option value="2.0" ${this.parent.scrollSensitivity===2?"selected":""}>${this._t("settings.high")}</option>
                    </select>
                </div>
                <p class="text-xs text-gray-500 ml-0">${this._t("settings.scroll_desc")}</p>
            </div>
      </div>
    </div>
  </div>

        </div>

        <!-- Fixed Footer -->
        <div class="flex-shrink-0 pt-4 border-t border-gray-700">
            <div class="flex justify-end gap-2">
                <button class="btn-primary-modal" id="settings-save">
                    ${this._t("settings.save")}
                </button>
                <button class="btn-secondary-modal" id="settings-cancel">
                    ${this._t("settings.cancel")}
                </button>
            </div>
        </div>
    </div>`,this._setupSettingsEventListeners(),document.body.appendChild(this.settingsModal),typeof window.initAccordions=="function")){let e=0;const t=50,s=setInterval(()=>{const a=document.getElementById("accordion-settings"),i=a==null?void 0:a.querySelector("[data-accordion-target]");a&&i?(clearInterval(s),window.initAccordions()):++e>=t&&(clearInterval(s),console.error("Settings modal accordion initialization timeout"))},10)}this._updateSettingsForm(),this._setupToolbarDragAndDrop(),this.settingsModal.classList.add("modal-open"),document.body.style.overflow="hidden"}_hideSettingsPanel(){this.settingsModal&&(this.activeSortable&&(this.activeSortable.destroy(),this.activeSortable=null),this.availableSortable&&(this.availableSortable.destroy(),this.availableSortable=null),this.settingsModal.classList.remove("modal-open"),document.body.style.overflow="")}_setupSettingsEventListeners(){const e=this.settingsModal.querySelector("#settings-close"),t=this.settingsModal.querySelector("#settings-cancel"),s=this.settingsModal.querySelector("#settings-save"),a=this.settingsModal.querySelector("#settings-change-home"),i=this.settingsModal.querySelector("#settings-clear-home");[e,t].forEach(r=>{r.addEventListener("click",()=>{this._hideSettingsPanel()})}),s.addEventListener("click",r=>{r.stopPropagation(),this._saveSettingsFromForm(),this._hideSettingsPanel()}),a.addEventListener("click",()=>{this._hideSettingsPanel(),this._showLocationSearch()}),i.addEventListener("click",()=>{this.parent.preferences.homeLat=null,this.parent.preferences.homeLon=null,this.parent.preferences.homeAddress=null,this.parent._savePreferences(),this.parent._updateHomeMarker(),this._updateSettingsForm()});const n=this.settingsModal.querySelector("#settings-language");n?n.addEventListener("change",r=>{const c=r.target.value||null;this.parent.preferences.language=c,this.parent._savePreferences(),Ee(c),this._updateAllButtonTitles(),this._showToast("Reload page for language change","success",2e3),console.log(`Language preference updated: ${c||"Browser Default"}`)}):console.warn("Language select element not found in settings modal");const o=this.settingsModal.querySelector("#settings-boot-constellation");o?o.addEventListener("change",r=>{const c=r.target.value||null;this.parent.preferences.cons_start=parseInt(c),this.parent._savePreferences(),console.log(`Boot constellation preference updated: ${c||"Default"}`)}):console.warn("Boot constellation select element not found in settings modal");const l=this.settingsModal.querySelector("#settings-dish-faces");l?l.addEventListener("change",r=>{const c=r.target.value||null;this.parent.preferences.dish_faces=c;const g={n:0,s:180,e:90,w:270};c&&g[c]!==void 0?(this.parent.preferences.dishAzimuth=g[c],this.parent.preferences.dishElevation=60):(this.parent.preferences.dishAzimuth=0,this.parent.preferences.dishElevation=90),this.parent._savePreferences(),console.log(`Dish faces: ${c||"Default"} → az:${this.parent.preferences.dishAzimuth} el:${this.parent.preferences.dishElevation}`)}):console.warn("Dish faces select element not found in settings modal"),document.addEventListener("keydown",r=>{r.key==="Escape"&&this.settingsModal.classList.contains("modal-open")&&this._hideSettingsPanel()})}_updateSettingsForm(){if(!this.settingsModal)return;const e=this.settingsModal.querySelector("#settings-home-address"),t=this.settingsModal.querySelector("#settings-gpu-saver"),s=this.settingsModal.querySelector("#settings-start-at-home"),a=this.settingsModal.querySelector("#settings-no-labels"),i=this.settingsModal.querySelector("#settings-clear-home"),n=this.settingsModal.querySelector("#settings-boot-constellation"),o=this.settingsModal.querySelector("#settings-user-token");if(o)if(this.parent.sessionManager&&this.parent.sessionManager.getToken()){const r=this.parent.sessionManager.getToken();o.textContent=r.substring(0,20)+"..."}else o.textContent="unknown";e.value=this.parent.preferences.homeAddress||"",e.placeholder=this.parent.preferences.homeAddress?"":"No home location set";const l=e.parentElement.querySelector(".label-text-alt");l&&(l.textContent=this.parent.preferences.homeLat||this.parent.preferences.homeLon?`${this.parent.preferences.homeLat.toFixed(4)}, ${this.parent.preferences.homeLon.toFixed(4)}`:'Click "Change Home Location" to set'),t.checked=this.parent.gpuSaver,s.checked=this.parent.startAtHome,a.checked=this.parent.show_labels==2,n&&(n.value=this.parent.preferences.cons_start||""),i.disabled=!this.parent.preferences.homeAddress,this._updateToolbarCustomization()}_saveSettingsFromForm(){if(!this.settingsModal)return;const e=this.settingsModal.querySelector("#settings-start-at-home"),t=this.settingsModal.querySelector("#settings-no-labels"),s=this.settingsModal.querySelector("#settings-boot-constellation"),a=this.settingsModal.querySelector("#settings-gpu-saver"),i=this.settingsModal.querySelector("#settings-auto-pause"),n=this.settingsModal.querySelector("#settings-weak-gpu"),o=this.settingsModal.querySelector("#settings-sat-size"),l=this.settingsModal.querySelector("#settings-scroll-sensitivity");if(this.startAtHome=e.checked,this.noLabels=t.checked,this.consStart=parseInt(s.value),this.gpuSaver=a.checked,this.autoPause=i.checked,this.weakGpu=n.checked,this.parent.sat_size_multiple=parseFloat(o.value),this.parent.scrollSensitivity=parseFloat(l.value),this.parent.sphereControls&&(this.parent.sphereControls.config.scrollSensitivity=this.parent.scrollSensitivity),console.log("Settings updated:",{batterySaver:this.batterySaver,gpuSaver:this.gpuSaver,dataSaver:this.dataSaver,consStart:this.consStart}),this.parent.sessionManager){let r=this.parent.sessionManager.getData();r.ui_preferences&&(r.ui_preferences.start_at_home=this.startAtHome,r.ui_preferences.no_labels=!!this.noLabels,r.ui_preferences.cons_start=this.consStart,this.parent.sessionManager.saveData(r))}this._saveToolbarConfiguration(),localStorage.setItem("blueglobe-browser-prefs",JSON.stringify({gpu_saver:this.gpuSaver,auto_pause:this.autoPause,weak_gpu:this.weakGpu,sat_size_multiple:this.parent.sat_size_multiple,scroll_sensitivity:this.parent.scrollSensitivity})),this._showToast("Preference changes may need a page reload","info",3e3)}async _initializeIncrementalSearch(){console.log("Initializing incremental search...");try{await this._loadIncrementalSearchModule(),this.incrementalSearch=new this.IncrementalSearch,this._createIncrementalSearchUI(),this._addSearchKeyboardHandler(),this._loadSearchData()}catch(e){console.error("Error initializing incremental search:",e)}}async _loadIncrementalSearchModule(){try{this.IncrementalSearch=yt,console.log("Incremental search module loaded")}catch(e){throw console.error("Failed to load incremental search module:",e),e}}_createIncrementalSearchUI(){let e=document.getElementById("search-trigger-icon");e||(e=document.createElement("div"),e.id="search-trigger-icon",document.body.appendChild(e)),e.innerHTML=`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
            </svg>
        `,e.addEventListener("click",()=>{this._showIncrementalSearch()});const t=document.createElement("div");t.id="incremental-search-container",t.style.cssText=`
            position: fixed;
            top: 60px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2000;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #333;
            border-radius: 8px;
            padding: 15px;
            min-width: 400px;
            max-width: 600px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            display: none;
            backdrop-filter: blur(10px);
        `;const s=document.createElement("input");s.id="incremental-search-input",s.type="text",s.placeholder="Search...",s.style.cssText=`
            width: 100%;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #555;
            border-radius: 4px;
            background: #222;
            color: white;
            outline: none;
            box-sizing: border-box;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
        `,s.setAttribute("autocomplete","off"),s.setAttribute("autocorrect","off"),s.setAttribute("autocapitalize","off"),s.setAttribute("spellcheck","false");const a=document.createElement("div");a.id="incremental-search-results",a.style.cssText=`
            max-height: 300px;
            overflow-y: auto;
            margin-top: 10px;
            display: none;
        `;const i=document.createElement("div");i.style.cssText=`
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        `;const n=document.createElement("div");n.id="incremental-search-instructions",n.style.cssText=`
            color: #aaa;
            font-size: 12px;
            text-align: left;
            display: flex;
            align-items: center;
            gap: 8px;
        `,n.innerHTML="Type to search • Enter to select • Escape to close";const o=document.createElement("button");o.type="button",o.className="close-button-tiny",o.id="incremental-search-close",o.title="Close search",o.innerHTML="✕",o.addEventListener("click",()=>{this._hideIncrementalSearch()}),i.appendChild(n),i.appendChild(o),t.appendChild(i),t.appendChild(s),t.appendChild(a),document.body.appendChild(t),this.searchContainer=t,this.searchInput=s,this.searchResults=a,this._addSearchInputHandlers()}_addSearchKeyboardHandler(){document.addEventListener("keydown",e=>{if(this._isModalOpen()||this.searchContainer&&this.searchContainer.style.display==="block"||e.ctrlKey||e.metaKey||e.altKey)return;const t=e.key===" ",s=/^[a-zA-Z0-9]$/.test(e.key);(t||s)&&(e.preventDefault(),this._showIncrementalSearch(t?"":e.key))})}_addSearchInputHandlers(){let e;this.searchInput.addEventListener("input",t=>{clearTimeout(e);const s=t.target.value.trim();if(s.length===0){this._hideSearchResults();return}e=setTimeout(()=>{this._performSearch(s)},150)}),this.searchInput.addEventListener("keydown",t=>{t.key==="Escape"?this._hideIncrementalSearch():t.key==="Enter"?this._selectFirstResult():t.key==="ArrowDown"?(t.preventDefault(),this._navigateResults(1)):t.key==="ArrowUp"&&(t.preventDefault(),this._navigateResults(-1))}),this.searchInput.addEventListener("blur",()=>{setTimeout(()=>{this.searchContainer.contains(document.activeElement)||this._hideIncrementalSearch()},150)})}_showIncrementalSearch(e=""){{const t=this.parent.sessionManager.getData();if(t.remember_data&&t.remember_data.length){let s="";f("incremental-search-results").style.display="",[...t.remember_data].sort((n,o)=>(o.count||0)-(n.count||0)).forEach(n=>{const o=document.createElement("span");o.className="remembered-satellite-link",o.textContent=n.norad,o.style.cursor="pointer",o.style.marginRight="10px",o.style.color="#4A9EFF",o.style.textDecoration="underline",o.setAttribute("data-norad",n.norad),s+=o.outerHTML}),f("incremental-search-results").innerHTML=s,f("incremental-search-results").querySelectorAll(".remembered-satellite-link").forEach((n,o)=>{n.onclick=async l=>{const r=n.getAttribute("data-norad");l.preventDefault(),await this.parent._smartInject(r),this.parent._extra_highlight(r,!0,!1)}})}}this.searchContainer.style.display="block",this.searchInput.value=e,this.searchInput.focus(),e&&this._performSearch(e)}_hideIncrementalSearch(){this.searchContainer.style.display="none",this.searchInput.value="",this._hideSearchResults()}_hideSearchResults(){this.searchResults.style.display="none",this.searchResults.innerHTML=""}async _lookupByInternationalDesignator(e){try{console.log(`🔍 Looking up satellite by international designator: ${e}`),this._showToast(`Searching for satellite with designator ${e}...`,"info",2e3),this._showToast("International designator lookup not yet implemented. Please use NORAD ID if known.","warning",5e3)}catch(t){console.error("Error looking up international designator:",t),this._showToast(`Error looking up designator ${e}`,"error")}}_isNoradNumber(e){return/^\d{4,6}$/.test(e.trim())}_isInternationalDesignator(e){return/^\d{4}-\d{3}[A-Z]+$/i.test(e.trim())}_hasExactMatch(e,t){if(!e||e.length===0)return!1;const s=t.toLowerCase().trim();return e.some(a=>{const i=a.document;return i?!!(i.norad_id&&i.norad_id.toString()===s||i.intldes&&i.intldes.toLowerCase()===s):!1})}async _performSearch(e){if(this.incrementalSearch)try{const t=this.incrementalSearch.search(e),s=this._isNoradNumber(e),a=this._isInternationalDesignator(e);if((s||a)&&!this._hasExactMatch(t,e)){console.log(`🔍 No exact match found for ${s?"NORAD ID":"international designator"}: ${e}, attempting direct lookup...`);const i={score:"100%",ref:e.trim(),document:{id:e.trim(),sat_name:s?`Satellite ${e.trim()}`:`Object ${e.trim()}`,norad_id:s?e.trim():"",intldes:a?e.trim():"",sat_type:"satellite",status:"Direct lookup",constellation_name:"",_isDirect:!0},original:null};this._displaySearchResults([i]);return}this._displaySearchResults(t.slice(0,10))}catch(t){console.error("Search error:",t)}}_displaySearchResults(e){if(this.searchResults.innerHTML="",e.length===0){const t=document.createElement("div");t.style.cssText="padding: 10px; color: #666; text-align: center;",t.textContent="No results found",this.searchResults.appendChild(t),this.searchResults.style.display="block";return}e.forEach((t,s)=>{const a=document.createElement("div");a.className="search-result-item",a.style.cssText=`
                padding: 10px;
                border-bottom: 1px solid #333;
                cursor: pointer;
                transition: background-color 0.2s;
            `;const i=t.document,n=t.score;a.innerHTML=`
                <div style="color: white; font-weight: bold; margin-bottom: 2px;">
                    ${i.sat_name||"Unknown"}${i.nna?' <span style="color: #f59e0b; font-size: 10px; font-weight: normal; border: 1px solid #f59e0b; border-radius: 3px; padding: 0 3px; vertical-align: middle;">NNA</span>':""}
                </div>
                <div style="color: #aaa; font-size: 12px;">
                    NORAD: ${i.norad_id||"N/A"} |
                    Type: ${i.sat_type||"N/A"} |
                    Score: ${n}
                </div>
                ${i.nna?'<div style="color: #f59e0b; font-size: 10px;">Identity unconfirmed — name/object correlation uncertain</div>':""}
                ${i.constellation_name?`<div style="color: #4a9eff; font-size: 11px;">Constellation: ${i.constellation_name}</div>`:""}
                ${i._isDirect?'<div style="color: #ffa500; font-size: 11px;">🔍 Direct lookup - not in searchables</div>':""}
            `,a.addEventListener("mouseenter",()=>{a.style.backgroundColor="rgba(74, 158, 255, 0.2)"}),a.addEventListener("mouseleave",()=>{a.style.backgroundColor="transparent"}),a.addEventListener("click",()=>{this._selectSearchResult(t)}),this.searchResults.appendChild(a)}),this.searchResults.style.display="block"}_selectFirstResult(){const e=this.searchResults.querySelector(".search-result-item");e&&e.click()}_navigateResults(e){const t=this.searchResults.querySelectorAll(".search-result-item");if(t.length===0)return;const s=this.searchResults.querySelector(".search-result-item.highlighted");let a=0;s&&(a=Array.from(t).indexOf(s)+e,s.classList.remove("highlighted"),s.style.backgroundColor="transparent"),a<0&&(a=t.length-1),a>=t.length&&(a=0);const i=t[a];i.classList.add("highlighted"),i.style.backgroundColor="rgba(74, 158, 255, 0.3)",i.scrollIntoView({block:"nearest"})}_selectSearchResult(e){var a;const t=e.document;if(e.original,console.log("Selected satellite:",t.sat_name,"NORAD ID:",t.norad_id),(a=this.parent.remember)==null||a.memory(t.norad_id),this._hideIncrementalSearch(),t._isDirect&&(console.log("🔍 Processing direct lookup for:",t._isDirect?"direct lookup":"normal search result"),t.intldes&&!t.norad_id)){console.log("🔍 Attempting lookup by international designator:",t.intldes),this._lookupByInternationalDesignator(t.intldes);return}this.parent.dots&&this.parent.dots.movingPoints&&this.parent.dots.movingPoints.some(i=>i.norad_id==t.norad_id)?(console.log(`✅ Satellite ${t.sat_name} already loaded, highlighting...`),this.parent._extra_highlight(t.norad_id,!0,!0)):(console.log(`🛰️ Satellite ${t.sat_name} not found in current view, loading incrementally...`),this.parent.loadsats(null,null,!1,[t.norad_id]).then(i=>{if(i&&i.loadStatus)switch(i.loadStatus){case"success":this.parent._deploySatelliteData(i),this._showToast(`Successfully loaded satellite "${t.sat_name}"`,"success",3e3,!0),setTimeout(()=>{this.parent._extra_highlight(t.norad_id,!0,!1)},100);break;case"no_tle":case"not_found":case"no_position":const n=parseInt(t.norad_id),o=i.satelliteMetadata.get(n);if(o){const l={norad_id:t.norad_id,name:t.sat_name};this.parent.fetchSatelliteDetails(t.norad_id).then(async r=>{let c="<br>"+r.sat_name;r.decay_date&&(c+="<br>Decayed: "+r.decay_date.substr(0,10)),this._showToast(`${t.sat_name}: ${c}`,"info"),console.log(l),console.log(o),console.log(r),await this.parent.ui.populateSatelliteInfoPanel(l,o,r)})}else console.warn("❌ No metadata available for this specific satellite");break;default:this._showToast(`Loading fail  "${t.sat_name}"`,"error");break}else this._showToast(`${t.norad_id} is not found`,"info")}).catch(i=>{console.error(`❌ Error loading satellite ${t.sat_name}:`,i);let n="error",o=`Error loading satellite "${t.sat_name}"`;i.message&&(i.message.includes("TLE")||i.message.includes("orbital elements")?(n="warning",o=`Satellite "${t.sat_name}" found but has invalid or expired orbital data`):i.message.includes("TIMEOUT")||i.message.includes("network")?o=`Network timeout loading satellite "${t.sat_name}" - please try again`:o+=`: ${i.message}`),this._showToast(o,n)}))}_isModalOpen(){const e=document.querySelectorAll(".modal.modal-open"),t=document.querySelectorAll("[data-modal-open]"),s=document.querySelectorAll("dialog[open]"),a=document.getElementById("load_sim_panel"),i=a&&a.style.display!=="none";return e.length>0||t.length>0||s.length>0||i}async _loadSearchData(){if(this.incrementalSearch)try{const e=this.parent._getApiUrl("searchables");console.log(`🔍 Loading searchables from: ${e}`);const t=await fetch(e,{headers:this.parent._getApiHeaders(null)});if(t.ok){const s=await t.json();s.success&&s.data?(await this.incrementalSearch.populateFromAPI(s.data),console.log(`✅ Satellite search data loaded from API: ${s.count} items`)):(console.warn("Searchables API returned invalid format, using mock data"),this._loadMockSearchData())}else console.warn(`Could not load satellite data from API (${t.status}), using mock data`),this._loadMockSearchData()}catch(e){console.warn("Error loading satellite data:",e),this._loadMockSearchData()}}_loadMockSearchData(){const e=[{id:"25544",name:"International Space Station",noradId:"25544",constellation:"ISS",objectType:"Crewed Spacecraft",owner:"International",purpose:"Space Station",description:"International Space Station crew and cargo operations"},{id:"43013",name:"Starlink-1007",noradId:"43013",constellation:"Starlink",objectType:"Satellite",owner:"SpaceX",purpose:"Communications",description:"Starlink broadband internet constellation"},{id:"20580",name:"Hubble Space Telescope",noradId:"20580",constellation:"HST",objectType:"Telescope",owner:"NASA",purpose:"Space Telescope",description:"Hubble Space Telescope for astronomical observations"}];this.incrementalSearch.populateFromAPI(e),console.log("Mock satellite search data loaded")}async _loadSortableJS(){return window.Sortable?Promise.resolve():new Promise((e,t)=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js",s.onload=()=>{console.log("SortableJS loaded successfully"),e()},s.onerror=()=>{t(new Error("Failed to load SortableJS library"))},document.head.appendChild(s)})}async _setupToolbarDragAndDrop(){try{this.activeSortable&&(this.activeSortable.destroy(),this.activeSortable=null),this.availableSortable&&(this.availableSortable.destroy(),this.availableSortable=null),await this._loadSortableJS();const e=this.settingsModal.querySelector("#active-buttons"),t=this.settingsModal.querySelector("#available-buttons");if(!e||!t)return;this.activeSortable=new Sortable(e,{group:"toolbar-buttons",animation:200,ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",filter:'[data-button-id="_btn8"]',preventOnFilter:!1,onStart:s=>{s.item.style.opacity="0.8"},onEnd:s=>{s.item.style.opacity="1",this._updateToolbarPreferences()},onAdd:s=>{this._updateToolbarPreferences()},onRemove:s=>{this._updateToolbarPreferences()}}),this.availableSortable=new Sortable(t,{group:"toolbar-buttons",animation:200,ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",sort:!1,onStart:s=>{s.item.style.opacity="0.8"},onEnd:s=>{s.item.style.opacity="1"},onAdd:s=>{this._updateToolbarPreferences()},onRemove:s=>{this._updateToolbarPreferences()}}),this._addSortableCSS()}catch(e){console.error("Failed to setup drag and drop:",e),console.warn("Drag and drop not available - SortableJS library could not be loaded")}}_addSortableCSS(){if(document.getElementById("sortable-styles"))return;const e=document.createElement("style");e.id="sortable-styles",e.textContent=`
            .sortable-ghost {
                opacity: 0.3;
                background: #3b82f6 !important;
                border: 2px dashed #3b82f6 !important;
                transform: scale(1.05);
            }
            
            .sortable-chosen {
                transform: scale(1.05);
                box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4) !important;
                border: 2px solid #3b82f6 !important;
                z-index: 1000;
            }
            
            .sortable-drag {
                opacity: 0.8;
                transform: rotate(5deg);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
            }
            
            #active-buttons.sortable-drag-over,
            #available-buttons.sortable-drag-over {
                border: 2px solid #3b82f6 !important;
                background: rgba(59, 130, 246, 0.1) !important;
            }
            
        `,document.head.appendChild(e)}_updateToolbarCustomization(){const e=this.settingsModal.querySelector("#active-buttons"),t=this.settingsModal.querySelector("#available-buttons");if(!e||!t)return;e.innerHTML="",t.innerHTML="";const s=Ce;let a=this.parent.preferences&&this.parent.preferences.activeToolbarButtons?this.parent.preferences.activeToolbarButtons:s;a.includes("btn7")&&(a=["btn7",...a.filter(n=>n!=="btn7")]);const i=this.parent.allToolbarButtons?Object.keys(this.parent.allToolbarButtons).filter(n=>!a.includes(n)&&n!=="_btn8"):[];a.forEach(n=>{if(this.parent.allToolbarButtons[n]&&!V.includes(n)){const o=this._createDraggableButton(this.parent.allToolbarButtons[n]);e.appendChild(o)}}),i.forEach(n=>{if(this.parent.allToolbarButtons[n]&&!V.includes(n)){const o=this._createDraggableButton(this.parent.allToolbarButtons[n]);t.appendChild(o)}})}_createDraggableButton(e){const t=document.createElement("img");return e.id==="btn11"?t.src=se:e.id==="btn0"?t.src=ae:t.src=`svgs/${e.src}`,t.alt=e.alt,t.title=e.title,t.setAttribute("data-button-id",e.id),t.style.cssText=`
            width: 20px;
            height: 20px;
            cursor: move;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 2px;
            box-sizing: content-box;
            margin: 2px;
            transition: opacity 0.2s ease, transform 0.2s ease;
            opacity: 1;
        `,t.addEventListener("mouseenter",()=>{t.style.transform="scale(1.1)"}),t.addEventListener("mouseleave",()=>{t.style.transform="scale(1)"}),t}_helpingHand(e,t){const s=this.parent.sessionManager.getData(),a=s.hflags??(s.hflags={});return(a[e]??0)>2?!1:(a[e]=(a[e]??0)+1,this.parent.sessionManager.saveData(s),this._showToast(t,"info",5e3),!0)}_updateToolbarPreferences(){const e=this.settingsModal.querySelector("#active-buttons");if(!e||!this.parent.preferences)return;const t=Array.from(e.children).map(s=>s.getAttribute("data-button-id"));this.parent.preferences.activeToolbarButtons=t}_saveToolbarConfiguration(){this._updateToolbarPreferences(),this.parent._savePreferences(),this._recreateToolbar()}_recreateToolbar(){const e=f("toolbar");if(!e)return;e.querySelectorAll('img[id^="btn"]').forEach(n=>n.remove());const s=ne;let a=this.parent.preferences&&this.parent.preferences.activeToolbarButtons?this.parent.preferences.activeToolbarButtons:s;a=a.filter(n=>n!=="btn7"),a=["btn7",...a],a.forEach(n=>{if(!V.includes(n)&&(this.parent.allToolbarButtons&&this.parent.allToolbarButtons[n]||n=="_btn8")){const o=this.parent.allToolbarButtons[n],l=document.createElement("img");if(!o)console.error("no ",n);else{n==="btn0"?l.src=ae:n==="btn11"?l.src=se:l.src=this.parent._resolveUrl(o.src,this.parent.options.svgsPath),l.id=o.id,l.alt=o.alt,l.title=o.title;const r=e.querySelector("#fps_telltale");r?e.insertBefore(l,r):e.appendChild(l)}}}),[...ne,"fps_telltale","warning_flag","time_rewind","time_pause","time_fastforward","time_reset"].forEach(n=>{const o=f(n);o&&o.addEventListener("click",l=>{this.parent._resetUIDimTimer();const r=l.target.id;if(r=="btn0"&&(this.parent.constellationIndex=(this.parent.constellationIndex+1)%this.parent.constellations.length,this.parent.show_constellation=this.parent.constellations[this.parent.constellationIndex],this._showButtonLabel(r,this.parent.show_constellation),this.parent.show_type=this.parent.sat_types[this.parent.typeIndex=0],this._showButtonLabel("btn11",this.parent.show_type),this._showButtonLabel("btn13",this.parent.show_labels),this.parent.callbacks&&this.parent.callbacks.onConstellationChange&&this.parent.callbacks.onConstellationChange(this.parent.show_constellation),this.parent.callbacks&&this.parent.callbacks.onTypeChange&&this.parent.callbacks.onTypeChange(this.parent.show_type)),r=="btn11"&&(this.parent.typeIndex=(this.parent.typeIndex+1)%this.parent.sat_types.length,this.parent.show_type=this.parent.sat_types[this.parent.typeIndex],this._showButtonLabel(r,this.parent.show_type),this.parent.callbacks&&this.parent.callbacks.onTypeChange&&this.parent.callbacks.onTypeChange(this.parent.show_type)),r=="btn13"&&(this.parent.show_labels=this.parent.show_labels===1?2:1,this._showButtonLabel(r,this.parent.show_labels)),r=="btn1"&&(this.parent.show_borders=this.parent.show_borders?0:1,this._showButtonLabel(r,this.parent.show_borders)),r=="btn2"&&(this.parent.show_latlon=!this.parent.show_latlon,this._showButtonLabel(r,this.parent.show_latlon)),r=="btn3"&&(this.parent.show_texstyle=(this.parent.show_texstyle+1)%3,this._showButtonLabel(r,this.parent.show_texstyle)),r=="btn4"&&(this.parent.show_rotating=(this.parent.show_rotating+1)%5,this.parent._lastMoonYaw=void 0,this._showButtonLabel(r,this.parent.show_rotating)),r=="btn10"&&(this.parent.show_skybox=(this.parent.show_skybox+1)%3,this._showButtonLabel(r,this.parent.show_skybox)),r=="btn5"&&(this.parent.show_dotlighting=(this.parent.show_dotlighting+1)%3,this._showButtonLabel(r,this.parent.show_dotlighting)),r=="btn6"&&(this.parent.show_texstyle==1&&this.parent.show_clouds==0?this._showToast("Switch to 4k globe for cloud layer","info",2e3):(this.parent.show_clouds=!this.parent.show_clouds,this._showButtonLabel(r,this.parent.show_clouds))),r=="btn7")if(this.parent.show_rotating=0,this._showButtonLabel("btn4",this.parent.show_rotating),this.parent.standing_view||this.parent.cameraPath)this.parent.standing_view=!1,this.parent.show_rocket=!1,this.parent.cameraPath=null,this._updateToolbarButtons(this.parent.standing_view,this.parent.riding_view),this.parent._goToHomeOrbitalView();else if(this.parent.preferences.homeLat||this.parent.preferences.homeLon){const c=this.parent.eye,g=Math.sqrt(c[0]*c[0]+c[1]*c[1]+c[2]*c[2]);if(Math.abs(g-Le)>.1)this.parent._goToHomeOrbitalView(),this._showButtonLabel(r,null),this._helpingHand("go home","Click 🏠 again for standing view");else{const u=this.parent.preferences.homeLat*Math.PI/180,h=this.parent.preferences.homeLon*Math.PI/180,p=Ae(u,h,1.75);Math.sqrt((c[0]-p[0])**2+(c[1]-p[1])**2+(c[2]-p[2])**2)<=.5?(this.parent._goToHomeStandingView(),this._showButtonLabel(r,!0)):(this.parent._goToHomeOrbitalView(),this._showButtonLabel(r,null))}}else this._showLocationSearch(),this._showButtonLabel(r,null);if(r=="btn8"&&(this._showSettingsPanel(),this._showButtonLabel(r,null)),r=="btn9"&&(this._toggleFeedback(),this._showButtonLabel(r,null)),r=="btn12"&&(this.parent.show_leoexplode=!this.parent.show_leoexplode,this._showButtonLabel(r,this.parent.show_leoexplode)),r=="btn14"&&(this.parent.show_trains=!this.parent.show_trains,this.parent.show_trains==1?this.parent.showTrains(!0):this.parent.showTrains(!1),this._showButtonLabel(r,this.parent.show_trains)),r=="btn15"&&(this.parent.show_orbits=!this.parent.show_orbits,this.parent.show_orbits==1?this.parent.showOrbits(!0):this.parent.showOrbits(!1),this._showButtonLabel(r,this.parent.show_orbits)),r=="fps_telltale"){this.parent.render_decimation?this.parent.desired_dpr=1:(this.parent.render_decimation=2,this.parent.desired_dpr=1),++this.parent.render_decimation==4&&(this.parent.render_decimation=1,this.parent.desired_dpr=3);let c="";switch(this.parent.render_decimation){case 1:c="Full speed";break;case 2:c="Half speed half resolution";break;case 3:c="CPU saver";break}c&&this._showToast(c,"info",3e3,!0)}if(r=="warning_flag"&&this._showToast("space-track.org API delays - see Space-track status page","warning",3e3,!0),r=="time_pause"&&(this.parent.wallclock.getSpeed()==0?(this.parent.dots.need_recalc=!0,this.parent.wallclock.setSpeed(this.parent.ff_speed=this.save_ff_speed),this.parent.wallclock.resume(),this._showButtonLabel(r,null)):(this.save_ff_speed=this.parent.wallclock.getSpeed(),this.parent.wallclock.setSpeed(0),this.parent.wallclock.pause(),this.parent.ff_speed=0,this.parent.dots.need_recalc=!0,this._showButtonLabel(r,null))),r=="time_fastforward"||r=="time_rewind"){const c=r=="time_rewind"?-1:1;let g=this.parent.ff_speed;g==0?g=c:Math.sign(g)!=Math.sign(c)?g*=-1:g==500*c?this.save_ff_speed=g=1*c:g==1*c?this.save_ff_speed=g=10*c:g==10*c?this.save_ff_speed=g=100*c:g==100*c&&(this.save_ff_speed=g=500*c),this.parent.wallclock.setSpeed(this.parent.ff_speed=g),this.parent.wallclock.resume(),this._showButtonLabel(r,this.parent.ff_speed),this.parent.dots.need_recalc=!0}if(r=="time_reset"&&(this.parent.timewarp(new Date).then(c=>{this.parent.dots.need_recalc=!0}),this.parent.wallclock.reset(),this.parent.wallclock.setSpeed(this.save_ff_speed=this.parent.ff_speed=1),this._showButtonLabel(r,null),this.datePicker)){const c=new Date().toISOString().split("T")[0];this.datePicker.setDate(c),this.datePicker.updateDateText()}}),o&&o.addEventListener("mouseenter",()=>{const l=o.id;let r=null;l=="btn0"?r=this.parent.show_constellation:l=="btn11"?r=this.parent.show_type:l=="btn13"?r=this.parent.show_labels:l=="btn1"?r=this.parent.show_borders:l=="btn2"?r=this.parent.show_latlon:l=="btn3"?r=this.parent.show_texstyle:l=="btn4"?r=this.parent.show_rotating:l=="btn10"?r=this.parent.show_skybox:l=="btn5"?r=this.parent.show_dotlighting:l=="btn6"?r=this.parent.show_clouds:l=="btn7"&&(r=this.parent.standing_view?1:0),this._showButtonLabel(l,r)}),o&&o.addEventListener("mouseleave",()=>{const l=f(o.id+"_label");l&&(l.classList.remove("fade-in"),l.classList.add("fade-out"))})}),this.parent.triggerMenuBuild()}async _createActions(e,t,s){if(Ie.addBookmarkStyles(),Me.addPassButtonStyles(),this.parent.passPredictor.modal||await this.parent.passPredictor.init(),!document.getElementById("satellite-info-header-styles")){const p=document.createElement("style");p.id="satellite-info-header-styles",p.textContent=`
                #satellite_info_header, #ground_station_info_header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    _margin-bottom: 15px;
                }
                
                .actions_row {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    flex-wrap: wrap;
                }
            `,document.head.appendChild(p)}const a={noradId:e.norad_id,name:e.name},i=this.parent.bookmarks.createBookmarkButton(a,(p,b)=>{console.log(p?"Bookmarked":"Removed bookmark for",b.name);const _=p?`Added "${b.name}" to bookmarks`:`Removed "${b.name}" from bookmarks`;console.log(_)});this._initializeToastSystem();const n=f("actions_container");n.innerHTML="";const o=this.parent.bookmarks.isBookmarked(a);if(i.innerHTML=`
            <svg class="w-4 h-4" fill="${o?"currentColor":"none"}" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
        `,i.title=o?"Remove bookmark":"Add bookmark",n.appendChild(i),e.isTip){const p=document.createElement("button");p.className="action-button action-button-important";const b=document.createElement("img");b.src=this.parent._resolveUrl("flame.svg",this.parent.options.svgsPath),b.className="w-4 h-4",p.appendChild(b),p.title="Reentry prediction available",p.addEventListener("click",()=>{this.parent.highlightedOrbits.has(e.norad_id)?this.parent._removeSatelliteOrbit(e.norad_id):this.parent._calculateSatelliteRentry(e,e.isTip)}),n.appendChild(p)}const l=this.functionsController.createFunctionsButton(e,t,s);l.className="action-button",n.appendChild(l);const r=this._createAltitudeHistoryButton(e,t,s);r.className="action-button",n.appendChild(r);const c=this._createRideButton(e);c.className="action-button",n.appendChild(c);const g=document.createElement("button"),u=this.parent.trackedSatellite&&this.parent.trackedSatellite.norad_id==e.norad_id;g.className=u?"action-button-active":"action-button",g.innerHTML=`
            <svg class="w-4 h-4" fill="${u?"currentColor":"none"}" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" stroke-width="2"/>
                <path stroke-linecap="round" stroke-width="2" d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
            </svg>
        `,g.title=u?"Stop tracking":"Track satellite",g.addEventListener("click",()=>{this.parent.trackSatellite(u?null:e.norad_id);const p=this.parent.trackedSatellite&&this.parent.trackedSatellite.norad_id==e.norad_id;g.className=p?"action-button-active":"action-button",g.querySelector("svg").setAttribute("fill",p?"currentColor":"none"),g.title=p?"Stop tracking":"Track satellite"}),n.appendChild(g);const h=this._createSatInfoPageButton(e,t,s);h.className="action-button",n.appendChild(h)}_createTransitFinderButton(e,t,s){const a=document.createElement("button"),i=s&&s.sat_name||t&&t.name||e&&e.name||"?";return a.innerHTML=`
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <g transform="rotate(225 12 12)">
                    <path d="M12 2a10 10 0 0 1 0 20" stroke-width="2" fill="none"/>
                    <line x1="12" y1="2" x2="12" y2="22" stroke-width="2"/>
                </g>
                <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
            </svg>
        `,a.title="Find transits for this satellite",a.addEventListener("click",()=>{var l;const o=`/vis/transit-finder/${encodeURIComponent(i)}`;(l=window.appRouter)==null||l.navigate(o)}),a}_createSkyTransitsButton(e,t,s){const a=document.createElement("button"),i=s&&s.sat_name||t&&t.name||e&&e.name||"?";return a.innerHTML=`
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.5 7.207l1-1L13.793 7.5l-2 2 2.707 2.707 2-2 1.293 1.293-1 1 4.707 4.707 2.707-2.707L19.5 9.793l-1 1L17.207 9.5l2-2L16.5 4.793l-2 2L13.207 5.5l1-1L9.5-.207 6.793 2.5zM22.793 14.5L21.5 15.793 18.207 12.5l1.293-1.293zm-5-7L14.5 10.793 13.207 9.5 16.5 6.207zm-5-3L11.5 5.793 8.207 2.5 9.5 1.207z"/>
            </svg>
        `,a.title="View sky transits for this satellite",a.addEventListener("click",()=>{var l;const o=`/vis/sky-transits/${encodeURIComponent(i)}`;(l=window.appRouter)==null||l.navigate(o)}),a}_createAltitudeHistoryButton(e,t,s){const a=document.createElement("button"),i=s&&s.norad_id||t&&t.norad_id||e&&e.norad_id||"";return a.innerHTML=`
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
        `,a.title="View altitude history for this satellite",a.addEventListener("click",()=>{var o;const n=`/vis/altitude-history?norad=${i}`;(o=window.appRouter)==null||o.navigate(n)}),a}_createSatInfoPageButton(e,t,s){const a=document.createElement("button"),i=s&&s.norad_id||t&&t.norad_id||e&&e.norad_id||"";return a.innerHTML=`
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke-width="2"/>
                <path stroke-linecap="round" stroke-width="2" d="M12 16v-4"/>
                <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none"/>
            </svg>
        `,a.title="Satellite info page",a.addEventListener("click",()=>{window.open(`/sat/${i}`,"_blank")}),a}_createOrbitButton(){const e=document.createElement("button");return e.disabled=!0,e.innerHTML=`
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1a3 3 0 013 3 3 3 0 01-3 3 3 3 0 01-3-3 3 3 0 013-3"/>
                <path d="M12 7a3 3 0 013 3 3 3 0 01-3 3 3 3 0 01-3-3 3 3 0 013-3"/>
                <circle cx="12" cy="12" r="10"/>
            </svg>
        `,e.title="Show orbital path (coming soon)",e}_createRideButton(e){const t=document.createElement("button");return t.innerHTML=`
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 512 512">
                <path d="M511.596,253.263C489.253,179.149,379.371,123.259,256,123.259c-123.369,0-233.251,55.89-255.596,130.004
                    c-0.538,1.785-0.538,3.689,0,5.474C22.749,332.851,132.631,388.741,256,388.741c123.371,0,233.253-55.89,255.596-130.004
                    C512.135,256.951,512.135,255.049,511.596,253.263z M256,369.778c-111.861,0-214.823-49.753-236.564-113.778
                    C41.177,191.976,144.14,142.222,256,142.222c111.861,0,214.824,49.754,236.564,113.778
                    C470.824,320.024,367.862,369.778,256,369.778z"/>
                <path d="M256,151.704c-57.509,0-104.296,46.787-104.296,104.296c0,57.51,46.787,104.296,104.296,104.296
                    c57.51,0,104.296-46.787,104.296-104.296C360.296,198.491,313.509,151.704,256,151.704z M256,341.333
                    c-47.053,0-85.333-38.28-85.333-85.333c0-47.053,38.28-85.333,85.333-85.333c47.053,0,85.333,38.28,85.333,85.333
                    C341.333,303.053,303.053,341.333,256,341.333z"/>
                <circle cx="256" cy="256" r="18.963"/>
            </svg>
        `,t.title="Satellite POV",t.addEventListener("click",()=>{this.parent.riding_view===e?this.parent.riding_view=null:(this.parent.riding_view_request=e,this.parent._removeSatelliteOrbit(e.norad_id))}),t}_initializeToastSystem(){if(document.getElementById("toast-container"))return;const e=document.createElement("div");e.id="toast-container",e.className="fixed top-10 right-5 z-50 space-y-2",document.body.appendChild(e)}_hashString(e){let t=0;if(e.length===0)return t;for(let s=0;s<e.length;s++){const a=e.charCodeAt(s);t=(t<<5)-t+a,t=t&t}return Math.abs(t).toString(36)}_showToast(e,t="error",s=5e3,a=!1){const i=document.getElementById("toast-container");if(!i)return this._initializeToastSystem(),this._showToast(e,t,s,a);const n=this._hashString(e);if(i.querySelector(`[data-toast="${n}"]`))return;const l=document.createElement("div"),r="toast-"+Date.now();l.id=r,l.setAttribute("data-toast",n);let c,g,u;switch(t){case"success":c="toast-success",g="toast-icon-success",u='<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM13.854 6.146a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L9 9.293l3.646-3.647a.5.5 0 0 1 .708 0z"/>';break;case"warning":c="toast-warning",g="toast-icon-warning",u='<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>';break;case"info":c="toast-info",g="toast-icon-info",u='<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z"/>';break;default:c="toast-error",g="toast-icon-error",u='<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>'}const p=a||t==="error"?" toast-attention":"";l.className=`toast-base ${c}${p}`,l.innerHTML=`
            <div class="toast-icon ${g}">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    ${u}
                </svg>
            </div>
            <div class="toast-message">${e}</div>
        `,i.appendChild(l),s>0&&setTimeout(()=>{this._removeToast(r)},s)}_removeToast(e){const t=document.getElementById(e);t&&(t.style.opacity="0",t.style.transform="translateX(100%)",t.style.transition="all 0.3s ease",setTimeout(()=>{t.parentNode&&t.parentNode.removeChild(t)},300))}async _createUIElements(){const e=document.createElement("div");e.id="logo-overlay",e.style.cssText="position: absolute; top: 1px; left: 10px; opacity: 0.8; pointer-events: none; z-index: 1000;",e.innerHTML=`
            <svg width="240" height="80" xmlns="http://www.w3.org/2000/svg" fill="none" viewbox="0 0 260 80">
                <!-- Atom logo -->
                <g class="atom-logo" transform="translate(25, 35)" stroke="#1a73e8" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <!-- Central nucleus -->
                    <circle cx="0" cy="0" r="5" fill="#1a73e8"></circle>
                    <!-- Orbits -->
                    <ellipse rx="20" ry="8" transform="rotate(0)" style="/* fill: rgb(26,215,232); */"></ellipse>
                    <ellipse rx="20" ry="8" transform="rotate(60)"></ellipse>
                    <ellipse rx="20" ry="8" transform="rotate(120)" style="fill: rgb(26,153,119);"></ellipse>
                    <ellipse rx="20" ry="8" transform="rotate(30)"></ellipse>
                    <ellipse rx="20" ry="8" transform="rotate(90)"></ellipse>
                    <ellipse rx="20" ry="8" transform="rotate(150)"></ellipse>
                </g>
                <!-- Text -->
                <text x="45" y="50" font-family="Segoe UI, Tahoma, Geneva, Verdana, sans-serif" font-weight="400" font-size="20" fill="#eee">.satellitemap.space</text>
            </svg>
        `,document.body.appendChild(e);const t=document.createElement("div");t.id="satellite_info_panel",t.class="info_panel slide-in",t.style.display="none",t.innerHTML=`
            <div id="satellite_info_header">
                <h3>Satellite Information</h3>
                <button type="button" class="close-button-inline" id="satellite_info_close">✕</button>
            </div>
            <div id="satellite_info_content">
                <div class="info_section">
                    <div class="info_row"><span class="info_label">Name:</span> <span id="sat_name">-</span></div>
                    <div class="info_row"><span class="info_label">NORAD ID:</span> <span id="sat_norad_id">-</span></div>
                    <div class="info_row"><span class="info_label">International Designator:</span> <span id="sat_international_designator">-</span></div>
                    <div class="info_row"><span class="info_label">Constellation:</span> <span id="sat_constellation">-</span></div>
                    <div id="sat_orbit_classifications" class="flex flex-wrap gap-1 mt-2 mb-2"></div>
                </div>
                <div class="info_section">
                    <h4>Actions</h4>
                    <div class="grid grid-cols-6 gap-0.5" id="actions_container">
                        <!-- Action buttons will be inserted here -->
                    </div>
                </div>
                <!-- Collapsible Sections -->

<div id="accordion-collapse" data-accordion="open">

  <!-- Section 0: About This Satellite -->
  <div id="satellite-description-section" class="accordion-item border-gray-200 dark:border-gray-700 rounded-lg mb-2" style="display: none;">
    <h2 id="heading-description">
      <button type="button"
        class="flex justify-between items-center w-full p-4 text-left text-white bg-gray-800 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-t-lg focus:outline-none"
        data-accordion-target="#body-description"
        aria-expanded="false"
        aria-controls="body-description">
        <span id="description-section-title">About This Satellite</span>
        <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0"
             fill="none" viewBox="0 0 10 6">
          <path d="M9 5 5 1 1 5" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </h2>
    <div id="body-description" class="hidden" aria-labelledby="heading-description">
      <div class="p-4 bg-gray-900 text-white space-y-3">
        <div id="satellite-description-content">
          <div class="text-center text-gray-400 text-sm py-4">
            <svg class="animate-spin h-5 w-5 mx-auto mb-2" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading description...
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="hide_if_decayed">
  <!-- Section 1: Orbital Elements -->
  <div class="accordion-item border-gray-200 dark:border-gray-700 rounded-lg mb-2">
    <h2 id="heading-orbital">
      <button type="button"
        class="flex justify-between items-center w-full p-4 text-left text-white bg-gray-800 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-t-lg focus:outline-none"
        data-accordion-target="#body-orbital"
        aria-expanded="false"
        aria-controls="body-orbital">
        <span>Orbital Elements (at latest TLE)</span>
        <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0"
             fill="none" viewBox="0 0 10 6">
          <path d="M9 5 5 1 1 5" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </h2>
    <div id="body-orbital" class="hidden" aria-labelledby="heading-orbital">
      <div class="p-4 bg-gray-900 text-white space-y-1">
        <div class="info_row"><span class="info_label">Inclination:</span> <span id="sat_inclination">-</span>°</div>
        <div class="info_row"><span class="info_label">Eccentricity:</span> <span id="sat_eccentricity">-</span></div>
        <div class="info_row"><span class="info_label">Semi-major Axis:</span> <span id="sat_semi_major_axis">-</span>&nbsp;km</div>
        <div class="info_row"><span class="info_label">Period:</span> <span id="sat_period">-</span>&nbsp;min</div>
        <div class="info_row"><span class="info_label">Argument of Perigee:</span> <span id="sat_arg_perigee">-</span>°</div>
        <div class="info_row"><span class="info_label">RAAN:</span> <span id="sat_raan">-</span>°</div>
        <div class="info_row"><span class="info_label">Mean Anomaly:</span> <span id="sat_mean_anomaly">-</span>°</div>
        <div class="info_row"><span class="info_label">Mean Motion:</span> <span id="sat_mean_motion">-</span>&nbsp;rev/day</div>
      </div>
    </div>
  </div>

  <!-- Section 2: Current Position -->
  <div class="accordion-item border-gray-200 dark:border-gray-700 rounded-lg mb-2">
    <h2 id="heading-position">
      <button type="button"
        class="flex justify-between items-center w-full p-4 text-left text-white bg-gray-800 hover:bg-gray-700 rounded-t-lg focus:outline-none"
        data-accordion-target="#body-position"
        aria-expanded="false"
        aria-controls="body-position">
        <span>Current Position</span>
        <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0"
             fill="none" viewBox="0 0 10 6">
          <path d="M9 5 5 1 1 5" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </h2>
    <div id="body-position" class="hidden" aria-labelledby="heading-position">
      <div class="p-4 bg-gray-900 text-white space-y-1">
        <div class="info_row"><span class="info_label">Latitude:</span> <span id="sat_latitude">-</span>°</div>
        <div class="info_row"><span class="info_label">Longitude:</span> <span id="sat_longitude">-</span>°</div>
        <div class="info_row"><span class="info_label">Altitude:</span> <span id="sat_altitude">-</span>&nbsp;km</div>
        <div class="info_row"><span id="sat_notes"></span></div>
        <!-- <div class="info_row"><span class="info_label">Velocity:</span> <span id="sat_velocity">-</span>&nbsp;km/s</div> -->
      </div>
    </div>
  </div>
  </div>

  <div class="accordion-item border-gray-200 dark:border-gray-700 rounded-lg mb-2">
    <h2 id="heading-hardware">
      <button type="button"
        class="flex justify-between items-center w-full p-4 text-left text-white bg-gray-800 hover:bg-gray-700 rounded-t-lg focus:outline-none"
        data-accordion-target="#body-hardware"
        aria-expanded="false"
        aria-controls="body-hardware">
        <span>Hardware</span>
        <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0"
             fill="none" viewBox="0 0 10 6">
          <path d="M9 5 5 1 1 5" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </h2>
    <div id="body-hardware" class="hidden" aria-labelledby="hardware-position">
      <div class="p-4 bg-gray-900 text-white space-y-1">
                            <div class="info_row"><span class="info_label">Hardware:</span> <span id="sat_hardware">-</span></div>
                            <div class="info_row"><span class="info_label">Generation:</span> <span id="sat_generation">-</span></div>
                            <div class="info_row"><span class="info_label">Description:</span> <span id="sat_hardware_desc">-</span></div>
                            <div id="sat_hardware_na" class="hidden" style="font-size: 11px; color: #6b7280; font-style: italic;">hardware version: n/a</div>
                            <div id="sat_transmitters"></div>
      </div>
    </div>
  </div>

  <div id="sat-media-section" class="accordion-item border-gray-200 dark:border-gray-700 rounded-lg mb-2 hidden">
    <h2 id="heading-media">
      <button type="button"
        class="flex justify-between items-center w-full p-4 text-left text-white bg-gray-800 hover:bg-gray-700 rounded-t-lg focus:outline-none"
        data-accordion-target="#body-media"
        aria-expanded="false"
        aria-controls="body-media">
        <span>Pictures</span>
        <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0"
             fill="none" viewBox="0 0 10 6">
          <path d="M9 5 5 1 1 5" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </h2>
    <div id="body-media" class="hidden" aria-labelledby="heading-media">
      <div class="p-4 bg-gray-900 text-white">
        <div id="sat-media-carousel" class="relative w-full">
          <div id="sat-media-slides" class="relative aspect-video overflow-hidden rounded-lg bg-gray-800">
            <p id="sat-media-empty" class="text-gray-500 text-sm text-center py-8">No pictures available yet</p>
          </div>
          <div id="sat-media-nav" class="hidden">
            <button id="sat-media-prev" class="sat-media-nav-btn absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 6 10"><path d="M5 1 1 5l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button id="sat-media-next" class="sat-media-nav-btn absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 6 10"><path d="M1 9l4-4-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
          <div id="sat-media-dots" class="flex justify-center gap-2 mt-2"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="accordion-item border-gray-200 dark:border-gray-700 rounded-lg mb-2">
    <h2 id="heading-launch">
      <button type="button"
        class="flex justify-between items-center w-full p-4 text-left text-white bg-gray-800 hover:bg-gray-700 rounded-t-lg focus:outline-none"
        data-accordion-target="#body-launch"
        aria-expanded="false"
        aria-controls="body-launch">
        <span>Launch</span>
        <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0"
             fill="none" viewBox="0 0 10 6">
          <path d="M9 5 5 1 1 5" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </h2>
    <div id="body-launch" class="hidden" aria-labelledby="heading-launch">
      <div class="p-4 bg-gray-900 text-white space-y-1">

                            <div class="info_row"><span class="info_label">Launch:</span> <span id="sat_launch_name">-</span></div>
                            <div class="info_row"><span class="info_label">Launch Date:</span> <span id="sat_launch_date">-</span></div>
                            <div class="info_row"><span class="info_label">Vehicle:</span> <span id="sat_vehicle">-</span></div>
                            <div class="info_row"><span class="info_label">Launch Site:</span> <span id="sat_launch_site">-</span></div>
                            <div class="info_row"><span class="info_label">Target Altitude:</span> <span id="sat_target_altitude">-</span> km</div>
                            <div class="info_row"><span class="info_label">Target Inclination:</span> <span id="sat_target_inclination">-</span>°</div>
      </div>
    </div>
  </div>

  <div id="hide_if_decayed_2">
  <div class="accordion-item border-gray-200 dark:border-gray-700 rounded-lg mb-2">
    <h2 id="heading-tle">
      <button type="button"
        class="flex justify-between items-center w-full p-4 text-left text-white bg-gray-800 hover:bg-gray-700 rounded-t-lg focus:outline-none"
        data-accordion-target="#body-tle"
        aria-expanded="false"
        aria-controls="body-tle">
        <span>TLE</span>
        <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0"
             fill="none" viewBox="0 0 10 6">
          <path d="M9 5 5 1 1 5" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </h2>
    <div id="body-tle" class="hidden" aria-labelledby="heading-tle">
      <div class="p-4 bg-gray-900 text-white space-y-1">

        <div class="info_row"><span class="info_label">Epoch:</span> <span id="sat_epoch">-</span></div>
        <div class="info_row"><span class="info_label">Age:</span> <span id="sat_epoch_age">-</span></div>
        <!-- <div class="info_row"><span class="info_label">Classification:</span> <span id="sat_classification">-</span></div>
        <div class="info_row"><span class="info_label">Element Set:</span> <span id="sat_element_set">-</span></div> -->
        <div class="mt-2">
          <button id="tle-copy-btn" class="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-400 bg-transparent border border-blue-400 hover:bg-blue-400 hover:text-white rounded-lg transition-colors duration-200" title="Copy TLE data to clipboard">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            copy tle
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
  <!-- Repeat similar for Hardware, Launch Info, TLE Data -->
  <!-- Use unique IDs for each heading and body -->
</div>

            </div>
        `,document.body.appendChild(t),typeof window.initAccordions=="function"&&window.initAccordions();const s=document.getElementById("satellite_info_close");s&&s.addEventListener("click",()=>{this.parent.hideSatelliteInfoPanel()}),await this._createLoadSimPanel();const a=document.getElementById("toolbar"),i=document.getElementById("utc_time");a&&(a.addEventListener("mouseenter",()=>{this.parent._resetUIDimTimer()}),document.addEventListener("touchmove",n=>{if(n.touches.length===1){const o=n.touches[0],l=a.getBoundingClientRect();o.clientX>=l.left&&o.clientX<=l.right&&o.clientY>=l.top&&o.clientY<=l.bottom&&this.parent._resetUIDimTimer()}},{passive:!0})),i&&i.addEventListener("mouseenter",()=>{this.parent._resetUIDimTimer()})}_createGroundStationInfoPanel(){if(!document.getElementById("ground-station-info-header-styles")){const t=document.createElement("style");t.id="ground-station-info-header-styles",t.textContent=`
                .ground_station_tile_image {
                    height: 300px;
                    border-radius: 8px;
                    cursor: zoom-in;
                }
                .ground_station_tile_image.zoom1 {
                    animation: zoomTo1 0.3s forwards;
                }
                .ground_station_tile_image.zoom2 {
                    animation: zoomTo2 0.3s forwards;
                }
                @keyframes zoomTo1 {
                    from { transform: scale(1); }
                    to { transform: scale(2); }
                }
                @keyframes zoomTo2 {
                    from { transform: scale(2); }
                    to { transform: scale(4); }
                }
                .ground_station_tile_image:hover {
                    _cursor: zoom-in;
                }
            `,document.head.appendChild(t)}const e=document.createElement("div");e.id="ground_station_info_panel",e.class="info_panel slide-in",e.innerHTML=`
            <div id="ground_station_info_header">
                <h3>Ground Station Information</h3>
                <button type="button" class="close-button-inline" id="ground_station_info_close">✕</button>
            </div>
            <div id="ground_station_info_content">
                <div class="info_section">
                    <div class="info_row"><span class="info_label">Name:</span> <span id="gs_name">-</span></div>
                    <div class="info_row"><span class="info_label">Status:</span> <span id="gs_status">-</span></div>
                </div>

                <!-- Location Information -->
<div id="accordion-ground-station" data-accordion="open">

  <div class="accordion-item border-gray-200 dark:border-gray-700 rounded-lg mb-2">
    <h2 id="heading-location">
      <button type="button"
        class="flex justify-between items-center w-full p-4 text-left text-white bg-gray-800 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-t-lg focus:outline-none"
        data-accordion-target="#body-location"
        aria-expanded="false"
        aria-controls="body-location">
        <span>Location</span>
        <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0"
             fill="none" viewBox="0 0 10 6">
          <path d="M9 5 5 1 1 5" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </h2>
    <div id="body-location" class="hidden" aria-labelledby="heading-location">
      <div class="p-4 bg-gray-900 text-white space-y-1">
                            <div class="info_row"><span class="info_label">Latitude:</span> <span id="gs_latitude">-</span>°</div>
                            <div class="info_row"><span class="info_label">Longitude:</span> <span id="gs_longitude">-</span>°</div>
      </div>
    </div>
  </div>

                <!-- Operational Status -->

  <div class="accordion-item border-gray-200 dark:border-gray-700 rounded-lg mb-2">
    <h2 id="heading-operational">
      <button type="button"
        class="flex justify-between items-center w-full p-4 text-left text-white bg-gray-800 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-t-lg focus:outline-none"
        data-accordion-target="#body-operational"
        aria-expanded="false"
        aria-controls="body-operational">
        <span>Operational Status</span>
        <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0"
             fill="none" viewBox="0 0 10 6">
          <path d="M9 5 5 1 1 5" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </h2>
    <div id="body-operational" class="hidden" aria-labelledby="heading-operational">
      <div class="p-4 bg-gray-900 text-white space-y-1">
                            <div class="info_row"><span class="info_label">Construction:</span> <span id="gs_construction_status">-</span></div>
                            <div class="info_row"><span class="info_label">Ka Band:</span> <span id="gs_ka_operational">-</span></div>
                            <div class="info_row"><span class="info_label">E Band:</span> <span id="gs_e_operational">-</span></div>
                            <div class="info_row"><span class="info_label">Ku Band:</span> <span id="gs_ku_operational">-</span></div>
                            <div class="info_row"><span class="info_label">V Band:</span> <span id="gs_v_operational">-</span></div>
                            <div class="info_row"><span class="info_label">Laser Links:</span> <span id="gs_laser_operational">-</span></div>

      </div>
    </div>
  </div>

  <!-- Section 2: Current Position -->


  <div class="accordion-item border-gray-200 dark:border-gray-700 rounded-lg mb-2">
    <h2 id="heading-equip">
      <button type="button"
        class="flex justify-between items-center w-full p-4 text-left text-white bg-gray-800 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-t-lg focus:outline-none"
        data-accordion-target="#body-equip"
        aria-expanded="false"
        aria-controls="body-equip">
        <span>Equipment Info</span>
        <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0"
             fill="none" viewBox="0 0 10 6">
          <path d="M9 5 5 1 1 5" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </h2>
    <div id="body-equip" class="hidden" aria-labelledby="heading-equip">
      <div class="p-4 bg-gray-900 text-white space-y-1">
                            <div class="info_row"><span class="info_label">Antenna Count:</span> <span id="gs_antenna_count">-</span></div>
                            <div class="info_row"><span class="info_label">Equipment Type:</span> <span id="gs_equipment_type">-</span></div>
                            <div class="info_row"><span class="info_label">Facility Info:</span> <span id="gs_facility_info">-</span></div>
      </div>
    </div>
  </div>

  <div class="accordion-item border-gray-200 dark:border-gray-700 rounded-lg mb-2">
    <h2 id="heading-view">
      <button type="button"
        class="flex justify-between items-center w-full p-4 text-left text-white bg-gray-800 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-t-lg focus:outline-none"
        data-accordion-target="#body-view"
        aria-expanded="false"
        aria-controls="body-view">
        <span>Earth view</span>
        <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0"
             fill="none" viewBox="0 0 10 6">
          <path d="M9 5 5 1 1 5" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </h2>
    <div id="body-view" class="hidden" aria-labelledby="heading-view">
      <div class="p-4 bg-gray-900 text-white space-y-1">
                        <div id="gs_tile_container" style="position: relative; overflow: hidden;">
                            <img draggable="false" id="gs_tile_image" class="ground_station_tile_image" style="display: none; transform-origin: center;" alt="Ground Station Satellite View">
                            <div id="gs_tile_loading" style="text-align: center; padding: 20px; color: #999;">
                                Loading satellite image...
                            </div>
                            <div id="gs_tile_unavailable" style="text-align: center; padding: 20px; color: #999; display: none;">
                                Satellite image not available
                            </div>
                        </div>

      </div>
    </div>
  </div>


                </div>
            </div>
        `,document.body.appendChild(e),document.getElementById("ground_station_info_close").addEventListener("click",()=>{e.style.display="none"}),this._setupGroundStationImageZoom()}_setupGroundStationImageZoom(){document.addEventListener("click",e=>{if(e.target&&e.target.id==="gs_tile_image"){const t=e.target,s=parseInt(t.dataset.state||"0"),a=t.getBoundingClientRect(),i=(e.clientX-a.left)/a.width*100,n=(e.clientY-a.top)/a.height*100;switch(t.style.transformOrigin=`${i}% ${n}%`,s){case 0:t.classList.add("zoom1"),t.dataset.state="1";break;case 1:t.classList.remove("zoom1"),t.classList.add("zoom2"),t.dataset.state="2";break;case 2:t.dataset.zoomedImage?(t.classList.remove("zoom2"),t.src=t.dataset.zoomedImage,t.style.transformOrigin="center",t.dataset.state="3"):(t.classList.remove("zoom2"),t.style.transformOrigin="center",t.dataset.state="0");break;case 3:t.classList.add("zoom1"),t.dataset.state="4";break;case 4:t.classList.remove("zoom1"),t.classList.add("zoom2"),t.dataset.state="5";break;case 5:t.classList.remove("zoom2"),t.dataset.normalImage&&(t.src=t.dataset.normalImage),t.style.transformOrigin="center",t.dataset.state="0";break}}})}_resetGroundStationImageZoom(){const e=document.getElementById("gs_tile_image");e&&(e.classList.remove("zoom1","zoom2"),e.dataset.state="0",e.style.transformOrigin="center",e.dataset.normalImage&&(e.src=e.dataset.normalImage))}async showGroundStationInfo(e){const t=document.getElementById("ground_station_info_panel");if(!t){console.warn("Ground station info panel not found");return}t.style.display="block",t.offsetHeight,t.classList.add("slide-in");const s=["gs_name","gs_status","gs_latitude","gs_longitude","gs_construction_status","gs_ka_operational","gs_e_operational","gs_ku_operational","gs_v_operational","gs_laser_operational","gs_antenna_count","gs_equipment_type","gs_facility_info"];s.forEach(o=>{const l=document.getElementById(o);l&&(l.textContent="Loading...")}),this._resetGroundStationImageZoom();const a=document.getElementById("gs_tile_image"),i=document.getElementById("gs_tile_loading"),n=document.getElementById("gs_tile_unavailable");a&&(a.style.display="none"),i&&(i.style.display="block"),n&&(n.style.display="none");try{const o=await fetch(`${this.parent.apiBaseUrl}/api/ground-stations?id=${e}&includeTile=true`,{headers:this.parent.apiKey?{"X-API-Key":this.parent.apiKey}:{}});if(!o.ok)throw new Error(`HTTP ${o.status}: ${o.statusText}`);const l=await o.json();if(!l.success||!l.data)throw new Error("Failed to fetch ground station data");const r=l.data;document.getElementById("gs_name").textContent=r.name||"-",document.getElementById("gs_status").textContent=r.status||"-",document.getElementById("gs_latitude").textContent=r.lat?parseFloat(r.lat).toFixed(6):"-",document.getElementById("gs_longitude").textContent=r.lng?parseFloat(r.lng).toFixed(6):"-",document.getElementById("gs_construction_status").textContent=r.construction_status||"-",document.getElementById("gs_ka_operational").textContent=r.ka_operational||"-",document.getElementById("gs_e_operational").textContent=r.e_operational||"-",document.getElementById("gs_ku_operational").textContent=r.ku_operational||"-",document.getElementById("gs_v_operational").textContent=r.v_operational||"-",document.getElementById("gs_laser_operational").textContent=r.laser_operational||"-",document.getElementById("gs_antenna_count").textContent=r.antenna_count?r.antenna_count.toString():"-",document.getElementById("gs_equipment_type").textContent=r.equipment_type||"-",document.getElementById("gs_facility_info").textContent=r.facility_info||"-",r.tileImages?(r.tileImages.normal&&(a.dataset.normalImage=`data:${r.tileImages.normal.contentType};base64,${r.tileImages.normal.data}`),r.tileImages.zoomed&&(a.dataset.zoomedImage=`data:${r.tileImages.zoomed.contentType};base64,${r.tileImages.zoomed.data}`),r.tileImages.normal?(a.src=a.dataset.normalImage,a.style.display="block",i.style.display="none"):(i.style.display="none",n.style.display="block")):r.tileImage&&r.tileImage.data?(a.src=`data:${r.tileImage.contentType};base64,${r.tileImage.data}`,a.style.display="block",i.style.display="none"):(i.style.display="none",n.style.display="block")}catch(o){console.error("Error fetching ground station data:",o),s.forEach(l=>{const r=document.getElementById(l);r&&(r.textContent="Error loading data")}),i.style.display="none",n.textContent="Error loading image",n.style.display="block"}}repopulateSatelliteInfoPanel(){let e=f("satellite_info_panel");if(e&&e.style.display!=="none"){let t=e._client_data;if(t.satelliteData){const s=t.satelliteData,a=this.parent._getTruePositionAndTravel(s),i=a?Te(a.position):null,n=f("sat_notes");if(i&&!isNaN(i.latitude)&&!isNaN(i.longitude)&&!isNaN(i.altitude)?(f("sat_latitude").textContent=i.latitude.toFixed(4),f("sat_longitude").textContent=i.longitude.toFixed(4),f("sat_altitude").textContent=i.altitude.toFixed(2)):(f("sat_latitude").textContent="",f("sat_longitude").textContent="",f("sat_altitude").textContent=""),s.isTip&&n){const o=this.parent._formatTipStatus(s.isTip,this.parent.wallclock.now());let l=[];o.phase==="after"?(l.push(`<span style="color:${o.color}">Re-entered ${o.timeStr} ago</span>`),l.push(`<span style="color:#9ca3af">Predicted: ${o.decayEpoch.toISOString().replace("T"," ").slice(0,19)} UTC</span>`)):o.phase==="before"?(l.push(`<span style="color:${o.color}">Decay predicted in ${o.timeStr}</span>`),l.push(`<span style="color:#9ca3af">Window: ±${o.windowStr} around ${o.decayEpoch.toISOString().replace("T"," ").slice(0,16)} UTC</span>`)):(l.push(`<span style="color:${o.color}">Re-entry window active — decay ${o.isPast?o.timeStr+" ago":"in "+o.timeStr}</span>`),l.push(`<span style="color:#9ca3af">${o.windowStart.toISOString().slice(11,16)}–${o.windowEnd.toISOString().slice(11,16)} UTC (${o.windowStr})</span>`)),o.locationStr&&l.push(`<span style="color:#9ca3af">Location: ${o.locationStr}</span>`),l.push(`<span style="letter-spacing:2px; font-family:monospace; color:${o.color}">${o.timeline}</span>`),n.innerHTML=`<div style="font-size:11px; line-height:1.5; margin-top:4px">${l.join("<br>")}</div>`}else n&&(s._propagation_burned?n.innerHTML='<div style="font-size:11px; line-height:1.5; margin-top:4px; color:#ef4444">Satellite has presumably burned up<br><span style="color:#9ca3af">Propagated altitude dropped below 120 km</span></div>':!i||isNaN(i.latitude)?n.textContent="No position available":n.textContent="")}else f("sat_latitude").textContent="?",f("sat_longitude").textContent="?",f("sat_altitude").textContent="?"}}async populateSatelliteInfoPanel(e,t,s=null){var b,_,y;let a=document.getElementById("satellite_info_panel");a||(await this._createUIElements(),a=document.getElementById("satellite_info_panel")),a._client_data={satelliteData:e,movingPoint:t,detailedData:s};const i=e&&e.tleData&&e.tleData.orbital_elements;if(!e&&!s){console.error("No satellite data or metadata available");return}const n=i?e.tleData.orbital_elements:null,o=s&&s.sat_name||n&&n.name||e&&e.name||"?",l=s&&s.norad_id||n&&n.norad_id||e&&e.norad_id||"?",r=s&&s.intldes||"",c=s&&s.constellation_name||e&&e.constellation||"(no)",g=v=>document.getElementById(v);f("sat_name").textContent=o,f("sat_norad_id").textContent=l,f("sat_international_designator").textContent=r,f("sat_constellation").textContent=c;const u=f("sat_orbit_classifications");u.innerHTML="";const h=s&&s.orbit_classifications;if(h&&h.split(",").map(w=>w.trim()).forEach(w=>{if(w){const x=document.createElement("span");x.className="orbit-badge",x.textContent=w,u.appendChild(x)}}),this._createActions(e,n,s),i){f("hide_if_decayed").style.display="",f("hide_if_decayed_2").style.display="",f("sat_inclination").textContent=n.inclination?n.inclination.toFixed(4):"?",f("sat_eccentricity").textContent=n.eccentricity?n.eccentricity.toFixed(6):"?",f("sat_semi_major_axis").textContent=n.semi_major_axis?n.semi_major_axis.toFixed(2):"?",f("sat_period").textContent=n.period?n.period.toFixed(2):"?",f("sat_arg_perigee").textContent=n.arg_perigee?n.arg_perigee.toFixed(4):"?",f("sat_raan").textContent=n.right_ascension?n.right_ascension.toFixed(4):"?",f("sat_mean_anomaly").textContent=n.mean_anomaly?n.mean_anomaly.toFixed(4):"?",f("sat_mean_motion").textContent=n.mean_motion?n.mean_motion.toFixed(6):"?",f("sat_epoch").textContent=n.epoch_timestamp||"?";const v=Be(n.epoch_timestamp),w=g("sat_epoch_age");w.textContent=v.text,w.style.color=v.color}else f("hide_if_decayed").style.display="none",f("hide_if_decayed_2").style.display="none",f("sat_inclination").textContent="n/a",f("sat_eccentricity").textContent="n/a",f("sat_semi_major_axis").textContent="n/a",f("sat_period").textContent="n/a",f("sat_arg_perigee").textContent="n/a",f("sat_raan").textContent="n/a",f("sat_mean_anomaly").textContent="n/a",f("sat_mean_motion").textContent="n/a",f("sat_epoch").textContent="n/a",f("sat_epoch_age").textContent="n/a";if(s){const v=s.hardware_name||s.generation||s.hardware_description,w=(b=f("sat_hardware"))==null?void 0:b.parentElement,x=(_=f("sat_generation"))==null?void 0:_.parentElement,S=(y=f("sat_hardware_desc"))==null?void 0:y.parentElement,C=f("sat_hardware_na");v?(f("sat_hardware").textContent=s.hardware_name||"?",f("sat_generation").textContent=s.generation||"?",f("sat_hardware_desc").textContent=s.hardware_description||"?",w&&(w.style.display=""),x&&(x.style.display=""),S&&(S.style.display=""),C&&C.classList.add("hidden")):(w&&(w.style.display="none"),x&&(x.style.display="none"),S&&(S.style.display="none"),C&&C.classList.remove("hidden"));const k=f("sat_transmitters");if(k)if(s.transmitters&&s.transmitters.length>0){const A=s.transmitters;let D=`<div style="margin-top: 8px; border-top: 1px solid #374151; padding-top: 8px;">
                        <div style="font-size: 11px; color: #9ca3af; margin-bottom: 4px;">Radio (${A.length})</div>`;for(const E of A){const F=E.status==="active"?"#4ade80":"#6b7280",N=[];E.downlink_mhz&&N.push(`↓${E.downlink_mhz}`),E.uplink_mhz&&N.push(`↑${E.uplink_mhz}`),D+=`<div style="font-size: 11px; line-height: 1.6; color: #d1d5db;">
                            <span style="color: ${F};">●</span>
                            <span style="color: #93c5fd;">${N.join(" ")||"?"} MHz</span>
                            ${E.mode?`<span style="color: #9ca3af;">${E.mode}</span>`:""}
                            <span style="color: #6b7280;">${E.type||""}</span>
                            ${E.service&&E.service!=="Unknown"?`<span style="color: #6b7280;">[${E.service}]</span>`:""}
                        </div>`}D+='<div style="font-size: 10px; color: #6b7280; margin-top: 4px;">Source: <a href="https://db.satnogs.org" target="_blank" rel="noopener" style="color: #60a5fa; text-decoration: none;">SatNOGS DB</a></div>',D+="</div>",k.innerHTML=D}else k.innerHTML="";s.launch_name||s.launch_datetime_utc||s.vehicle||s.launch_site||s.altitude_km||s.inclination_deg?(f("sat_launch_name").textContent=s.launch_name||"?",f("sat_launch_date").textContent=s.launch_datetime_utc?new Date(s.launch_datetime_utc).toLocaleDateString():"?",f("sat_vehicle").textContent=s.vehicle||"?",f("sat_launch_site").textContent=s.launch_site||"?",f("sat_target_altitude").textContent=s.altitude_km||"?",f("sat_target_inclination").textContent=s.inclination_deg||"?"):(f("sat_launch_name").textContent="Unknown",f("sat_launch_date").textContent="Unknown",f("sat_vehicle").textContent="Unknown",f("sat_launch_site").textContent="Unknown",f("sat_target_altitude").textContent="Unknown",f("sat_target_inclination").textContent="Unknown")}else f("sat_hardware").textContent="Unknown",f("sat_generation").textContent="Unknown",f("sat_hardware_desc").textContent="Unknown",f("sat_launch_name").textContent="Unknown",f("sat_launch_date").textContent="Unknown",f("sat_vehicle").textContent="Unknown",f("sat_launch_site").textContent="Unknown",f("sat_target_altitude").textContent="Unknown",f("sat_target_inclination").textContent="Unknown";l!=="?"&&(this.loadSatelliteDescription(l,o),this.loadSatelliteMedia(l)),a.style.display="block",a.offsetHeight,a.classList.add("slide-in");const p=document.getElementById("tle-copy-btn");if(p){p.replaceWith(p.cloneNode(!0));const v=document.getElementById("tle-copy-btn");v.addEventListener("click",async w=>{w.stopPropagation();let x="";if(e&&e.tleData&&e.tleData.raw_tle){const S=e.tleData.raw_tle.tle_line1,C=e.tleData.raw_tle.tle_line2;x=`${S}
${C}`}else if(t&&this.parent.dots&&this.parent.dots.movingPoints){const S=this.parent.dots.movingPoints.find(C=>C.norad_id===t.norad_id);if(S&&S.tleData&&S.tleData.raw_tle){const C=S.tleData.raw_tle.tle_line1,k=S.tleData.raw_tle.tle_line2;x=`${C}
${k}`}}if(x)try{await navigator.clipboard.writeText(x),this._showToast("TLE data copied to clipboard","success",2e3),v.classList.add("text-green-400"),setTimeout(()=>{v.classList.remove("text-green-400")},500)}catch(S){console.error("Failed to copy TLE:",S),this._showToast("Failed to copy TLE data","error",3e3)}else this._showToast("No TLE data available to copy","warning",3e3)})}t&&this.parent.standing_view&&(this.parent.trackedSatellite=t)}async calculateDescriptionHash(e,t){const s=`${e}:${t}:blueglobe`,i=new TextEncoder().encode(s),n=await crypto.subtle.digest("SHA-256",i);return Array.from(new Uint8Array(n)).map(l=>l.toString(16).padStart(2,"0")).join("").substring(0,8)}async loadSatelliteDescription(e,t){const s=document.getElementById("satellite-description-section"),a=document.getElementById("satellite-description-content"),i=document.getElementById("description-section-title");if(!s||!a||!i){console.log("Satellite description UI elements not found");return}try{const n=Date.now(),o=await this.calculateDescriptionHash(e,n),l=await fetch(`${this.parent._getApiUrl(`sd/${e}`)}?t=${n}&h=${o}`,{headers:this.parent._getApiHeaders(null)});if(l.ok){const r=await l.json();if(r.success&&r.data){const c=r.data,g=new Uint8Array(c.match(/.{1,2}/g).map(p=>parseInt(p,16))),u=new TextDecoder("utf-8").decode(g),h=JSON.parse(u);h.context.isGroup&&h.context.groupSize>0?i.innerHTML=`About <span class="text-yellow-400 font-bold">${h.context.groupName}</span>* <span class="text-gray-400 text-sm">(${h.context.groupSize} satellites)</span>`:h.context.isGroup&&h.context.groupSize===0?i.innerHTML=`About <span class="text-yellow-400 font-bold">${h.context.groupName}</span>`:i.innerHTML=`About <span class="text-yellow-400 font-bold">${t}</span>`,this.displaySatelliteDescription(h),s.style.display="block"}else s.style.display="none"}else s.style.display="none"}catch(n){console.error("Failed to load satellite description:",n),s.style.display="none"}}async loadSatelliteMedia(e){const t=document.getElementById("sat-media-section"),s=document.getElementById("sat-media-slides"),a=document.getElementById("sat-media-dots"),i=document.getElementById("sat-media-nav"),n=document.getElementById("sat-media-empty");if(!t||!s)return;this._mediaRequestId=(this._mediaRequestId||0)+1;const o=this._mediaRequestId;try{const l=await fetch(this.parent._getApiUrl(`satellite/${e}/media`),{headers:this.parent._getApiHeaders(null)});if(o!==this._mediaRequestId)return;if(s.querySelectorAll(".sat-media-slide").forEach(h=>h.remove()),a.innerHTML="",i.classList.add("hidden"),n&&n.classList.remove("hidden"),!l.ok){t.classList.remove("hidden");return}const{media:r}=await l.json();if(!r||r.length===0){t.classList.remove("hidden");return}n&&n.classList.add("hidden");let c=0;r.forEach((h,p)=>{const b=document.createElement("div");b.className=`sat-media-slide absolute inset-0 ${p===0?"":"hidden"}`;const _=document.createElement("img");if(_.src=h.url,_.alt=h.label||"",_.className="w-full h-full object-contain",h.link){const y=document.createElement("a");y.href=h.link,y.target="_blank",y.rel="noopener noreferrer",y.appendChild(_),b.appendChild(y)}else b.appendChild(_);if(h.label){const y=document.createElement("div");y.className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 truncate",y.textContent=h.label,b.appendChild(y)}s.appendChild(b)});const g=s.querySelectorAll(".sat-media-slide"),u=h=>{g.forEach((p,b)=>p.classList.toggle("hidden",b!==h)),a.querySelectorAll("button").forEach((p,b)=>{p.className=b===h?"sat-media-dot w-2.5 h-2.5 rounded-full bg-white":"sat-media-dot w-2.5 h-2.5 rounded-full bg-gray-500"}),c=h};r.length>1&&(r.forEach((h,p)=>{const b=document.createElement("button");b.className=p===0?"sat-media-dot w-2.5 h-2.5 rounded-full bg-white":"sat-media-dot w-2.5 h-2.5 rounded-full bg-gray-500",b.addEventListener("click",()=>u(p)),a.appendChild(b)}),i.classList.remove("hidden"),document.getElementById("sat-media-prev").onclick=()=>{u((c-1+r.length)%r.length)},document.getElementById("sat-media-next").onclick=()=>{u((c+1)%r.length)}),t.classList.remove("hidden")}catch(l){console.error("Failed to load satellite media:",l),t.classList.remove("hidden")}}formatDescriptionText(e){return e?e.split(`

`).map(t=>`<p class="text-sm text-gray-300 leading-relaxed mb-3">${t.trim()}</p>`).join(""):""}displaySatelliteDescription(e){const t=document.getElementById("satellite-description-content");if(!t)return;const s=JSON.parse(e.full_data);let a="";e.context.isGroup&&e.context.groupSize>0&&(a=`
                <div class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-900/50 border border-blue-700 text-blue-300 mb-3">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    </svg>
                    Group: ${e.context.groupSize} satellites
                </div>
            `),t.innerHTML=`
            ${a}
            
            <div class="space-y-3">
                <div class="prose prose-invert max-w-none">
                    ${this.formatDescriptionText(s.description)}
                </div>
                
                ${s.keyFacts?`
                    <div class="bg-gray-800 p-3 rounded-lg">
                        <h5 class="font-semibold text-yellow-400 mb-2 flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                            </svg>
                            Key Facts
                        </h5>
                        <ul class="list-disc list-inside space-y-1 text-gray-300 text-sm">
                            ${s.keyFacts.map(i=>`<li>${i}</li>`).join("")}
                        </ul>
                    </div>
                `:""}
                
                ${s.interestingNote?`
                    <div class="bg-purple-900/30 border border-purple-700 p-3 rounded-lg">
                        <h5 class="font-semibold text-purple-400 mb-2 flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
                            </svg>
                            Interesting Note
                        </h5>
                        <div class="text-sm text-gray-300">${this.formatDescriptionText(s.interestingNote)}</div>
                    </div>
                `:""}
                
                <div class="grid grid-cols-1 gap-3">
                    ${s.technicalDetails?`
                        <details class="bg-gray-800 rounded-lg">
                            <summary class="p-3 cursor-pointer text-blue-400 font-medium hover:bg-gray-700 rounded-lg">
                                Technical Details
                            </summary>
                            <div class="px-3 pb-3 text-sm text-gray-300">
                                ${this.formatDescriptionText(s.technicalDetails)}
                            </div>
                        </details>
                    `:""}
                    
                    ${s.historicalContext?`
                        <details class="bg-gray-800 rounded-lg">
                            <summary class="p-3 cursor-pointer text-green-400 font-medium hover:bg-gray-700 rounded-lg">
                                Historical Context
                            </summary>
                            <div class="px-3 pb-3 text-sm text-gray-300">
                                ${this.formatDescriptionText(s.historicalContext)}
                            </div>
                        </details>
                    `:""}
                    
                    ${s.operationalStatus?`
                        <details class="bg-gray-800 rounded-lg">
                            <summary class="p-3 cursor-pointer text-orange-400 font-medium hover:bg-gray-700 rounded-lg">
                                Operational Status
                            </summary>
                            <div class="px-3 pb-3 text-sm text-gray-300">
                                ${this.formatDescriptionText(s.operationalStatus)}
                            </div>
                        </details>
                    `:""}
                </div>
                
                ${s.references&&s.references.length>0?`
                    <div class="border-t border-gray-700 pt-3">
                        <h6 class="text-xs font-semibold text-gray-400 mb-2">References</h6>
                        <div class="space-y-1">
                            ${s.references.map(i=>`
                                <a href="${i.url}" target="_blank" rel="noopener noreferrer" 
                                   class="text-xs text-blue-400 hover:text-blue-300 block truncate">
                                    ${i.title||i.url}
                                </a>
                            `).join("")}
                        </div>
                    </div>
                `:""}
            </div>
        `}async _createLoadSimPanel(){const e=document.createElement("div");e.id="load_sim_panel",e.className="info_panel",e.style.display="none",e.style.fontSize="12px";const t={title:"Load Satellites",description:"Select filters to load specific satellites into the simulation",fields:[{id:"orbit_type",label:"Orbit Types",type:"select-multiple",dataSource:"orbit_types",placeholder:"Select orbit types..."},{id:"activity",label:"Activity",type:"select-single",options:[{value:"all",label:"All"},{value:"not-stable",label:"Any movement"},{value:"ascending",label:"Ascending ↑"},{value:"descending",label:"Descending ↓"},{value:"net-ascending",label:"Net ascending ↗"},{value:"net-descending",label:"Net descending ↘"},{value:"round-trip",label:"Round-trip ↕"},{value:"anomaly",label:"Anomaly ⚠"},{value:"stable",label:"Stable —"}],defaultValue:"all"},{id:"country",label:"Country",type:"select-multiple",options:[{value:"US",label:"United States"},{value:"RU",label:"Russia"},{value:"CN",label:"China"},{value:"UK",label:"United Kingdom"},{value:"F",label:"France"},{value:"D",label:"Germany"},{value:"J",label:"Japan"},{value:"IN",label:"India"},{value:"CA",label:"Canada"},{value:"I",label:"Italy"},{value:"AU",label:"Australia"},{value:"BR",label:"Brazil"},{value:"KR",label:"South Korea"},{value:"NL",label:"Netherlands"},{value:"E",label:"Spain"},{value:"S",label:"Sweden"},{value:"IL",label:"Israel"},{value:"AR",label:"Argentina"},{value:"MX",label:"Mexico"},{value:"ID",label:"Indonesia"},{value:"TR",label:"Turkey"},{value:"UA",label:"Ukraine"},{value:"MY",label:"Malaysia"},{value:"TW",label:"Taiwan"},{value:"SG",label:"Singapore"},{value:"SA",label:"Saudi Arabia"},{value:"UAE",label:"United Arab Emirates"},{value:"ZA",label:"South Africa"},{value:"EG",label:"Egypt"},{value:"IR",label:"Iran"},{value:"PK",label:"Pakistan"},{value:"BD",label:"Bangladesh"},{value:"VN",label:"Vietnam"},{value:"PH",label:"Philippines"},{value:"CL",label:"Chile"},{value:"PE",label:"Peru"},{value:"CO",label:"Colombia"},{value:"VE",label:"Venezuela"},{value:"DK",label:"Denmark"},{value:"N",label:"Norway"},{value:"FI",label:"Finland"},{value:"CH",label:"Switzerland"},{value:"AT",label:"Austria"},{value:"PL",label:"Poland"},{value:"CZ",label:"Czech Republic"},{value:"HU",label:"Hungary"},{value:"RO",label:"Romania"},{value:"BG",label:"Bulgaria"},{value:"GR",label:"Greece"},{value:"P",label:"Portugal"},{value:"T",label:"Thailand"},{value:"KZ",label:"Kazakhstan"},{value:"BY",label:"Belarus"},{value:"AZ",label:"Azerbaijan"},{value:"AM",label:"Armenia"},{value:"MD",label:"Moldova"},{value:"EE",label:"Estonia"},{value:"LV",label:"Latvia"},{value:"LT",label:"Lithuania"},{value:"SK",label:"Slovakia"},{value:"SI",label:"Slovenia"},{value:"HR",label:"Croatia"},{value:"IE",label:"Ireland"},{value:"L",label:"Luxembourg"},{value:"B",label:"Belgium"},{value:"MC",label:"Monaco"},{value:"NZ",label:"New Zealand"},{value:"NG",label:"Nigeria"},{value:"GH",label:"Ghana"},{value:"KE",label:"Kenya"},{value:"RW",label:"Rwanda"},{value:"ET",label:"Ethiopia"},{value:"AO",label:"Angola"},{value:"UG",label:"Uganda"},{value:"ZW",label:"Zimbabwe"},{value:"BW",label:"Botswana"},{value:"SN",label:"Senegal"},{value:"DJ",label:"Djibouti"},{value:"MA",label:"Morocco"},{value:"DZ",label:"Algeria"},{value:"TN",label:"Tunisia"},{value:"SD",label:"Sudan"},{value:"QA",label:"Qatar"},{value:"KW",label:"Kuwait"},{value:"BH",label:"Bahrain"},{value:"OM",label:"Oman"},{value:"JO",label:"Jordan"},{value:"LK",label:"Sri Lanka"},{value:"NP",label:"Nepal"},{value:"BT",label:"Bhutan"},{value:"MN",label:"Mongolia"},{value:"KP",label:"North Korea"},{value:"LA",label:"Laos"},{value:"MU",label:"Mauritius"},{value:"EC",label:"Ecuador"},{value:"BO",label:"Bolivia"},{value:"UY",label:"Uruguay"},{value:"PY",label:"Paraguay"},{value:"CR",label:"Costa Rica"},{value:"GT",label:"Guatemala"},{value:"PR",label:"Puerto Rico"},{value:"PG",label:"Papua New Guinea"},{value:"HK",label:"Hong Kong"},{value:"HKUK",label:"Hong Kong (UK)"},{value:"CYM",label:"Cayman Islands"},{value:"BM",label:"Bermuda"},{value:"MYM",label:"Myanmar"},{value:"BGN",label:"Bangladesh (alt)"},{value:"SU",label:"Soviet Union (legacy)"},{value:"CSSR",label:"Czechoslovakia (legacy)"},{value:"CSFR",label:"Czech and Slovak Federal Republic (legacy)"},{value:"I-INT",label:"International (Italy-led)"},{value:"I-ESRO",label:"ESRO (European Space Research Organisation)"},{value:"I-NATO",label:"NATO"},{value:"I-ESA",label:"European Space Agency"},{value:"I-EUT",label:"EUTELSAT"},{value:"I-ARAB",label:"Arab League"},{value:"I-EUM",label:"EUMETSAT"},{value:"I-INM",label:"INMARSAT"},{value:"I-RASC",label:"Regional African Satellite Communications"},{value:"I-EU",label:"European Union"},{value:"UNK",label:"Unknown"},{value:"NULL",label:"Not specified"}],placeholder:"Select countries..."},{id:"altitude_range",label:"Altitude Range",type:"km-range",min:0,max:5e4,unit:"km"},{id:"inclination_range",label:"Inclination",type:"degrees-range",min:0,max:180,unit:"°"},{id:"bstar_range",label:"B*Drag",type:"km-range",min:0,max:1,unit:""},{id:"period_range",label:"Period",type:"km-range",min:0,max:1440,unit:"min"},{id:"weight_range",label:"Weight",type:"km-range",min:0,max:1e4,unit:"kg"},{id:"launch_date_range",label:"Launch Date",type:"date-range",placeholder:"Select date range..."},{id:"satellite_age",label:"Age",type:"age-range",min:0,max:2e4,unit:"days"},{id:"name_pattern",label:"Name Pattern",type:"regex",placeholder:"e.g., STARLINK.*",description:"Regular expression for satellite names"},{id:"constellation",label:"Constellation",type:"select-single",dataSource:"constellations",placeholder:"Select constellation...",defaultValue:"all"},{id:"hardware",label:"Hardware",type:"select-single",dataSource:"hardware_names",placeholder:"Any hardware"},{id:"radio_service",label:"Radio",type:"select-single",options:[{value:"all",label:"Any"},{value:"any_radio",label:"Has radio"},{value:"Amateur",label:"Amateur"},{value:"Meteorological",label:"Meteorological"},{value:"Earth Exploration",label:"Earth Exploration"},{value:"Space Research",label:"Space Research"},{value:"Radionavigational",label:"Navigation"},{value:"Broadcasting",label:"Broadcasting"},{value:"two_way",label:"Two-way (has uplink)"}],defaultValue:"all"}],callbacks:{onFieldChange:(r,c)=>{this._handleFilterFieldChange(r,c)},onSubmit:r=>{this._handleFilterSubmit(r)},onClear:()=>{this._handleFilterClear()},getDataSource:r=>this._getFilterDataSource(r)}},s=this._buildFilterUI(t);e.innerHTML=`
            <div id="load_sim_header">
                <h3>Load Visualizer</h3>
                <button type="button" class="close-button-inline" id="load_sim_close">✕</button>
            </div>

            <div id="loadSimTabs" class="flex gap-2 px-4 py-2 border-b border-gray-700">
                <div id="filterTab" class="help-tab active cursor-pointer px-3 py-1 rounded text-sm">Filters</div>
                <div id="historyTab" class="help-tab cursor-pointer px-3 py-1 rounded text-sm">History</div>
            </div>

            <div id="load_sim_content">
                ${s}

                <div class="filter-actions mt-4">
                    <div class="mb-2">
                        <div class="text-sm text-white text-center">
                            Total to be loaded: <span id="filter-pool-count" class="font-semibold">0</span> satellites
                        </div>
                    </div>
                    <div class="flex justify-end space-x-2">
                        <button id="filter-reset-btn" class="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded">
                            Reset
                        </button>
                        <button id="filter-add-btn" class="px-3 py-1 text-sm bg-yellow-600 hover:bg-yellow-700 text-white rounded">
                            Add 0
                        </button>
                        <button id="filter-go-btn" class="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded font-semibold">
                            Go!
                        </button>
                    </div>
                </div>
            </div>

            <div id="load_sim_history" style="display: none;">
                <!-- History content will be dynamically generated -->
            </div>
        `,document.body.appendChild(e),e._filterTemplate=t,e._satellitePool=new Set,e._satelliteQl=[];const a=document.getElementById("load_sim_close");a&&a.addEventListener("click",()=>{this.hideLoadSimPanel()});const i=document.getElementById("filterTab"),n=document.getElementById("historyTab"),o=document.getElementById("load_sim_content"),l=document.getElementById("load_sim_history");i&&n&&o&&l&&(i.addEventListener("click",()=>{i.classList.add("active"),n.classList.remove("active"),o.style.display="block",l.style.display="none"}),n.addEventListener("click",()=>{n.classList.add("active"),i.classList.remove("active"),o.style.display="none",l.style.display="block",this._rebuildHistoryPanel()})),this._setupFilterActionButtons(t)}_rebuildHistoryPanel(){const e=document.getElementById("load_sim_history");if(!e)return;const t=this.parent.sessionManager?this.parent.sessionManager.getData():null,s=t&&t.vis_load?t.vis_load:[];if(s.length===0)e.innerHTML=`
                <div class="p-6 text-center text-gray-400 text-sm">
                    <p>Select satellites by filter and load them to add quick-load options here.</p>
                </div>
            `;else{const i=s.slice(0,10);let n=`
                <div class="p-4">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-gray-700">
                                <th class="text-center py-2 px-2 text-gray-400">Action</th>
                                <th class="text-left py-2 px-2 text-gray-400">Date/Time</th>
                                <th class="text-center py-2 px-2 text-gray-400"></th>
                            </tr>
                        </thead>
                        <tbody>
            `;i.forEach((r,c)=>{n+=`
                    <tr class="border-b border-gray-800 hover:bg-gray-800">
                        <td class="py-2 px-2 text-center">
                            <button class="history-go-btn px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded" data-index="${c}">
                                Go
                            </button>
                        </td>
                        <td class="py-2 px-2 text-white">${r.label||"Unnamed"}</td>
                        <td class="py-2 px-2 text-center">
                            <button class="history-bin-btn px-2 py-1 text-xs text-gray-400 hover:text-red-500" data-index="${c}" title="Delete">
                                🗑️
                            </button>
                        </td>
                    </tr>
                `}),n+=`
                        </tbody>
                    </table>
                </div>
            `,e.innerHTML=n,e.querySelectorAll(".history-go-btn").forEach(r=>{r.addEventListener("click",async c=>{const g=parseInt(c.target.getAttribute("data-index")),u=s[g];if(!u||!u.filter||!Array.isArray(u.filter)){console.error("Invalid history entry:",u);return}const h=new Set;for(const b of u.filter)try{const _=await fetch(`${this.parent.apiBaseUrl}/satellites?${b}`,{headers:this.parent.apiKey?{"X-API-Key":this.parent.apiKey}:{}});if(!_.ok)throw new Error(`HTTP ${_.status}`);const y=await _.json();(Array.isArray(y)?y:y.data||[]).forEach(w=>{w&&h.add(w)})}catch(_){console.error("Failed to load satellites from history:",_)}const p=Array.from(h);p.length>0?(this.parent.setSatellites(void 0,void 0,p),this.hideLoadSimPanel()):console.warn("No satellites found for this history entry")})}),e.querySelectorAll(".history-bin-btn").forEach(r=>{r.addEventListener("click",c=>{const g=parseInt(c.target.getAttribute("data-index"));if(this.parent.sessionManager){const u=this.parent.sessionManager.getData();u&&u.vis_load&&Array.isArray(u.vis_load)&&(u.vis_load.splice(g,1),this.parent.sessionManager.saveData(u),this._rebuildHistoryPanel())}})})}}async populateLoaderPanel(){let e=document.getElementById("load_sim_panel");e||(await this._createLoadSimPanel(),e=document.getElementById("load_sim_panel")),e.style.display="block",e.offsetHeight,e.classList.add("slide-in"),this._disableSearchInterface(),e.offsetHeight}hideLoadSimPanel(){const e=document.getElementById("load_sim_panel");e&&(e.style.display="none",this._enableSearchInterface())}_disableSearchInterface(){this.searchInput&&(this.searchInput.disabled=!0,this.searchInput.style.opacity="0.5"),this.searchContainer&&this.searchContainer.style.display!=="none"&&this._hideIncrementalSearch()}_enableSearchInterface(){this.searchInput&&(this.searchInput.disabled=!1,this.searchInput.style.opacity="1")}_buildFilterUI(e){let t='<div class="filter-fields space-y-2">';return e.fields.forEach(s=>{t+=this._buildFilterField(s,e)}),t+="</div>",t}_buildFilterField(e,t){const s=`filter-${e.id}`;let a=`<div class="filter-field flex items-center gap-2" data-field-id="${e.id}">`;switch(a+=`<label class="text-xs font-medium text-gray-400 whitespace-nowrap min-w-[80px]" for="${s}" style="font-family: Arial, sans-serif;">
            ${e.label}:
        </label>`,a+='<div class="flex-1">',e.type){case"regex":a+=`
                    <input type="text"
                           id="${s}"
                           class="filter-input-compact bg-gray-700 border border-gray-600 text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-1 placeholder-gray-500"
                           placeholder="${e.placeholder||""}"
                           data-field-type="regex"
                           style="font-family: Arial, sans-serif; padding: 3px 7px;">`;break;case"select-single":const i=e.disabled?"disabled":"",n=e.disabled?"opacity-50 cursor-not-allowed":"";a+=`
                    <select id="${s}"
                            class="filter-select-compact bg-gray-700 border border-gray-600 text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 ${n}"
                            data-field-type="select-single"
                            ${e.dataSource?`data-source="${e.dataSource}"`:""}
                            ${i}
                            style="font-family: Arial, sans-serif; padding: 3px 7px;">
                        <option value="">${e.placeholder||"Select..."}</option>`,e.options&&e.options.forEach(r=>{const c=e.defaultValue===r.value?"selected":"";a+=`<option value="${r.value}" ${c}>${r.label}</option>`}),a+="</select>";break;case"select-multiple":a+=`
                    <div class="relative">
                        <button id="${s}"
                                type="button"
                                class="filter-multiselect-compact text-white bg-gray-700 hover:bg-gray-800 focus:ring-1 focus:outline-none focus:ring-blue-300 rounded-lg text-xs px-2 py-1 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-800 w-full justify-between"
                                data-field-type="select-multiple"
                                ${e.dataSource?`data-source="${e.dataSource}"`:""}
                                style="font-family: Arial, sans-serif; padding: 4px 9px;">
                            <span class="text-white truncate">${e.placeholder||"Select..."}</span>
                            <svg class="w-2.5 h-2.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                            </svg>
                        </button>
                        <!-- Dropdown menu with Flowbite styling -->
                        <div id="${s}-dropdown"
                             class="hidden absolute z-50 w-full bg-gray-700 divide-y divide-gray-600 rounded-lg shadow mt-1 max-h-40 overflow-y-auto">
                            <ul class="p-1 space-y-0.5 text-xs text-gray-200" style="font-family: Arial, sans-serif;">
                                <!-- Options will be populated here -->
                            </ul>
                        </div>
                    </div>`;break;case"km-range":case"degrees-range":case"age-range":const o=e.disabled?"disabled":"",l=e.disabled?"opacity-50 cursor-not-allowed":"";a+=`
                    <div class="flex items-center space-x-1 ${l}">
                        <input type="number"
                               id="${s}-min"
                               class="filter-range-compact bg-gray-700 border border-gray-600 text-white text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-20 p-1 placeholder-gray-500"
                               placeholder="Min"
                               min="${e.min||0}"
                               max="${e.max||""}"
                               value="${e.defaultMin||""}"
                               data-field-type="${e.type}"
                               data-range-part="min"
                               ${o}
                               style="font-family: Arial, sans-serif; padding: 3px 5px;">
                        <span class="text-gray-400" style="font-size: 11px;">–</span>
                        <input type="number"
                               id="${s}-max"
                               class="filter-range-compact bg-gray-700 border border-gray-600 text-white text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-20 p-1 placeholder-gray-500"
                               placeholder="Max"
                               min="${e.min||0}"
                               max="${e.max||""}"
                               value="${e.defaultMax||""}"
                               data-field-type="${e.type}"
                               data-range-part="max"
                               ${o}
                               style="font-family: Arial, sans-serif; padding: 3px 5px;">
                        <span class="text-gray-400" style="font-size: 11px;">${e.unit||""}</span>
                    </div>`;break;case"date-range":a+=`
                    <div class="flex items-center space-x-1">
                        <input type="date"
                               id="${s}-start"
                               class="filter-date-compact bg-gray-700 border border-gray-600 text-white text-xs rounded focus:ring-blue-500 focus:border-blue-500 block"
                               data-field-type="date-range"
                               data-range-part="start"
                               style="font-family: Arial, sans-serif; padding: 3px 5px;">
                        <span class="text-gray-400" style="font-size: 11px;">–</span>
                        <input type="date"
                               id="${s}-end"
                               class="filter-date-compact bg-gray-700 border border-gray-600 text-white text-xs rounded focus:ring-blue-500 focus:border-blue-500 block"
                               data-field-type="date-range"
                               data-range-part="end"
                               style="font-family: Arial, sans-serif; padding: 3px 5px;">
                    </div>`;break;case"age-days":a+=`
                    <div class="flex items-center space-x-1">
                        <span class="text-gray-400" style="font-size: 11px;">Max:</span>
                        <input type="number"
                               id="${s}"
                               class="filter-age-compact bg-gray-700 border border-gray-600 text-white text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-24 p-1 placeholder-gray-500"
                               placeholder="${e.placeholder||"Days"}"
                               min="0"
                               max="${e.max||""}"
                               data-field-type="age-days"
                               style="font-family: Arial, sans-serif; padding: 3px 5px;">
                        <span class="text-gray-400" style="font-size: 11px;">days</span>
                    </div>`;break}return a+="</div>",a+="</div>",a}async _setupFilterActionButtons(e){const t=document.getElementById("load_sim_panel");if(!t)return;let s=0,a=!1,i=!1;const n=()=>{const u=document.getElementById("filter-pool-count"),h=document.getElementById("filter-go-btn");u&&(u.textContent=t._satellitePool.size),h&&(h.disabled=t._satellitePool.size===0)},o=(u,h=!1)=>{const p=document.getElementById("filter-add-btn");if(p)if(h)p.innerHTML='<span class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>Loading...',p.disabled=!0;else{let b,_;typeof u=="number"?(b=u,_=0):(b=u.count||0,u.count_with_tle,_=u.count_without_tle||0),_>0?(p.innerHTML=`Add ${b} <span class="text-yellow-400" title="${_} of these do not have position (TLE) data">⚠</span>`,p.title=`${_} of these do not have position (TLE) data`):(p.textContent=`Add ${b}`,p.title=""),p.disabled=b===0||i,s=b}},l=document.getElementById("filter-reset-btn");l&&l.addEventListener("click",()=>{this._clearAllFilterFields(e),t._satellitePool.clear(),t._satelliteQl=[],n(),o(0),e.callbacks.onClear&&e.callbacks.onClear()});const r=document.getElementById("filter-add-btn");r&&r.addEventListener("click",()=>{if(s>0&&!i){i=!0,o(s,!0);const u=this._collectFilterData(e);console.log("Add button clicked - Filter data collected:",u),this._addSatellitesToPool(u,t._satellitePool,t._satelliteQl).then(()=>{n(),this._clearAllFilterFields(e),o(0)}).finally(()=>{i=!1})}});const c=document.getElementById("filter-go-btn");c&&c.addEventListener("click",()=>{if(t._satellitePool.size>0){const u=Array.from(t._satellitePool);if(this.parent.setSatellites(void 0,void 0,u),this.parent.sessionManager){let h=this.parent.sessionManager.getData();h.vis_load||(h.vis_load=[]);const p=new Date().toISOString().slice(0,16).replace("T"," ").replace(/(\d{4})-(\d{2})-(\d{2})/,"$1/$3/$2");h.vis_load.push({label:p,filter:t._satelliteQl}),this.parent.sessionManager.saveData(h)}t._satellitePool.clear(),t._satelliteQl=[],n(),this.hideLoadSimPanel()}});const g=e.callbacks.onFieldChange;e.callbacks.onFieldChange=(u,h)=>{g&&g(u,h),clearTimeout(this._filterUpdateTimeout),this._filterUpdateTimeout=setTimeout(()=>{if(!a){a=!0,o(0,!0);const p=this._collectFilterData(e);this._updateFilterMatchCount(p).then(b=>{o(b)}).finally(()=>{a=!1})}},300)},this._setupFieldChangeListeners(e),await this._loadDataSources(e),n(),o(0)}_setupFieldChangeListeners(e){e.fields.forEach(t=>{const s=`filter-${t.id}`;switch(t.type){case"regex":case"select-single":case"age-days":const a=document.getElementById(s);a&&a.addEventListener("change",()=>{e.callbacks.onFieldChange&&e.callbacks.onFieldChange(t.id,a.value)});break;case"select-multiple":this._setupMultiSelectField(s,t,e);break;case"km-range":case"degrees-range":case"age-range":["min","max"].forEach(i=>{const n=document.getElementById(`${s}-${i}`);n&&n.addEventListener("change",()=>{const o=document.getElementById(`${s}-min`).value,l=document.getElementById(`${s}-max`).value;e.callbacks.onFieldChange&&e.callbacks.onFieldChange(t.id,{min:o,max:l})})});break;case"date-range":["start","end"].forEach(i=>{const n=document.getElementById(`${s}-${i}`);n&&n.addEventListener("change",()=>{const o=document.getElementById(`${s}-start`).value,l=document.getElementById(`${s}-end`).value;e.callbacks.onFieldChange&&e.callbacks.onFieldChange(t.id,{start:o,end:l})})});break}})}_setupMultiSelectField(e,t,s){const a=document.getElementById(e),i=document.getElementById(`${e}-dropdown`);if(!a||!i||a._multiSelectInitialized)return;a._multiSelectInitialized=!0;const n=new Set;a._selectedValues=n;const o=c=>{c.stopPropagation(),i.classList.toggle("hidden")};a.addEventListener("click",o);const l=c=>{!a.contains(c.target)&&!i.contains(c.target)&&i.classList.add("hidden")};document.addEventListener("click",l),a._cleanupHandlers=()=>{a.removeEventListener("click",o),document.removeEventListener("click",l)};const r=()=>{const c=a.querySelector("span");if(n.size===0)c.className="text-white truncate",c.textContent=t.placeholder||"Select...";else{const g=Array.from(n).map(u=>{var p;const h=(p=t.options)==null?void 0:p.find(b=>b.value===u);return h?h.label:u});c.className="text-white truncate",g.length>2?c.textContent=`${g.length} selected`:c.textContent=g.join(", ")}};a._updateOptions=c=>{const g=i.querySelector("ul");g.innerHTML="",c.forEach(u=>{const h=document.createElement("li");h.innerHTML=`
                    <div class="flex items-center p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                        <input id="${e}-${u.value}"
                               type="checkbox"
                               value="${u.value}"
                               class="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-1 dark:bg-gray-600 dark:border-gray-500"
                               ${n.has(u.value)?"checked":""}>
                        <label for="${e}-${u.value}"
                               class="w-full ms-1 text-xs font-medium text-white cursor-pointer"
                               style="font-family: Arial, sans-serif;">
                            ${u.label}
                        </label>
                    </div>`;const p=h.querySelector('input[type="checkbox"]'),b=h.querySelector("label"),_=y=>{y.stopPropagation(),p.checked=!p.checked,p.checked?n.add(u.value):n.delete(u.value),r(),s.callbacks.onFieldChange&&s.callbacks.onFieldChange(t.id,Array.from(n))};p.addEventListener("change",y=>{y.stopPropagation(),p.checked?n.add(u.value):n.delete(u.value),r(),s.callbacks.onFieldChange&&s.callbacks.onFieldChange(t.id,Array.from(n))}),b.addEventListener("click",_),g.appendChild(h)})},r(),t.options&&Array.isArray(t.options)&&a._updateOptions(t.options),a._pendingOptions&&(a._updateOptions(a._pendingOptions),delete a._pendingOptions)}async _loadDataSources(e){for(const t of e.fields)if(t.dataSource&&e.callbacks.getDataSource){const s=`filter-${t.id}`,a=document.getElementById(s);if(a&&a._dataSourceLoaded)continue;try{const i=await e.callbacks.getDataSource(t.dataSource);i&&(this._populateFieldOptions(t,i),a&&(a._dataSourceLoaded=!0))}catch(i){console.error(`Failed to load data source for ${t.id}:`,i)}}}_populateFieldOptions(e,t){const s=`filter-${e.id}`;if(e.type==="select-single"){const a=document.getElementById(s);if(a){const i=a.querySelector('option[value=""]');a.innerHTML="",i&&a.appendChild(i),t.forEach(n=>{const o=document.createElement("option");o.value=n.value,o.textContent=n.label,n.disabled&&(o.disabled=!0),e.defaultValue===n.value&&(o.selected=!0),a.appendChild(o)})}}else if(e.type==="select-multiple"){const a=document.getElementById(s);a&&(a._updateOptions?a._updateOptions(t):a._pendingOptions=t)}}_collectFilterData(e){const t={};return e.fields.forEach(s=>{var i,n,o,l;const a=`filter-${s.id}`;switch(s.type){case"regex":case"select-single":case"age-days":const r=document.getElementById(a);r&&r.value&&(t[s.id]=r.value);break;case"km-range":case"degrees-range":case"age-range":const c=(i=document.getElementById(`${a}-min`))==null?void 0:i.value,g=(n=document.getElementById(`${a}-max`))==null?void 0:n.value;(c||g)&&(t[s.id]={min:c||null,max:g||null});break;case"date-range":const u=(o=document.getElementById(`${a}-start`))==null?void 0:o.value,h=(l=document.getElementById(`${a}-end`))==null?void 0:l.value;(u||h)&&(t[s.id]={start:u||null,end:h||null});break;case"select-multiple":const p=document.getElementById(a);p&&p._selectedValues&&(t[s.id]=Array.from(p._selectedValues));break}}),t}_clearAllFilterFields(e){e.fields.forEach(s=>{const a=`filter-${s.id}`;switch(s.type){case"regex":case"select-single":case"age-days":const i=document.getElementById(a);i&&(i.value=s.defaultValue||"");break;case"km-range":case"degrees-range":case"age-range":const n=document.getElementById(`${a}-min`),o=document.getElementById(`${a}-max`);n&&(n.value=s.defaultMin||""),o&&(o.value=s.defaultMax||"");break;case"date-range":document.getElementById(`${a}-start`).value="",document.getElementById(`${a}-end`).value="";break;case"select-multiple":const l=document.getElementById(a);if(l&&l._selectedValues){l._selectedValues.clear();const r=l.querySelector("span");r&&(r.className="text-white truncate",r.textContent=s.placeholder||"Select...");const c=document.getElementById(`${a}-dropdown`);c&&c.querySelectorAll('input[type="checkbox"]').forEach(u=>{u.checked=!1})}break}});const t=document.getElementById("filter-match-count");t&&(t.textContent="-")}_handleFilterFieldChange(e,t){console.log(`Filter field changed: ${e}`,t)}_buildFilterQueryParams(e){const t=new URLSearchParams;return t.set("fc","true"),Object.entries({a:"orbit_type",c:"altitude_range",d:"inclination_range",e:"raan_range",f:"bstar_range",g:"period_range",h:"weight_range",i:"launch_date_range",j:"satellite_age",k:"name_pattern",l:"constellation",m:"country",n:"hardware",o:"activity",p:"radio_service"}).forEach(([a,i])=>{const n=e[i];n!=null&&n!==""&&n!=="all"&&(Array.isArray(n)?n.length>0&&!n.includes("all")&&t.set(a,n.join(",")):typeof n=="object"&&n.min!==void 0&&n.max!==void 0?(n.min!==""||n.max!=="")&&t.set(a,`${n.min||""},${n.max||""}`):typeof n=="object"&&n.start!==void 0&&n.end!==void 0?(n.start!==""||n.end!=="")&&t.set(a,`${n.start||""},${n.end||""}`):t.set(a,n.toString()))}),console.log("Built filter query params:",t.toString()),t}async _updateFilterMatchCount(e){try{const t=this._buildFilterQueryParams(e),s=await fetch(`${this.parent.apiBaseUrl}/satellites?${t.toString()}`,{headers:this.parent.apiKey?{"X-API-Key":this.parent.apiKey}:{}});if(!s.ok)throw new Error(`HTTP ${s.status}`);const a=await s.json();return{count:a.count||0,count_with_tle:a.count_with_tle||0,count_without_tle:a.count_without_tle||0}}catch(t){return console.error("Failed to get filter match count:",t),0}}async _addSatellitesToPool(e,t,s){try{const a=this._buildFilterQueryParams(e);a.set("fc","false"),s&&(s.push(a.toString()),console.warn("Ql is now",s));const i=await fetch(`${this.parent.apiBaseUrl}/satellites?${a.toString()}`,{headers:this.parent.apiKey?{"X-API-Key":this.parent.apiKey}:{}});if(!i.ok)throw new Error(`HTTP ${i.status}`);const n=await i.json();(Array.isArray(n)?n:n.data||[]).forEach(l=>{l&&t.add(l)})}catch(a){console.error("Failed to add satellites to pool:",a)}}_handleFilterSubmit(e){console.log("Filter submitted:",e),this._showToast("Loading satellites with selected filters...","info"),setTimeout(()=>{this.hideLoadSimPanel()},1e3)}_handleFilterClear(){console.log("Filters cleared");const e=document.getElementById("filter-match-count");e&&(e.textContent="-")}async _getFilterDataSource(e){const t={constellations:async()=>{const s=await this._fetchConstellations(),a=new Set;Object.values($e).forEach(o=>{o.constellations.forEach(l=>a.add(l.name.toLowerCase()))});const i=[],n=[];return s.forEach(o=>{const l=Number(o.deployed_count)||0,r={value:o.constellation_id,label:`${o.constellation_name} (${l})`,disabled:l===0};a.has(o.constellation_name.toLowerCase())||a.has(String(o.constellation_id).toLowerCase())?i.push(r):n.push(r)}),i.sort((o,l)=>o.label.localeCompare(l.label)),n.sort((o,l)=>o.label.localeCompare(l.label)),[{value:"all",label:"All"},...i,...n.length?[{value:"",label:"──────────",disabled:!0}]:[],...n]},hardware_names:async()=>{try{const s=await fetch(`${this.parent.apiBaseUrl}/hardware-names`,{headers:this.parent.apiKey?{"X-API-Key":this.parent.apiKey}:{}});if(!s.ok)throw new Error(`HTTP ${s.status}`);return((await s.json()).data||[]).map(n=>({value:n.hardware_name,label:`${n.hardware_name} — ${n.constellation_name} (${n.sat_count})`}))}catch(s){return console.error("Failed to fetch hardware names:",s),[]}},orbit_types:()=>[{value:"LOE",label:"LOE (Low Earth Orbit)"},{value:"MEO",label:"MEO (Medium Earth Orbit)"},{value:"GEO",label:"GEO (Geostationary)"},{value:"GSO",label:"GSO (Geosynchronous)"},{value:"HEO",label:"HEO (Highly Elliptical)"},{value:"HEO_ELLIPTICAL",label:"HEO Elliptical"},{value:"SSO",label:"SSO (Sun-Synchronous)"},{value:"POLAR",label:"Polar"},{value:"RETROGRADE",label:"Retrograde"},{value:"CIRCULAR",label:"Circular"},{value:"ELLIPTICAL",label:"Elliptical"},{value:"GNSS",label:"GNSS (Navigation)"},{value:"MOLNIYA_TYPE",label:"Molniya Type"},{value:"SEMI_SYNC",label:"Semi-Synchronous"},{value:"ONEWEB_TYPE",label:"OneWeb Type"}]};return t[e]?await t[e]():[]}async _fetchConstellations(){try{const e=await fetch(`${this.parent.apiBaseUrl}/constellations`,{headers:this.parent.apiKey?{"X-API-Key":this.parent.apiKey}:{}});if(!e.ok)throw new Error(`HTTP ${e.status}`);return(await e.json()).data||[]}catch(e){return console.error("Failed to fetch constellations:",e),[{constellation_id:"starlink",constellation_name:"Starlink"},{constellation_id:"oneweb",constellation_name:"OneWeb"},{constellation_id:"kuiper",constellation_name:"Kuiper"}]}}}export{xt as BlueGlobeUI};
